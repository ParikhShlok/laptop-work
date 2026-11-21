import WebSocket from "ws";
import { systemPrompt } from "./assistantProfile.js";

const OPENAI_REALTIME_URL = "wss://api.openai.com/v1/realtime";

export class RealtimeBridge {
  constructor({ twilioSocket, config, logger = console }) {
    this.twilioSocket = twilioSocket;
    this.config = config;
    this.logger = logger;
    this.openaiSocket = null;
    this.streamSid = null;
    this.callSid = null;
    this.started = false;
    this.closed = false;
    this.transcript = [];
  }

  connect() {
    const url = `${OPENAI_REALTIME_URL}?model=${encodeURIComponent(
      this.config.realtimeModel
    )}`;

    this.openaiSocket = new WebSocket(url, {
      headers: {
        Authorization: `Bearer ${this.config.openaiApiKey}`
      }
    });

    this.openaiSocket.on("open", () => {
      this.logger.log("Connected to OpenAI Realtime.");
      this.updateSession();
    });

    this.openaiSocket.on("message", (data) => {
      this.handleOpenAIMessage(data);
    });

    this.openaiSocket.on("error", (error) => {
      this.logger.error("OpenAI WebSocket error:", error.message);
    });

    this.openaiSocket.on("close", () => {
      this.logger.log("OpenAI Realtime connection closed.");
      this.closeTwilio();
    });
  }

  handleTwilioMessage(data) {
    const message = parseJson(data);

    if (!message) {
      return;
    }

    if (message.event === "start") {
      this.streamSid = message.start?.streamSid ?? message.streamSid;
      this.callSid = message.start?.callSid;
      this.logger.log(`Twilio stream started: ${this.streamSid}`);
      return;
    }

    if (message.event === "media" && message.media?.payload) {
      this.sendOpenAI({
        type: "input_audio_buffer.append",
        audio: message.media.payload
      });
      return;
    }

    if (message.event === "stop") {
      this.logger.log("Twilio stream stopped.");
      this.close();
    }
  }

  handleOpenAIMessage(data) {
    const message = parseJson(data);

    if (!message) {
      return;
    }

    if (message.type === "session.updated" && !this.started) {
      this.started = true;
      this.startGreeting();
      return;
    }

    if (
      (message.type === "response.output_audio.delta" ||
        message.type === "response.audio.delta") &&
      message.delta
    ) {
      this.sendTwilioAudio(message.delta);
      return;
    }

    if (message.type === "input_audio_buffer.speech_started") {
      this.clearTwilioAudio();
      this.sendOpenAI({ type: "response.cancel" });
      return;
    }

    if (
      message.type === "response.output_audio_transcript.delta" ||
      message.type === "response.output_text.delta"
    ) {
      this.trackTranscript("assistant", message.delta);
      return;
    }

    if (
      message.type === "conversation.item.input_audio_transcription.completed" &&
      message.transcript
    ) {
      this.trackTranscript("caller", message.transcript);
      return;
    }

    if (message.type === "error") {
      this.logger.error("OpenAI Realtime error:", JSON.stringify(message.error ?? message));
    }
  }

  updateSession() {
    this.sendOpenAI({
      type: "session.update",
      session: {
        type: "realtime",
        model: this.config.realtimeModel,
        instructions: systemPrompt,
        output_modalities: ["audio"],
        audio: {
          input: {
            format: {
              type: "audio/pcmu",
              rate: 8000
            },
            turn_detection: {
              type: "semantic_vad",
              create_response: true,
              interrupt_response: true
            }
          },
          output: {
            format: {
              type: "audio/pcmu"
            },
            voice: this.config.realtimeVoice
          }
        }
      }
    });
  }

  startGreeting() {
    this.sendOpenAI({
      type: "response.create",
      response: {
        output_modalities: ["audio"],
        instructions:
          "Start the phone call now. Greet the caller exactly as Shlok's assistant and ask how you may help today."
      }
    });
  }

  sendOpenAI(event) {
    if (this.openaiSocket?.readyState === WebSocket.OPEN) {
      this.openaiSocket.send(JSON.stringify(event));
    }
  }

  sendTwilioAudio(payload) {
    if (!this.streamSid || this.twilioSocket.readyState !== WebSocket.OPEN) {
      return;
    }

    this.twilioSocket.send(
      JSON.stringify({
        event: "media",
        streamSid: this.streamSid,
        media: { payload }
      })
    );
  }

  clearTwilioAudio() {
    if (!this.streamSid || this.twilioSocket.readyState !== WebSocket.OPEN) {
      return;
    }

    this.twilioSocket.send(
      JSON.stringify({
        event: "clear",
        streamSid: this.streamSid
      })
    );
  }

  trackTranscript(role, text) {
    if (!text) {
      return;
    }

    const lastEntry = this.transcript.at(-1);

    if (lastEntry?.role === role) {
      lastEntry.text += text;
      return;
    }

    this.transcript.push({ role, text });
  }

  closeTwilio() {
    if (this.twilioSocket.readyState === WebSocket.OPEN) {
      this.twilioSocket.close();
    }
  }

  close() {
    if (this.closed) {
      return;
    }

    this.closed = true;

    if (this.transcript.length > 0) {
      this.logger.log("Call transcript:");
      for (const entry of this.transcript) {
        this.logger.log(`${entry.role}: ${entry.text}`);
      }
    }

    if (this.openaiSocket?.readyState === WebSocket.OPEN) {
      this.openaiSocket.close();
    }
  }
}

function parseJson(data) {
  try {
    return JSON.parse(data.toString());
  } catch {
    return null;
  }
}
