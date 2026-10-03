import navItems from "../data/nav";

const technologies = ["React", "Vite", "Tailwind CSS", "Vercel"];

export default function Footer() {
  return (
    <footer className="border-t border-gold-main/20 bg-black/20">
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-10">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              Msekeli Mkwibiso
            </h2>

            <p className="mt-3 max-w-sm text-sm leading-6 text-text-muted">
              Software developer focused on building practical, reliable web
              applications.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text-primary">
              Navigation
            </h3>

            <nav className="mt-3 flex flex-col gap-2">
              {navItems.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="w-fit text-sm text-text-muted transition-colors hover:text-gold-main"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text-primary">
              Technologies
            </h3>

            <p className="mt-3 text-sm leading-6 text-text-muted">
              {technologies.join(" · ")}
            </p>

            <div className="mt-5 flex flex-wrap gap-4">
              <a
                href="https://github.com/Msekeli"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text-muted transition-colors hover:text-gold-main"
              >
                GitHub
              </a>

              <a
                href="https://www.linkedin.com/in/msekeli-mkwibiso/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text-muted transition-colors hover:text-gold-main"
              >
                LinkedIn
              </a>

              <a
                href="mailto:msekeli14@gmail.com"
                className="text-sm text-text-muted transition-colors hover:text-gold-main"
              >
                Email
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-text-muted">
          © {new Date().getFullYear()} Msekeli Mkwibiso. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
