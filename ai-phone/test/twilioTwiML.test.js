import assert from "node:assert/strict";
import test from "node:test";
import { createMediaStreamUrl, createVoiceResponse } from "../src/twilioTwiML.js";

test("creates websocket URL from public HTTPS URL", () => {
  assert.equal(
    createMediaStreamUrl({ publicUrl: "https://example.ngrok-free.app" }),
    "wss://example.ngrok-free.app/media"
  );
});

test("creates websocket URL from request headers", () => {
  assert.equal(
    createMediaStreamUrl({
      requestHeaders: {
        host: "voice.example.com",
        "x-forwarded-proto": "https"
      }
    }),
    "wss://voice.example.com/media"
  );
});

test("creates Twilio voice response", () => {
  const response = createVoiceResponse({
    publicUrl: "https://example.ngrok-free.app"
  });

  assert.match(response, /<Connect>/);
  assert.match(response, /<Stream url="wss:\/\/example.ngrok-free.app\/media" \/>/);
});
