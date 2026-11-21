import { assistantProfile } from "./assistantProfile.js";

const fieldLabels = {
  name: "your name",
  phoneNumber: "your phone number",
  reason: "the reason for calling",
  urgency: "how urgent this is",
  callbackTime: "a preferred callback time",
  organization: "your organization",
  email: "your email",
  purpose: "the purpose of the meeting",
  preferredDate: "your preferred date",
  preferredTime: "your preferred time",
  company: "your company",
  objective: "what you'd like to discuss or achieve"
};

const flows = {
  message: ["name", "phoneNumber", "reason", "urgency", "callbackTime"],
  meeting: [
    "name",
    "organization",
    "phoneNumber",
    "email",
    "purpose",
    "preferredDate",
    "preferredTime"
  ],
  business: ["name", "company", "phoneNumber", "email", "objective"]
};

export class CallSession {
  constructor(profile = assistantProfile) {
    this.profile = profile;
    this.turns = [];
    this.flow = null;
    this.fields = {};
    this.closed = false;
    this.started = false;
    this.importantDetails = [];
  }

  start() {
    this.started = true;
    return this.profile.openingGreeting;
  }

  receive(callerText) {
    const text = normalize(callerText);

    if (!text) {
      return "Sorry, I didn't catch that. Could you say that again?";
    }

    this.turns.push({ speaker: "caller", text: callerText });

    if (isGoodbye(text)) {
      this.closed = true;
      return this.profile.closeResponse;
    }

    if (isEmergency(text)) {
      this.fields.urgency = "Emergency";
      this.importantDetails.push(callerText);
      return this.profile.emergencyResponse;
    }

    if (asksForSensitiveInfo(text)) {
      this.importantDetails.push(`Sensitive request refused: ${callerText}`);
      return this.profile.sensitiveInfoResponse;
    }

    if (asksIdentity(text)) {
      return "No, I'm Shlok's assistant and I'm helping manage his calls.";
    }

    if (asksIfAi(text)) {
      return "Yes, I'm Shlok's AI assistant helping answer calls when he's unavailable.";
    }

    if (!this.flow) {
      this.flow = detectFlow(text);
      applyExtractedDetails(this.fields, callerText);

      if (this.flow) {
        this.importantDetails.push(callerText);
        return this.askNextField();
      }

      if (isTechnicalQuestion(text, this.profile.interests)) {
        this.flow = "message";
        this.fields.reason = callerText;
        this.importantDetails.push(callerText);
        return "I can make a note about that for Shlok. Could you tell me your name?";
      }

      this.flow = "message";
      this.fields.reason = callerText;
      this.importantDetails.push(callerText);
      return "Sure, I can pass that to Shlok. Could you tell me your name?";
    }

    this.captureCurrentField(callerText);
    applyExtractedDetails(this.fields, callerText);

    const nextQuestion = this.askNextField();
    if (nextQuestion) {
      return nextQuestion;
    }

    return this.confirmCollectedDetails();
  }

  askNextField() {
    const missingField = this.getMissingField();

    if (!missingField) {
      return null;
    }

    return `Got it. Could you share ${fieldLabels[missingField]}?`;
  }

  captureCurrentField(callerText) {
    const missingField = this.getMissingField();

    if (!missingField) {
      this.importantDetails.push(callerText);
      return;
    }

    this.fields[missingField] = cleanValue(callerText);
  }

  getMissingField() {
    const expectedFields = flows[this.flow] ?? flows.message;
    return expectedFields.find((field) => !this.fields[field]);
  }

  confirmCollectedDetails() {
    if (this.flow === "meeting") {
      this.closed = true;
      return `Thanks. I'll pass those details to Shlok and he'll confirm availability. ${this.profile.closeResponse}`;
    }

    this.closed = true;
    const name = this.fields.name ? `, ${this.fields.name}` : "";
    return `Thanks${name}. I've noted everything and will pass it to Shlok. Have a great day.`;
  }

  getSummary() {
    return {
      "CALLER NAME": this.fields.name ?? "Unknown",
      "PHONE NUMBER": this.fields.phoneNumber ?? "Unknown",
      PURPOSE: this.getPurpose(),
      "IMPORTANT DETAILS": this.importantDetails.join(" | ") || "None captured",
      "FOLLOW-UP REQUIRED": this.closed ? "Yes" : "Pending call completion",
      URGENCY: this.fields.urgency ?? "Normal",
      "CALLBACK REQUESTED": this.fields.callbackTime ? "Yes" : "Unknown"
    };
  }

  formatSummary() {
    const summary = this.getSummary();
    return Object.entries(summary)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
  }

  getPurpose() {
    if (this.flow === "meeting") {
      return this.fields.purpose ?? "Meeting request";
    }

    if (this.flow === "business") {
      return this.fields.objective ?? "Business inquiry";
    }

    return this.fields.reason ?? "General message";
  }
}

function normalize(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function cleanValue(value) {
  return String(value ?? "").trim();
}

function detectFlow(text) {
  if (includesAny(text, ["meeting", "appointment", "schedule", "calendar", "available"])) {
    return "meeting";
  }

  if (
    includesAny(text, [
      "project",
      "collaboration",
      "startup",
      "freelance",
      "freelancing",
      "partnership",
      "business",
      "proposal"
    ])
  ) {
    return "business";
  }

  if (includesAny(text, ["message", "call me", "call back", "callback", "reach me"])) {
    return "message";
  }

  return null;
}

function isEmergency(text) {
  return includesAny(text, [
    "medical emergency",
    "fire",
    "violence",
    "self-harm",
    "suicide",
    "threat",
    "immediate danger",
    "accident"
  ]);
}

function asksForSensitiveInfo(text) {
  return includesAny(text, [
    "password",
    "otp",
    "bank detail",
    "account detail",
    "private message",
    "address",
    "login",
    "api key",
    "secret key",
    "confidential"
  ]);
}

function asksIdentity(text) {
  return includesAny(text, ["are you shlok", "is this shlok", "am i speaking to shlok"]);
}

function asksIfAi(text) {
  return includesAny(text, ["are you ai", "are you an ai", "robot", "artificial intelligence"]);
}

function isGoodbye(text) {
  return includesAny(text, ["bye", "goodbye", "that's all", "thank you", "thanks"]);
}

function isTechnicalQuestion(text, interests) {
  return interests.some((interest) => text.includes(interest)) || text.includes("technical");
}

function includesAny(text, patterns) {
  return patterns.some((pattern) => text.includes(pattern));
}

function applyExtractedDetails(fields, text) {
  const phoneNumber = text.match(/(?:\+?\d[\d\s-]{7,}\d)/)?.[0];
  const email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];

  if (phoneNumber && !fields.phoneNumber) {
    fields.phoneNumber = phoneNumber.trim();
  }

  if (email && !fields.email) {
    fields.email = email.trim();
  }
}
