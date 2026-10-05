import { useEffect, useState } from "react";

export default function useActiveSection(ids) {
  const [activeId, setActiveId] = useState(ids[0]);

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the section that currently occupies the most area of the viewport
        // We use the entries provided by the observer, but we also check
        // for the most prominent intersecting section globally.
        const intersecting = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (intersecting.length > 0) {
          setActiveId(intersecting[0].target.id);
        }
      },
      {
        root: null,
        // Adjust margin to create a "sweet spot" in the center of the viewport
        rootMargin: "-10% 0px -10% 0px",
        threshold: [0, 0.1, 0.2, 0.5, 1],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [ids]);

  return [activeId, setActiveId];
}
