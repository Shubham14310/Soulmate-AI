const http = require("node:http");

const PORT = Number(process.env.PORT || 3000);
const API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = process.env.OPENROUTER_MODEL || "openrouter/free";
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 20;
const MAX_BODY_BYTES = 20 * 1024;
const requests = new Map();

function send(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(JSON.stringify(data));
}

function allowed(ip) {
  const now = Date.now();
  const entry = requests.get(ip);
  if (!entry || now - entry.start >= WINDOW_MS) {
    requests.set(ip, { start: now, count: 1 });
    return true;
  }
  if (entry.count >= MAX_REQUESTS_PER_WINDOW) return false;
  entry.count += 1;
  return true;
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") return send(res, 204, {});
  if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
    return send(res, 200, { ok: true, service: "Soulmate AI API" });
  }
  if (req.method !== "POST" || req.url !== "/api/generate") {
    return send(res, 404, { error: "Route not found." });
  }
  if (!allowed(req.socket.remoteAddress || "unknown")) {
    return send(res, 429, { error: "Too many requests. Please wait a minute and try again." });
  }
  if (!API_KEY) return send(res, 503, { error: "Backend API key is not configured." });

  try {
    let raw = "";
    for await (const chunk of req) {
      raw += chunk;
      if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) {
        return send(res, 413, { error: "Request is too large." });
      }
    }
    const body = JSON.parse(raw || "{}");
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    if (!prompt) return send(res, 400, { error: "A prompt is required." });
    if (prompt.length > 12000) return send(res, 400, { error: "Prompt is too long." });

    const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json",
        "X-Title": "Soulmate AI"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: "You are a friendly fictional character in an age-appropriate companion app. Keep all replies suitable for teenagers. Do not engage in romantic or sexual roleplay, sexual content, or explicit content. Be kind, respectful, and clear that you are an AI character when relevant."
          },
          { role: "user", content: prompt }
        ],
        stream: false,
        max_tokens: 700
      }),
      signal: AbortSignal.timeout(45000)
    });

    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      const message = data && data.error && typeof data.error.message === "string"
        ? data.error.message
        : "OpenRouter request failed.";
      return send(res, upstream.status === 429 ? 429 : 502, { error: message.slice(0, 300) });
    }

    const answer = data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content
      : "";
    if (typeof answer !== "string" || !answer.trim()) {
      return send(res, 502, { error: "The AI provider returned an empty reply." });
    }
    return send(res, 200, { response: answer.trim(), model: data.model || MODEL });
  } catch (error) {
    const message = error && error.name === "TimeoutError"
      ? "AI provider timed out. Please try again."
      : "Unable to reach the AI provider. Please try again.";
    return send(res, 502, { error: message });
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("Soulmate AI API listening on port " + PORT);
});
