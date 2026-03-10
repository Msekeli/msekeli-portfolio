import { useState } from "react";
import Section from "../components/Section";
import SectionTitle from "../components/SectionTitle";
import Text from "../components/Text";
import Surface from "../components/Surface";
import Button from "../components/Button";

export default function Contact() {
  const [status, setStatus] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");

    const form = e.target;

    const payload = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value,
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
        throw new Error("Failed request");
      }

      form.reset();
      setStatus("success");

      setTimeout(() => {
        setStatus("idle");
      }, 4000);
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }

  return (
    <Section id="contact">
      <SectionTitle>Contact</SectionTitle>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT: Contact form */}
        <Surface>
          <div className="space-y-6">
            <Text variant="secondary">
              If you’d like to get in touch, send a message and I’ll respond as
              soon as possible.
            </Text>

            <form className="space-y-4" onSubmit={handleSubmit}>
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
                <p className="text-sm text-green-400">
                  Message sent successfully. Thank you!
                </p>
              )}

              {status === "error" && (
                <p className="text-sm text-red-400">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          </div>
        </Surface>

        {/* RIGHT: Map */}
        <Surface className="overflow-hidden">
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
