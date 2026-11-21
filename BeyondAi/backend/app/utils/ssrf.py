import socket
import ipaddress
from urllib.parse import urlparse
from typing import List
from app.core.config import settings

def get_ip_addresses(hostname: str) -> List[str]:
    """Resolve a hostname to a list of IP addresses (both IPv4 and IPv6)."""
    ips = []
    try:
        # socket.getaddrinfo resolves both IPv4 and IPv6 addresses
        addr_info = socket.getaddrinfo(hostname, None, socket.AF_UNSPEC, socket.SOCK_STREAM)
        for item in addr_info:
            ip = item[4][0]
            if ip not in ips:
                ips.append(ip)
    except Exception:
        pass
    return ips

def is_safe_ip(ip_str: str) -> bool:
    """
    Check if an IP address is safe (publicly routable).
    Blocks loopback, private networks, link-local, multicast, and other reserved ranges.
    """
    try:
        # Strip brackets if it is an IPv6 address string with brackets
        clean_ip = ip_str.strip("[]")
        ip = ipaddress.ip_address(clean_ip)
    except ValueError:
        return False  # Invalid IP address representation

    # Check for IPv4-mapped IPv6 address (e.g. ::ffff:192.168.1.1)
    if hasattr(ip, "ipv4_mapped") and ip.ipv4_mapped:
        ip = ip.ipv4_mapped

    # Check for IPv4/IPv6 special cases
    if ip.is_loopback:          # 127.0.0.0/8, ::1
        return False
    if ip.is_private:           # 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, fc00::/7
        return False
    if ip.is_link_local:        # 169.254.0.0/16, fe80::/10
        return False
    if ip.is_multicast:         # 224.0.0.0/4, ff00::/8
        return False
    if ip.is_unspecified:       # 0.0.0.0, ::
        return False
    if ip.is_reserved:          # RFC 1112, etc.
        return False
        
    # Additional cloud metadata protection (specifically 169.254.169.254)
    if ip_str == "169.254.169.254" or clean_ip == "169.254.169.254":
        return False

    return True

def validate_url_for_ssrf(url: str) -> bool:
    """
    Validate a URL to ensure it does not resolve to an internal/private IP address.
    Allows private addresses only if settings.ALLOW_PRIVATE_TARGETS is True.
    """
    try:
        parsed_url = urlparse(url)
        hostname = parsed_url.hostname
        if not hostname:
            return False
            
        # If ALLOW_PRIVATE_TARGETS is enabled, we bypass private check but still validate host format
        if getattr(settings, "ALLOW_PRIVATE_TARGETS", False):
            return True

        resolved_ips = get_ip_addresses(hostname)
        if not resolved_ips:
            return False  # Host doesn't resolve to any IP address

        # Ensure ALL resolved IPs are safe
        for ip in resolved_ips:
            if not is_safe_ip(ip):
                return False
                
        return True
    except Exception:
        return False
