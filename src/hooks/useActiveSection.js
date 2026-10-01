import { useEffect, useState } from "react";

export default function useActiveSection(ids) {
  const [activeId, setActiveId] = useState(ids[0]);

  useEffect(() => {
    let frameId = null;

    const updateActiveSection = () => {
      frameId = null;

      const headerOffset = 120;
      const referencePosition = headerOffset;

      let closestId = ids[0];
      let closestDistance = Infinity;

      for (const id of ids) {
        const element = document.getElementById(id);

        if (!element) continue;

        const distance = Math.abs(
          element.getBoundingClientRect().top - referencePosition,
        );

        if (distance < closestDistance) {
          closestDistance = distance;
          closestId = id;
        }
      }

      setActiveId((currentId) =>
        currentId === closestId ? currentId : closestId,
      );
    };

    const handleScroll = () => {
      if (frameId !== null) return;

      frameId = requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }

      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [ids]);

  return activeId;
}
