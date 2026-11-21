export function createVoiceResponse({ publicUrl, requestHeaders = {} } = {}) {
  const mediaUrl = createMediaStreamUrl({ publicUrl, requestHeaders });

  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="${escapeXml(mediaUrl)}" />
  </Connect>
</Response>`;
}

export function createMediaStreamUrl({ publicUrl, requestHeaders = {} } = {}) {
  if (publicUrl) {
    return `${toWebSocketBaseUrl(publicUrl)}/media`;
  }

  const host = requestHeaders["x-forwarded-host"] ?? requestHeaders.host;
  const protocol = requestHeaders["x-forwarded-proto"] ?? "https";

  if (!host) {
    throw new Error("Cannot build Twilio media URL without PUBLIC_URL or Host header.");
  }

  return `${protocol === "https" ? "wss" : "ws"}://${host}/media`;
}

function toWebSocketBaseUrl(publicUrl) {
  if (publicUrl.startsWith("https://")) {
    return publicUrl.replace("https://", "wss://");
  }

  if (publicUrl.startsWith("http://")) {
    return publicUrl.replace("http://", "ws://");
  }

  return `wss://${publicUrl}`;
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
