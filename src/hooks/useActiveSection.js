import { useCallback, useEffect, useRef, useState } from "react";

const DESKTOP_BREAKPOINT = 768;
const HEADER_HEIGHT = 56;
// After a nav click on mobile, ignore scroll updates while the page glides
// to the target, so the highlight doesn't flicker through the sections.
const CLICK_LOCK_MS = 1200;

export default function useActiveSection(ids) {
  const [activeId, setActiveIdState] = useState(ids[0]);
  const lockedRef = useRef(false);
  const lockTimerRef = useRef();

  const setActiveId = useCallback((id) => {
    lockedRef.current = true;
    setActiveIdState(id);

    clearTimeout(lockTimerRef.current);
    lockTimerRef.current = setTimeout(() => {
      lockedRef.current = false;
    }, CLICK_LOCK_MS);
  }, []);

  // Mobile only: sections scroll normally there, so the active one follows
  // the scroll position. On desktop the pager decides the active section.
  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      if (window.innerWidth >= DESKTOP_BREAKPOINT) return;
      if (lockedRef.current) return;

      const probe =
        window.scrollY +
        HEADER_HEIGHT +
        (window.innerHeight - HEADER_HEIGHT) / 2;

      let current = sections[0].id;

      for (const section of sections) {
        if (section.offsetTop <= probe) current = section.id;
      }

      setActiveIdState(current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const onScrollEnd = () => {
      lockedRef.current = false;
      clearTimeout(lockTimerRef.current);
      onScroll();
    };

    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scrollend", onScrollEnd);
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scrollend", onScrollEnd);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
      clearTimeout(lockTimerRef.current);
    };
  }, [ids]);

  return [activeId, setActiveId];
}
