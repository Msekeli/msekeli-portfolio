import "devicon/devicon.min.css";
import tech from "../data/techStrip.json";

function TechnologyIcon({ technology }) {
  if (technology.name === "Next.js") {
    return (
      <img
        src="/nextjs-wordmark.svg"
        alt=""
        aria-hidden="true"
        className="relative z-10 h-auto w-10"
      />
    );
  }

  return (
    <i
      className={`${technology.icon} relative z-10 text-[32px]`}
      aria-hidden="true"
    />
  );
}

function Tiles({ hidden = false }) {
  return (
    <ul
      aria-hidden={hidden ? "true" : undefined}
      className="flex shrink-0 items-center gap-4 pr-4"
    >
      {tech.map((technology) => (
        <li
          key={technology.name}
          title={technology.name}
          className="
            group relative flex h-14 w-14 shrink-0
            items-center justify-center
            overflow-hidden rounded-2xl
            border border-gold-main/25
            bg-white/5
            backdrop-blur-sm
            transition-colors duration-300
            hover:border-gold-main/60
            hover:bg-white/10
          "
        >
          <span
            aria-hidden="true"
            className="
              pointer-events-none absolute inset-y-0 -left-8
              w-6 rotate-12 bg-white/20 blur-sm
              transition-transform duration-500
              group-hover:translate-x-24
            "
          />

          <TechnologyIcon technology={technology} />

          {!hidden && <span className="sr-only">{technology.name}</span>}
        </li>
      ))}
    </ul>
  );
}

export default function TechStrip({ className = "" }) {
  return (
    <div
      aria-label="Technologies I work with"
      role="group"
      className={`
        tech-strip overflow-hidden
        [mask-image:linear-gradient(
          90deg,
          transparent,
          #000_8%,
          #000_92%,
          transparent
        )]
        ${className}
      `}
    >
      <style>{`
        @keyframes tech-scroll {
          from {
            transform: translate3d(0, 0, 0);
          }

          to {
            transform: translate3d(-50%, 0, 0);
          }
        }

        .tech-track {
          animation: tech-scroll 55s linear infinite;
          will-change: transform;
        }

        .tech-strip:hover .tech-track {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .tech-strip {
            overflow-x: auto;
            scrollbar-width: none;
          }

          .tech-strip::-webkit-scrollbar {
            display: none;
          }

          .tech-track {
            animation: none;
            will-change: auto;
          }
        }
      `}</style>

      <div className="tech-track flex w-max">
        <Tiles />
        <Tiles hidden />
      </div>
    </div>
  );
}
