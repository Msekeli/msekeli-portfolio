import { useState } from "react";
import Icon from "../components/Icon";

const CONTACT_EMAIL = "msekeli14@gmail.com";
const WHATSAPP_NUMBER = "27691073883";
const WHATSAPP_PREFILL =
  "Hi Msekeli, I found your portfolio and would like to get in touch.";

const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_PREFILL,
)}`;

export default function Header() {
  const [copied, setCopied] = useState(false);

  async function handleCopyEmail() {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy email:", error);
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 surface border-b border-gold-main/20">
      <div className="relative h-14 flex items-center justify-between px-[clamp(1rem,9vw,10%)]">
        {/* Logo */}
        <img
          src="/images/logo.png"
          alt="Msekeli logo"
          className="h-15 w-auto"
        />

        {/* Center status */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="inline-flex items-center gap-2 whitespace-nowrap text-xs font-medium text-green-400">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            Available for work
          </span>
        </div>

        {/* Contact icons */}
        <nav className="flex items-center gap-3">
          {/* GitHub */}
          <a
            href="https://github.com/Msekeli"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            title="GitHub"
            className="text-text-primary transition-colors hover:text-gold-main"
          >
            <Icon name="Github" />
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/msekeli-mkwibiso/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            title="LinkedIn"
            className="text-text-primary transition-colors hover:text-gold-main"
          >
            <Icon name="Linkedin" />
          </a>
          {/* WhatsApp */}
          <div className="group relative flex items-center">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with me on WhatsApp"
              className="block text-green-400 transition-colors hover:text-green-300"
            >
              <Icon name="WhatsApp" />
            </a>

            <span className="pointer-events-none absolute right-0 top-full mt-2 whitespace-nowrap rounded-md border border-green-400/20 bg-black/90 px-2 py-1 text-xs text-green-300 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              Chat on WhatsApp
            </span>
          </div>

          {/* Email */}
          <div className="group relative flex items-center">
            <button
              type="button"
              onClick={handleCopyEmail}
              aria-label={
                copied ? "Email address copied" : "Copy email address"
              }
              className="block text-text-primary transition-colors hover:text-gold-main"
            >
              <Icon name="Mail" />
            </button>

            <span
              className={`pointer-events-none absolute right-0 top-full mt-2 whitespace-nowrap rounded-md border border-gold-main/20 bg-black/90 px-2 py-1 text-xs transition-opacity duration-200 ${
                copied
                  ? "text-green-400 opacity-100"
                  : "text-text-secondary opacity-0 group-hover:opacity-100"
              }`}
            >
              {copied ? "✓ Email copied" : "Copy email"}
            </span>
          </div>
        </nav>
      </div>
    </header>
  );
}
