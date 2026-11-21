export function getConfig(env = process.env) {
  return {
    port: Number(env.PORT ?? 3000),
    publicUrl: stripTrailingSlash(env.PUBLIC_URL),
    openaiApiKey: env.OPENAI_API_KEY,
    realtimeModel: env.OPENAI_REALTIME_MODEL ?? "gpt-realtime-2",
    realtimeVoice: env.OPENAI_REALTIME_VOICE ?? "marin"
  };
}

export function requireOpenAIKey(config) {
  if (!config.openaiApiKey) {
    throw new Error("Missing OPENAI_API_KEY. Set it before running npm run phone.");
  }
}

function stripTrailingSlash(value) {
  if (!value) {
    return "";
  }

  return value.replace(/\/+$/, "");
}
