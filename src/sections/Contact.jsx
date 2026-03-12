import { useState } from "react";
import Section from "../components/Section";
import SectionTitle from "../components/SectionTitle";
import Text from "../components/Text";
import Surface from "../components/Surface";
import Button from "../components/Button";

export default function Contact() {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setStatus("sending");
    setMessage("");

    const form = e.target;

    const payload = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value,
      company: form.company?.value || "",
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Something went wrong.");
      }

      form.reset();

      setStatus("success");
      setMessage(data.message || "Message sent successfully.");

      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
    } catch (error) {
      console.error(error);

      setStatus("error");
      setMessage(error.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <Section id="contact">
      <SectionTitle>Contact</SectionTitle>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT: Contact form */}
        <Surface className="gold-glow">
          <div className="space-y-6 ">
            <Text variant="secondary">
              If you’d like to get in touch, send a message and I’ll respond as
              soon as possible.
            </Text>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Honeypot spam trap */}
              <input
                type="text"
                name="company"
                style={{ display: "none" }}
                tabIndex="-1"
                autoComplete="off"
              />

              <input
                name="name"
                type="text"
                placeholder="Your name"
                required
                className="w-full surface px-4 py-3 rounded-lg"
              />

              <input
                name="email"
                type="email"
                placeholder="Your email"
                required
                className="w-full surface px-4 py-3 rounded-lg"
              />

              <textarea
                name="message"
                rows="4"
                placeholder="Your message"
                required
                className="w-full surface px-4 py-3 rounded-lg resize-none"
              />

              <Button type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Sending..." : "Send Message"}
              </Button>

              {status === "success" && (
                <p className="text-sm text-green-400">{message}</p>
              )}

              {status === "error" && (
                <p className="text-sm text-red-400">{message}</p>
              )}
            </form>
          </div>
        </Surface>

        {/* RIGHT: Map */}
        <Surface className="overflow-hidden gold-glow">
          <iframe
            title="Location"
            src="https://www.google.com/maps?q=Salt+River,+Cape+Town,+7925&z=14&output=embed"
            className="w-full h-full min-h-80 border-0"
            style={{
              filter:
                "invert(90%) hue-rotate(210deg) brightness(85%) contrast(110%)",
            }}
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Surface>
      </div>
    </Section>
  );
}
