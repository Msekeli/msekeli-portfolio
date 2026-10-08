import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import Button from "../Button";
import Icon from "../Icon";
import Surface from "../Surface";

import ProjectViewerCarousel from "./ProjectViewerCarousel";
import ProjectViewerInfo from "./ProjectViewerInfo";

const AUTOPLAY_DELAY = 6000;

const EMBLA_OPTIONS = {
  loop: true,
  align: "center",
  dragFree: false,
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function ProjectViewer({ project, onClose }) {
  const screens = project?.screens ?? [];

  const autoplay = useMemo(
    () =>
      Autoplay({
        delay: AUTOPLAY_DELAY,
        playOnInit: !prefersReducedMotion(),
        stopOnInteraction: true,
        stopOnMouseEnter: false,
        stopOnFocusIn: false,
      }),
    [],
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(EMBLA_OPTIONS, [autoplay]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [paused, setPaused] = useState(prefersReducedMotion());

  const pausedRef = useRef(paused);
  const closeRef = useRef(null);

  const restartTimer = useCallback(() => {
    if (pausedRef.current) return;

    autoplay.reset();
  }, [autoplay]);

  const scrollTo = useCallback(
    (index) => {
      if (!emblaApi) return;

      emblaApi.scrollTo(index);
      restartTimer();
    },
    [emblaApi, restartTimer],
  );

  const scrollPrevious = useCallback(() => {
    if (!emblaApi) return;

    emblaApi.scrollPrev();
    restartTimer();
  }, [emblaApi, restartTimer]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;

    emblaApi.scrollNext();
    restartTimer();
  }, [emblaApi, restartTimer]);

  const toggleAutoplay = useCallback(() => {
    if (!emblaApi) return;

    if (pausedRef.current) {
      pausedRef.current = false;
      setPaused(false);
      autoplay.play();
    } else {
      pausedRef.current = true;
      setPaused(true);
      autoplay.stop();
    }
  }, [emblaApi, autoplay]);

  const pauseWhileHovering = useCallback(() => {
    if (!emblaApi || pausedRef.current) return;

    autoplay.stop();
  }, [emblaApi, autoplay]);

  const resumeAfterHovering = useCallback(() => {
    if (!emblaApi || pausedRef.current) return;

    autoplay.play();
  }, [emblaApi, autoplay]);

  useEffect(() => {
    if (!project) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [project]);

  useEffect(() => {
    if (!emblaApi) return;

    const handleSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    handleSelect();

    emblaApi.on("select", handleSelect);
    emblaApi.on("reInit", handleSelect);

    return () => {
      emblaApi.off("select", handleSelect);
      emblaApi.off("reInit", handleSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!project || !emblaApi) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrevious();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, emblaApi, onClose, scrollPrevious, scrollNext]);

  if (!project || screens.length === 0) {
    return null;
  }

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 sm:p-3 md:p-5"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <style>{`
        @keyframes viewer-fade {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        .viewer-fade {
          animation: viewer-fade 150ms ease-out;
        }

        @media (prefers-reduced-motion: reduce) {
          .viewer-fade {
            animation: none;
          }
        }
      `}</style>

      {/* Surface is static by default, so the modal no longer lifts on hover */}
      <Surface
        elevated
        noPadding
        className="flex h-[calc(100dvh-1rem)] max-h-[100dvh] w-full max-w-[1320px] flex-col overflow-hidden bg-(--bg-elevated) gold-glow sm:h-auto sm:max-h-[96dvh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-viewer-title"
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-borderColor px-4 py-3 sm:px-6 md:px-7">
          <h2
            id="project-viewer-title"
            className="min-w-0 truncate text-base font-semibold uppercase leading-none tracking-[0.18em] text-gold-main sm:text-lg md:text-xl"
          >
            {project.title}
          </h2>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close project viewer"
            className="flex h-10 w-10 shrink-0 cursor-pointer select-none items-center justify-center rounded-full border border-borderColor text-text-secondary transition-colors duration-100 hover:border-gold-main hover:bg-gold-main/15 hover:text-gold-main active:bg-gold-main/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-main/60 sm:h-[46px] sm:w-[46px]"
          >
            <svg
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="grid min-w-0 grid-cols-1 gap-5 px-3 py-4 sm:px-6 sm:py-5 md:gap-6 md:px-7 md:pb-6 lg:grid-cols-[minmax(0,1.85fr)_minmax(280px,0.75fr)] lg:gap-8">
            <ProjectViewerCarousel
              project={project}
              screens={screens}
              selectedIndex={selectedIndex}
              emblaRef={emblaRef}
              onPrevious={scrollPrevious}
              onNext={scrollNext}
              onSelect={scrollTo}
              onPauseHover={pauseWhileHovering}
              onResumeHover={resumeAfterHovering}
            />

            <ProjectViewerInfo
              project={project}
              currentScreen={screens[selectedIndex] ?? screens[0]}
              selectedIndex={selectedIndex}
              screenCount={screens.length}
            />
          </div>
        </div>

        <footer className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-borderColor px-3 py-3 sm:gap-3 sm:px-6 sm:py-[14px] md:px-7">
          <Button
            type="button"
            variant="primary"
            onClick={onClose}
            className="text-[13px]! sm:text-[15px]!"
          >
            <Icon name="ArrowLeft" />
            <span>Back to projects</span>
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={toggleAutoplay}
            className="border border-borderColor text-[13px]! hover:border-gold-main sm:text-[15px]!"
          >
            <Icon name={paused ? "Play" : "Pause"} />
            <span>{paused ? "Play slideshow" : "Pause slideshow"}</span>
          </Button>

          <p className="hidden items-center gap-2 text-[15px] text-text-secondary md:flex">
            <kbd className="rounded-md border border-borderColor px-2 py-0.5 text-[13px] font-medium text-text-primary shadow-[0_2px_0_rgba(255,255,255,0.08)]">
              Esc
            </kbd>

            <span>to close</span>
          </p>
        </footer>
      </Surface>
    </div>
  );
}
