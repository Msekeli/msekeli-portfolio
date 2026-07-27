import { useEffect, useState } from "react";

export default function useActiveSection(ids) {
  const [activeId, setActiveId] = useState(ids[0]);

  useEffect(() => {
    // Callbacks only report entries whose ratio just crossed a threshold,
    // not every observed section — so we keep a running record of each
    // section's last-known ratio and always pick the best across all of
    // them, instead of only the ones that happened to change this time.
    const ratios = new Map(ids.map((id) => [id, 0]));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(
            entry.target.id,
            entry.isIntersecting ? entry.intersectionRatio : 0,
          );
        });

        let bestId = null;
        let bestRatio = 0;

        ratios.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });

        if (bestId) {
          setActiveId(bestId);
        }
      },
      {
        root: document.getElementById("scroll-container"),
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}
