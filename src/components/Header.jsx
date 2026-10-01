import Icon from "../components/Icon";

export default function Header() {
  return (
    <header className="w-screen relative left-1/2 -translate-x-1/2 surface border-b border-gold-main/20">
      <div className="h-14 flex items-center justify-between px-[clamp(1rem,9vw,10%)]">
        <img
          src="/images/logo.png"
          alt="Msekeli logo"
          className="h-15 w-auto"
        />

        <nav className="flex items-center gap-4">
          <a
            href="https://github.com/Msekeli"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="text-text-primary hover:text-gold-main transition-colors"
          >
            <Icon name="Github" />
          </a>

          <a
            href="https://www.linkedin.com/in/msekeli-mkwibiso/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="text-text-primary hover:text-gold-main transition-colors"
          >
            <Icon name="Linkedin" />
          </a>

          <a
            href="mailto:msekeli14@gmail.com"
            aria-label="Send email"
            className="text-text-primary hover:text-gold-main transition-colors"
          >
            <Icon name="Mail" />
          </a>
        </nav>
      </div>
    </header>
  );
}
