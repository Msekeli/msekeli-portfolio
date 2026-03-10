import { Resend } from "resend";

export const config = {
  runtime: "nodejs",
};

export default async function handler(req, res) {
  const resendApiKey = globalThis.process?.env?.RESEND_API_KEY;

  if (!resendApiKey) {
    return res.status(500).json({ error: "Missing RESEND_API_KEY" });
  }

  const resend = new Resend(resendApiKey);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

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

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Email failed" });
  }
}
