import http from "node:http";
import { WebSocketServer } from "ws";
import { getConfig, requireOpenAIKey } from "./config.js";
import { RealtimeBridge } from "./realtimeBridge.js";
import { createVoiceResponse } from "./twilioTwiML.js";

const config = getConfig();
requireOpenAIKey(config);

const server = http.createServer((request, response) => {
  if (request.url === "/voice" && request.method === "POST") {
    respondTwilioVoice(request, response);
    return;
  }

  if (request.url === "/health") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ ok: true }));
    return;
  }

  response.writeHead(404, { "Content-Type": "text/plain" });
  response.end("Not found");
});

const mediaServer = new WebSocketServer({ noServer: true });

server.on("upgrade", (request, socket, head) => {
  const { pathname } = new URL(request.url, "http://localhost");

  if (pathname !== "/media") {
    socket.destroy();
    return;
  }

  mediaServer.handleUpgrade(request, socket, head, (webSocket) => {
    mediaServer.emit("connection", webSocket, request);
  });
});

mediaServer.on("connection", (twilioSocket) => {
  console.log("Twilio media WebSocket connected.");

  const bridge = new RealtimeBridge({ twilioSocket, config });
  bridge.connect();

  twilioSocket.on("message", (data) => bridge.handleTwilioMessage(data));
  twilioSocket.on("close", () => bridge.close());
  twilioSocket.on("error", (error) => {
    console.error("Twilio WebSocket error:", error.message);
    bridge.close();
  });
});

server.listen(config.port, () => {
  console.log(`Phone server listening on http://localhost:${config.port}`);
  console.log(`Twilio voice webhook: ${config.publicUrl || "https://YOUR_DOMAIN"}/voice`);
});

function respondTwilioVoice(request, response) {
  const twiml = createVoiceResponse({
    publicUrl: config.publicUrl,
    requestHeaders: request.headers
  });

  response.writeHead(200, { "Content-Type": "text/xml" });
  response.end(twiml);
}
