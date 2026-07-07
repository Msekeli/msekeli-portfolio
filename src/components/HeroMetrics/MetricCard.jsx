import { useEffect, useRef, useState } from "react";
import Icon from "../Icon";
import Surface from "../Surface";

export default function MetricCard({
  icon,
  value,
  suffix = "",
  label,
  delay = 500,
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const frameRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const startCount = () => {
      const duration = 1200;
      const startTime = performance.now();

      const animateCount = (currentTime) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);

        setDisplayValue(Math.round(value * easedProgress));

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(animateCount);
        }
      };

      frameRef.current = requestAnimationFrame(animateCount);
    };

    timeoutRef.current = setTimeout(startCount, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [delay, value]);

  return (
    <Surface noPadding className="gold-glow surface-lift h-full p-4">
      <div className="flex items-start justify-center gap-2.5 text-center sm:text-left">
        <div className="mt-0.5 rounded-md border border-gold-main/30 bg-gold-main/10 p-1.5 text-gold-soft">
          <Icon name={icon} className="w-3.5 h-3.5" />
        </div>

        <div>
          <div className="text-xl font-semibold leading-none text-text-primary">
            {displayValue}
            {suffix}
          </div>
          <p className="mt-1.5 text-[0.65rem] font-medium uppercase tracking-[0.12em] text-text-muted">
            {label}
          </p>
        </div>
      </div>
    </Surface>
  );
}
