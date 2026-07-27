import { Resend } from "resend";

export const config = {
  runtime: "nodejs",
};

const rateLimit = new Map();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_NAME_LENGTH = 200;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 5000;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function pruneStaleRateLimitEntries(now) {
  for (const [ip, timestamp] of rateLimit) {
    if (now - timestamp > RATE_LIMIT_WINDOW_MS) {
      rateLimit.delete(ip);
    }
  }
}

export default async function handler(req, res) {
  const resendApiKey = globalThis.process?.env?.RESEND_API_KEY;

  if (!resendApiKey) {
    return res.status(500).json({
      success: false,
      message: "Server configuration error.",
    });
  }

  const resend = new Resend(resendApiKey);

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed.",
    });
  }

  const { name, email, message, company } = req.body || {};

  // Honeypot spam trap
  if (company) {
    return res.status(200).json({ success: true });
  }

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Please fill in all required fields.",
    });
  }

  if (
    name.length > MAX_NAME_LENGTH ||
    email.length > MAX_EMAIL_LENGTH ||
    message.length > MAX_MESSAGE_LENGTH
  ) {
    return res.status(400).json({
      success: false,
      message: "One or more fields exceed the maximum allowed length.",
    });
  }

  // Rate limiting
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket?.remoteAddress ||
    "unknown";

  const now = Date.now();
  const lastRequest = rateLimit.get(ip);

  if (lastRequest && now - lastRequest < RATE_LIMIT_WINDOW_MS) {
    return res.status(429).json({
      success: false,
      message: "Please wait a minute before sending another message.",
    });
  }

  rateLimit.set(ip, now);
  pruneStaleRateLimitEntries(now);

  try {
    await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: "msekeli14@gmail.com",
      subject: `New portfolio message from ${name}`,
      reply_to: email,
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Message sent successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending the email.",
    });
  }
}
