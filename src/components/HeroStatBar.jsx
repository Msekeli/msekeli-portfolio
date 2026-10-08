import { useEffect, useRef, useState } from "react";
import Surface from "./Surface";

const COUNT_DURATION = 1200;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useCountUp(target, start) {
  const [value, setValue] = useState(() =>
    prefersReducedMotion() ? target : 0,
  );

  useEffect(() => {
    if (!start || prefersReducedMotion()) return;

    let frame;
    const startedAt = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startedAt) / COUNT_DURATION, 1);

      const eased = 1 - Math.pow(1 - progress, 3);

      setValue(Math.round(target * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [target, start]);

  return value;
}

function Stat({ stat, start }) {
  const value = useCountUp(stat.value, start);

  return (
    <div className="min-w-0 flex-1 px-3 py-3 text-center sm:px-5 sm:text-left">
      <span className="sr-only">
        {stat.value}
        {stat.suffix} {stat.label}
      </span>

      <p
        aria-hidden="true"
        className="text-2xl font-semibold leading-none tabular-nums text-gold-main sm:text-3xl"
      >
        {value}
        {stat.suffix}
      </p>

      <p
        aria-hidden="true"
        className="mt-1.5 text-xs leading-snug text-text-secondary sm:text-sm"
      >
        <span className="sm:hidden">{stat.shortLabel ?? stat.label}</span>

        <span className="hidden sm:inline">{stat.label}</span>
      </p>
    </div>
  );
}

export default function HeroStatBar({ stats = [], className = "" }) {
  const ref = useRef(null);

  const [visible, setVisible] = useState(
    () => typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    const el = ref.current;

    if (!el || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  if (stats.length === 0) {
    return null;
  }

  return (
    <div ref={ref} className={className}>
      <Surface
        noPadding
        className="flex divide-x divide-borderColor overflow-hidden border border-gold-main/40"
      >
        {stats.map((stat) => (
          <Stat key={stat.label} stat={stat} start={visible} />
        ))}
      </Surface>
    </div>
  );
}
