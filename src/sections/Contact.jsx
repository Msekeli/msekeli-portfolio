import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import Section from "../components/Section";
import SectionTitle from "../components/SectionTitle";
import Text from "../components/Text";
import Surface from "../components/Surface";
import Button from "../components/Button";
import Icon from "../components/Icon";

// Same public links as the Header.
const CONTACT_EMAIL = "msekeli14@gmail.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/msekeli-mkwibiso/";
const GITHUB_URL = "https://github.com/Msekeli";

// TODO: replace with your WhatsApp Business number.
// Digits only, international format, no "+" (e.g. 27XXXXXXXXX).
const WHATSAPP_NUMBER = "27000000000";

// Copy you can change in one place.
const WHATSAPP_PREFILL =
  "Hi Derz, I found your portfolio and wanted to chat about ";
const LOCATION_TEXT = "Cape Town, South Africa";
const LOCATION_NOTE = "Remote, hybrid, or on-site locally";
const HOURS_TEXT = "Mon to Fri, 08:00 to 17:00 SAST";
const HOURS_NOTE = "Replies within one working day";

// The QR code skips the pre-filled text so it stays simple and easy to scan.
const whatsappQrValue = `https://wa.me/${WHATSAPP_NUMBER}`;

const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_PREFILL,
)}`;

function ChannelCard({ icon, title, note, children, featured = false }) {
  return (
    <Surface
      className={`gold-glow surface-lift flex flex-col gap-3 ${
        featured ? "border border-green-400" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <Icon
          name={icon}
          size={24}
          className={featured ? "text-green-400" : "text-gold-main"}
        />
        {featured && <span className="text-xs text-green-400">Fastest</span>}
      </div>
      <div>
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="text-sm text-text-secondary">{note}</p>
      </div>
      <div className="mt-auto">{children}</div>
    </Surface>
  );
}

function DetailRow({ icon, title, note }) {
  return (
    <div className="flex items-start gap-3">
      <Icon name={icon} size={18} className="mt-0.5 shrink-0 text-gold-main" />
      <div className="text-sm">
        <p className="text-base">{title}</p>
        <p className="text-sm text-text-secondary">{note}</p>
      </div>
    </div>
  );
}

export default function Contact() {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleCopyEmail() {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (error) {
      console.error(error);
    }
  }

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
    <Section id="contact" className="flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto">
        <SectionTitle className="mb-0">Let's talk</SectionTitle>

        <div className="mb-6 flex flex-col items-start gap-3">
          <Text variant="secondary">
            Open to full-stack and front-end roles. Pick whichever channel suits
            you. I reply within one working day.
          </Text>
          <span className="inline-flex items-center gap-2 text-xs text-green-400">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            Available for work
          </span>
        </div>

        {/* Channels */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {whatsappHref && (
            <ChannelCard
              icon="WhatsApp"
              title="WhatsApp"
              note="Business account"
              featured
            >
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-md border border-green-400 px-4 py-2 text-center text-sm font-medium text-green-400 transition hover:bg-green-400/10"
              >
                Chat now
              </a>
            </ChannelCard>
          )}

          {CONTACT_EMAIL && (
            <ChannelCard icon="Mail" title="Email" note="For CVs and detail">
              <Button
                type="button"
                onClick={handleCopyEmail}
                className="w-full justify-center"
              >
                {copied ? "Copied" : "Copy address"}
              </Button>
            </ChannelCard>
          )}

          {LINKEDIN_URL && (
            <ChannelCard
              icon="Linkedin"
              title="LinkedIn"
              note="Connect or message"
            >
              <Button
                type="button"
                onClick={() =>
                  window.open(LINKEDIN_URL, "_blank", "noopener,noreferrer")
                }
                className="w-full justify-center"
              >
                View profile
              </Button>
            </ChannelCard>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* LEFT: Contact form */}
          <Surface className="gold-glow surface-lift">
            <div className="space-y-4">
              <h3 className="text-base font-semibold">Or send a message</h3>

              <form className="space-y-3" onSubmit={handleSubmit}>
                {/* Honeypot spam trap */}
                <input
                  type="text"
                  name="company"
                  className="hidden"
                  tabIndex="-1"
                  autoComplete="off"
                  aria-hidden="true"
                />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    name="name"
                    type="text"
                    placeholder="Your name"
                    required
                    className="w-full surface field-focus border border-white/5 px-4 py-2 rounded-lg"
                  />

                  <input
                    name="email"
                    type="email"
                    placeholder="Your email"
                    required
                    className="w-full surface field-focus border border-white/5 px-4 py-2 rounded-lg"
                  />
                </div>

                <textarea
                  name="message"
                  rows="6"
                  placeholder="Role, company, or project you have in mind"
                  required
                  className="w-full surface field-focus border border-white/5 px-4 py-2 rounded-lg resize-none"
                />

                <Button type="submit" disabled={status === "sending"}>
                  {status === "sending" ? "Sending…" : "Send message"}
                </Button>

                {status === "success" && (
                  <p className="text-sm text-green-400" role="status">
                    {message}
                  </p>
                )}

                {status === "error" && (
                  <p className="text-sm text-red-400" role="alert">
                    {message}
                  </p>
                )}
              </form>
            </div>
          </Surface>

          {/* RIGHT: WhatsApp QR (desktop) + Good to know */}
          <div className="flex flex-col gap-4">
            {/* Desktop only: phones can just tap "Chat now" */}
            <Surface className="gold-glow surface-lift hidden md:block border border-green-400">
              <div className="flex items-center gap-5">
                <div className="shrink-0 rounded-md bg-white p-2">
                  {/* QR codes need dark on light to scan reliably */}
                  <QRCodeSVG
                    value={whatsappQrValue}
                    size={128}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    title="Scan to chat on WhatsApp"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-green-400">
                    <Icon name="WhatsApp" size={20} />
                    <span className="text-xs">On desktop</span>
                  </div>
                  <h3 className="text-base font-semibold">
                    Scan to chat on WhatsApp
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Point your phone camera at the code to open the chat.
                  </p>
                </div>
              </div>
            </Surface>

            <Surface className="gold-glow surface-lift">
              <div className="space-y-4">
                <h3 className="text-base font-semibold">Good to know</h3>
                <DetailRow
                  icon="MapPin"
                  title={LOCATION_TEXT}
                  note={LOCATION_NOTE}
                />
                <DetailRow icon="Clock" title={HOURS_TEXT} note={HOURS_NOTE} />
              </div>
            </Surface>
          </div>
        </div>
      </div>
    </Section>
  );
}
