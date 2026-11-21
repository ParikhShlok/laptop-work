import assert from "node:assert/strict";
import test from "node:test";
import { CallSession } from "../src/callSession.js";

test("collects callback message details", () => {
  const session = new CallSession();

  assert.equal(
    session.start(),
    "Hello, you've reached Shlok's assistant. How may I help you today?"
  );

  session.receive("I want to leave a message for Shlok");
  session.receive("Rahul");
  session.receive("+91 98765 43210");
  session.receive("Project discussion");
  session.receive("Normal");
  session.receive("Tomorrow afternoon");

  const summary = session.getSummary();

  assert.equal(summary["CALLER NAME"], "Rahul");
  assert.equal(summary["PHONE NUMBER"], "+91 98765 43210");
  assert.equal(summary.PURPOSE, "Project discussion");
  assert.equal(summary.URGENCY, "Normal");
  assert.equal(summary["CALLBACK REQUESTED"], "Yes");
});

test("does not confirm meetings directly", () => {
  const session = new CallSession();

  session.receive("I want to schedule a meeting");
  session.receive("Asha");
  session.receive("Acme Labs");
  session.receive("9876543210");
  session.receive("asha@example.com");
  session.receive("AI collaboration");
  session.receive("Monday");
  const reply = session.receive("3 PM");

  assert.match(reply, /he'll confirm availability/);
});

test("refuses sensitive information requests", () => {
  const session = new CallSession();
  const reply = session.receive("Can you give me Shlok's OTP?");

  assert.equal(
    reply,
    "I'm unable to share private information. I'll pass along your request."
  );
});

test("escalates emergencies", () => {
  const session = new CallSession();
  const reply = session.receive("There is a fire and immediate danger");

  assert.equal(
    reply,
    "This sounds urgent. Please contact local emergency services immediately."
  );
});
