import { useEffect, useRef } from "react";

const DESKTOP_BREAKPOINT = 768;

const MIN_LOCK_MS = 800;
const QUIET_MS = 500;

const isEditable = (el) =>
  el instanceof HTMLElement &&
  (el.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName));

export default function useDesktopSectionPager(ids, activeId, setActiveId) {
  const activeRef = useRef(activeId);

  useEffect(() => {
    activeRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    if (!ids.length) return;

    let locked = false;
    let waitingForNewGesture = false;

    let lockedAt = 0;
    let lastWheelTime = 0;

    let unlockTimer = null;
    let quietTimer = null;

    const isDesktop = () => window.innerWidth >= DESKTOP_BREAKPOINT;

    const lastIndex = ids.length - 1;

    const getIndex = () => {
      const index = ids.indexOf(activeRef.current);
      return index >= 0 ? index : 0;
    };

    /*
     * The transition lock can only end after the animation has
     * had enough time to finish.
     */
    const finishLock = () => {
      const now = performance.now();

      const remaining = MIN_LOCK_MS - (now - lockedAt);

      if (remaining > 0) {
        unlockTimer = window.setTimeout(finishLock, remaining);
        return;
      }

      locked = false;

      /*
       * IMPORTANT:
       *
       * We are NOT immediately ready for another section.
       *
       * The wheel must first become completely quiet.
       */
      waitingForNewGesture = true;
    };

    /*
     * Once the wheel has been completely quiet, the next
     * wheel event is allowed to represent a NEW gesture.
     */
    const finishQuietPeriod = () => {
      const now = performance.now();

      const quietFor = now - lastWheelTime;

      if (quietFor < QUIET_MS) {
        quietTimer = window.setTimeout(finishQuietPeriod, QUIET_MS - quietFor);

        return;
      }

      waitingForNewGesture = false;
      quietTimer = null;
    };

    const lockInput = () => {
      locked = true;
      waitingForNewGesture = false;

      lockedAt = performance.now();

      clearTimeout(unlockTimer);
      clearTimeout(quietTimer);

      unlockTimer = window.setTimeout(finishLock, MIN_LOCK_MS);
    };

    const goTo = (index) => {
      if (index < 0 || index > lastIndex || index === getIndex()) {
        return false;
      }

      const nextId = ids[index];

      activeRef.current = nextId;
      setActiveId(nextId);

      lockInput();

      return true;
    };

    const shouldIgnoreWheel = (event) => {
      if (event.ctrlKey) return true;

      if (document.querySelector('[role="dialog"]')) {
        return true;
      }

      let el = event.target;

      while (el && el !== document.body && el !== document.documentElement) {
        if (el instanceof HTMLElement) {
          const { overflowY } = window.getComputedStyle(el);

          const scrollable =
            (overflowY === "auto" || overflowY === "scroll") &&
            el.scrollHeight > el.clientHeight + 1;

          if (scrollable) {
            const canDown =
              el.scrollTop + el.clientHeight < el.scrollHeight - 1;

            const canUp = el.scrollTop > 0;

            if ((event.deltaY > 0 && canDown) || (event.deltaY < 0 && canUp)) {
              return true;
            }
          }
        }

        el = el.parentElement;
      }

      return false;
    };

    const handleWheel = (event) => {
      if (!isDesktop()) return;

      if (shouldIgnoreWheel(event)) return;

      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        return;
      }

      if (event.deltaY === 0) return;

      const now = performance.now();

      lastWheelTime = now;

      /*
       * Any wheel event means the current wheel stream is
       * still alive.
       */
      if (waitingForNewGesture) {
        event.preventDefault();

        clearTimeout(quietTimer);

        quietTimer = window.setTimeout(finishQuietPeriod, QUIET_MS);

        return;
      }

      /*
       * Transition currently running.
       *
       * Everything is swallowed.
       */
      if (locked) {
        event.preventDefault();

        clearTimeout(unlockTimer);

        unlockTimer = window.setTimeout(
          finishLock,
          Math.max(MIN_LOCK_MS - (now - lockedAt), 0),
        );

        return;
      }

      const index = getIndex();

      const direction = event.deltaY > 0 ? 1 : -1;

      /*
       * Allow normal scrolling into the footer.
       */
      if (direction > 0 && index === lastIndex) {
        return;
      }

      /*
       * Don't hijack native footer scrolling.
       */
      if (window.scrollY > 2) {
        return;
      }

      event.preventDefault();

      /*
       * ONE physical gesture gets ONE transition.
       */
      goTo(index + direction);
    };

    const handleKeyDown = (event) => {
      if (!isDesktop()) return;
      if (event.defaultPrevented) return;

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      if (isEditable(event.target)) return;

      if (document.querySelector('[role="dialog"]')) {
        return;
      }

      if (window.scrollY > 2) return;

      let direction = 0;

      if (event.key === "ArrowDown" || event.key === "PageDown") {
        direction = 1;
      } else if (event.key === "ArrowUp" || event.key === "PageUp") {
        direction = -1;
      } else {
        return;
      }

      /*
       * Holding a key or pressing it while the wheel
       * system is waiting must not advance sections.
       */
      if (locked || waitingForNewGesture || event.repeat) {
        event.preventDefault();
        return;
      }

      const index = getIndex();

      if (direction > 0 && index === lastIndex) {
        return;
      }

      event.preventDefault();

      goTo(index + direction);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);

      window.removeEventListener("keydown", handleKeyDown);

      clearTimeout(unlockTimer);
      clearTimeout(quietTimer);
    };
  }, [ids, setActiveId]);
}
