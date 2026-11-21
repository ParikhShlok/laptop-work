"use client";

import { FormEvent, useState } from "react";

type Finding = {
  title: string;
  severity: "High" | "Medium" | "Low";
  evidence: string;
  fix: string;
};

const safeChecks = [
  { name: "Instruction protection", description: "Checks whether a harmless injection attempt is resisted." },
  { name: "Canary-secret protection", description: "Checks whether a fake marker leaks from approved test context." },
  { name: "Tenant separation", description: "Checks that a test identity cannot request another test identity's data." },
  { name: "Tool confirmation", description: "Checks that simulated sensitive actions need explicit approval." },
  { name: "Unsafe output handling", description: "Checks whether generated links or commands are clearly treated as untrusted." }
];

function getDemoFindings(): Finding[] {
  return [
    {
      title: "Prompt injection needs stronger boundaries",
      severity: "Medium",
      evidence: "Demo check: the test assistant acknowledged an attempt to replace its task instructions.",
      fix: "Separate trusted instructions from untrusted content, restrict tool permissions, and require server-side authorization for each action."
    },
    {
      title: "Sensitive tool actions require approval",
      severity: "High",
      evidence: "Demo check: a simulated email-send request did not require a user confirmation step.",
      fix: "Add an explicit approval screen and use least-privilege, allowlisted tool parameters."
    },
    {
      title: "Tenant isolation check passed",
      severity: "Low",
      evidence: "Demo check: the test assistant did not return the other test user's record.",
      fix: "Keep row-level authorization on the server and rerun this check after RAG or database changes."
    }
  ];
}

export default function Home() {
  const [appName, setAppName] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [running, setRunning] = useState(false);
  const [findings, setFindings] = useState<Finding[] | null>(null);
  const [error, setError] = useState("");

  function runScan(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!appName.trim() || !endpoint.trim() || !authorized) {
      setError("Enter an app name and authorized staging endpoint, then confirm that you own it or have written permission.");
      return;
    }
    setRunning(true);
    window.setTimeout(() => { setFindings(getDemoFindings()); setRunning(false); }, 1100);
  }

  return (
    <main>
      <section className="hero">
        <p className="eyebrow">AEGISSCAN · AUTHORIZED AI SECURITY TESTING</p>
        <h1>Test your AI app safely,<br />before your users do.</h1>
        <p className="lede">A focused MVP for staging environments: safe checks, clear evidence, and practical fixes.</p>
      </section>

      <section className="grid">
        <form className="card" onSubmit={runScan}>
          <h2>Start an approved scan</h2>
          <p className="muted">This MVP runs a local demonstration only. Do not enter a third-party target unless you have written authorization.</p>
          <label>Application name<input value={appName} onChange={(e) => setAppName(e.target.value)} placeholder="Acme Support Assistant" /></label>
          <label>Staging API endpoint<input type="url" value={endpoint} onChange={(e) => setEndpoint(e.target.value)} placeholder="https://staging.example.com/chat" /></label>
          <label className="check"><input type="checkbox" checked={authorized} onChange={(e) => setAuthorized(e.target.checked)} /> I own this system or have written authorization to test it.</label>
          {error && <p className="error">{error}</p>}
          <button disabled={running}>{running ? "Running safe demo checks…" : "Run safe demo scan"}</button>
        </form>

        <aside className="card">
          <h2>What the scan checks</h2>
          <ul>{safeChecks.map((check) => <li key={check.name}><strong>{check.name}</strong><span>{check.description}</span></li>)}</ul>
          <p className="notice">Only synthetic prompts and fake canary markers should be used. Never use real customer data, real secrets, or destructive actions in automated tests.</p>
        </aside>
      </section>

      {findings && <section className="results">
        <div><p className="eyebrow">DEMO RESULTS · {appName.toUpperCase()}</p><h2>2 items need attention</h2></div>
        {findings.map((finding) => <article className="finding" key={finding.title}>
          <span className={`severity ${finding.severity.toLowerCase()}`}>{finding.severity}</span>
          <h3>{finding.title}</h3><p><strong>Evidence:</strong> {finding.evidence}</p><p><strong>Recommended fix:</strong> {finding.fix}</p>
        </article>)}
        <p className="muted">These are simulated results. Connect a customer-approved staging integration before making real security claims.</p>
      </section>}
    </main>
  );
}
