import { Resend } from "resend";

export const config = {
  runtime: "nodejs",
};

const rateLimit = new Map();

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

  // Rate limiting
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket?.remoteAddress ||
    "unknown";

  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const lastRequest = rateLimit.get(ip);

  if (lastRequest && now - lastRequest < windowMs) {
    return res.status(429).json({
      success: false,
      message: "Please wait a minute before sending another message.",
    });
  }

  rateLimit.set(ip, now);

  try {
    await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: "msekeli14@gmail.com",
      subject: `New portfolio message from ${name}`,
      reply_to: email,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p>${message}</p>
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
