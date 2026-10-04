import { useEffect, useState } from "react";

export default function useActiveSection(ids) {
  const [activeId, setActiveId] = useState(ids[0]);

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) return;

    // Track intersection states of all observed sections
    const intersectionMap = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          intersectionMap.set(entry.target.id, entry.isIntersecting);
        });

        // Find the intersecting section with the highest intersection ratio
        // among those currently marked as intersecting in our map
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleSections.length > 0) {
          setActiveId(visibleSections[0].target.id);
        } else {
          // Fallback: if no one just changed to intersecting, 
          // find the one in the map that is still intersecting
          const currentIntersecting = ids.find(id => intersectionMap.get(id));
          if (currentIntersecting) {
            setActiveId(currentIntersecting);
          }
        }
      },
      {
        root: null,
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [ids]);

  return [activeId, setActiveId];
}
