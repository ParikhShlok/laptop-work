import httpx
from urllib.parse import urlparse
from app.models.finding import Finding
from app.models.scan import Scan
from sqlalchemy.orm import Session
from datetime import datetime

# Common security headers to look for
REQUIRED_HEADERS = {
    "Strict-Transport-Security": {
        "title": "Missing HTTP Strict Transport Security (HSTS) Header",
        "description": "The HSTS header directs browsers to interact with the server only over HTTPS connection, mitigating MITM attacks.",
        "recommendation": "Configure your server to send the 'Strict-Transport-Security' header with a suitable 'max-age'.",
        "severity": "MEDIUM"
    },
    "Content-Security-Policy": {
        "title": "Missing Content Security Policy (CSP)",
        "description": "CSP helps detect and mitigate certain types of attacks, including Cross-Site Scripting (XSS) and data injection attacks.",
        "recommendation": "Configure a Content Security Policy that restricts resource loading to trusted domains.",
        "severity": "HIGH"
    },
    "X-Frame-Options": {
        "title": "Missing X-Frame-Options Header",
        "description": "The X-Frame-Options header protects users against clickjacking attacks by preventing content from being embedded in frames/iframes.",
        "recommendation": "Set the 'X-Frame-Options' header to 'DENY' or 'SAMEORIGIN'.",
        "severity": "LOW"
    },
    "X-Content-Type-Options": {
        "title": "Missing X-Content-Type-Options Header",
        "description": "This header prevents browsers from MIME-sniffing a response away from the declared content-type.",
        "recommendation": "Set the 'X-Content-Type-Options' header to 'nosniff'.",
        "severity": "LOW"
    },
    "Referrer-Policy": {
        "title": "Missing Referrer-Policy Header",
        "description": "Referrer-Policy governs how much referrer information (sent via the Referer header) should be included with requests.",
        "recommendation": "Implement a 'Referrer-Policy' header such as 'strict-origin-when-cross-origin'.",
        "severity": "LOW"
    }
}

async def run_header_compliance_scan(db: Session, scan: Scan, target_url: str):
    """
    Safely connect to the target website, download public HTTP headers,
    and verify compliance against standard security practices.
    """
    from app.utils.ssrf import validate_url_for_ssrf
    from app.services.audit import log_audit_event
    from urllib.parse import urljoin

    scan.status = "RUNNING"
    db.commit()

    findings_found = []
    score_penalty = 0

    try:
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=False) as client:
            current_url = target_url
            max_redirects = 5
            redirect_count = 0
            response = None

            while True:
                # Validate current URL against SSRF
                if not validate_url_for_ssrf(current_url):
                    raise ValueError(f"SSRF Protection: Blocked connection to private or loopback destination: {current_url}")

                response = await client.get(current_url)

                # Process redirects manually to scan target URL change
                if response.status_code in (301, 302, 303, 307, 308):
                    location = response.headers.get("location")
                    if not location:
                        break
                    current_url = urljoin(current_url, location)
                    redirect_count += 1
                    if redirect_count > max_redirects:
                        raise ValueError("SSRF Protection: Max redirect limit exceeded.")
                else:
                    break

            headers = response.headers

            # 1. Audit Security Headers
            for header_name, details in REQUIRED_HEADERS.items():
                if header_name not in headers:
                    finding = Finding(
                        scan_id=scan.id,
                        title=details["title"],
                        category="Security Headers",
                        severity=details["severity"],
                        confidence="HIGH",
                        description=details["description"],
                        affected_component=header_name,
                        recommendation=details["recommendation"],
                        scanner_source="passive_header_compliance"
                    )
                    findings_found.append(finding)
                    
                    # Deduct score based on severity
                    if details["severity"] == "HIGH":
                        score_penalty += 25
                    elif details["severity"] == "MEDIUM":
                        score_penalty += 15
                    else:
                        score_penalty += 5

            # 2. Check for Information Leakage Headers
            leakage_headers = ["Server", "X-Powered-By", "X-AspNet-Version"]
            for header in leakage_headers:
                if header in headers:
                    val = headers[header]
                    # We flag it if it discloses specific version info
                    finding = Finding(
                        scan_id=scan.id,
                        title=f"Information Disclosure via '{header}' Header",
                        category="Information Disclosure",
                        severity="INFO",
                        confidence="HIGH",
                        description=f"The server returned the header '{header}: {val}', which can expose implementation details of the environment.",
                        affected_component=header,
                        evidence=f"{header}: {val}",
                        recommendation=f"Remove the '{header}' header or minimize the information it reveals.",
                        scanner_source="passive_header_compliance"
                    )
                    findings_found.append(finding)

            # 3. Check Cookies for Secure/HttpOnly flags
            cookie_headers = response.headers.get_list("set-cookie")
            for cookie in cookie_headers:
                cookie_lower = cookie.lower()
                cookie_name = cookie.split("=")[0] if "=" in cookie else "unknown"
                
                missing_flags = []
                if "httponly" not in cookie_lower:
                    missing_flags.append("HttpOnly")
                if "secure" not in cookie_lower:
                    missing_flags.append("Secure")
                
                if missing_flags:
                    finding = Finding(
                        scan_id=scan.id,
                        title=f"Insecure Cookie Configuration ({cookie_name})",
                        category="Cookies",
                        severity="MEDIUM" if "HttpOnly" in missing_flags else "LOW",
                        confidence="HIGH",
                        description=f"The cookie '{cookie_name}' is set without the following security flags: {', '.join(missing_flags)}.",
                        affected_component="Set-Cookie",
                        evidence=cookie,
                        recommendation=f"Ensure that the cookie '{cookie_name}' has the 'HttpOnly' and 'Secure' attributes set, especially when carrying session identifiers.",
                        scanner_source="passive_header_compliance"
                    )
                    findings_found.append(finding)
                    score_penalty += 10

            # Calculate final score
            overall_score = max(100 - score_penalty, 0)
            
            # Save findings
            for f in findings_found:
                db.add(f)
            
            scan.status = "COMPLETED"
            scan.overall_score = overall_score
            scan.completed_at = datetime.utcnow()

            # Record audit log
            log_audit_event(
                db=db,
                user_id=scan.target.user_id,
                action="SCAN_COMPLETED",
                target_id=scan.target_id,
                scan_id=scan.id,
                metadata_json={"overall_score": overall_score, "findings_count": len(findings_found)}
            )

    except Exception as e:
        scan.status = "FAILED"
        scan.error_message = str(e)
        scan.completed_at = datetime.utcnow()

        # Record audit log on failure
        try:
            log_audit_event(
                db=db,
                user_id=scan.target.user_id,
                action="SCAN_FAILED",
                target_id=scan.target_id,
                scan_id=scan.id,
                metadata_json={"error": str(e)}
            )
        except Exception:
            pass

    db.commit()
