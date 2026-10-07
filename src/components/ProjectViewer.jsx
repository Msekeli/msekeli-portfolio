import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import Button from "./Button";
import Icon from "./Icon";
import Surface from "./Surface";

const AUTOPLAY_DELAY = 6000;

const EMBLA_OPTIONS = {
  loop: true,
  align: "center",
  dragFree: false,
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const pad = (n) => String(n).padStart(2, "0");

function ScreenImage({ screen, alt, className = "" }) {
  const position = screen.imagePosition ?? "50% 50%";

  return (
    <img
      src={screen.image}
      alt={alt}
      className={`h-full w-full object-contain image-render-crisp ${className}`}
      style={{
        objectPosition: position,
        transform: `scale(${screen.imageScale ?? 1})`,
        transformOrigin: position,
      }}
      decoding="async"
    />
  );
}

export default function ProjectViewer({ project, onClose }) {
  const screens = project?.screens ?? [];

  const autoplay = useMemo(
    () =>
      Autoplay({
        delay: AUTOPLAY_DELAY,
        playOnInit: !prefersReducedMotion(),
        stopOnInteraction: false,
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
    if (!pausedRef.current) {
      autoplay.reset();
    }
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

  const toggleAutoplay = () => {
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
  };

  const pauseWhileHovering = () => {
    if (!emblaApi || pausedRef.current) return;

    autoplay.stop();
  };

  const resumeAfterHovering = () => {
    if (!emblaApi || pausedRef.current) return;

    autoplay.play();
  };

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

  const currentScreen = screens[selectedIndex] ?? screens[0];

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const arrowClass =
    "interactive flex h-9 w-9 shrink-0 cursor-pointer select-none items-center justify-center rounded-full border border-borderColor text-text-secondary transition-all duration-150 hover:scale-105 hover:border-gold-main hover:bg-gold-main/15 hover:text-gold-main active:scale-90 active:bg-gold-main/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-main/60 sm:h-[42px] sm:w-[42px]";

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
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: none;
          }
        }

        .viewer-fade {
          animation: viewer-fade 280ms ease-out;
        }

        @media (prefers-reduced-motion: reduce) {
          .viewer-fade {
            animation: none;
          }
        }
      `}</style>

      <Surface
        elevated
        noPadding
        className="flex h-[calc(100dvh-1rem)] max-h-[100dvh] w-full max-w-[1320px] flex-col overflow-hidden bg-(--bg-elevated) gold-glow sm:h-auto sm:max-h-[96dvh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-viewer-title"
      >
        {/* HEADER */}
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-borderColor px-4 py-3 sm:px-6 sm:py-4 md:px-7">
          <h2
            id="project-viewer-title"
            className="min-w-0 truncate text-[22px] font-semibold uppercase leading-none tracking-[0.12em] text-gold-main sm:text-[28px] md:text-[34px]"
          >
            {project.title}
          </h2>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close project viewer"
            className="interactive flex h-10 w-10 shrink-0 cursor-pointer select-none items-center justify-center rounded-full border border-borderColor text-text-secondary transition-all duration-150 hover:scale-105 hover:border-gold-main hover:bg-gold-main/15 hover:text-gold-main active:scale-90 active:bg-gold-main/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-main/60 sm:h-[46px] sm:w-[46px]"
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

        {/* SCROLLABLE CONTENT */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="grid min-w-0 grid-cols-1 gap-5 px-3 py-4 sm:px-6 sm:py-5 md:gap-6 md:px-7 md:pb-6 lg:grid-cols-[minmax(0,1.85fr)_minmax(280px,0.75fr)] lg:gap-8">
            {/* SCREENSHOT AREA */}
            <section className="min-w-0">
              <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={scrollPrevious}
                  aria-label="Previous screen"
                  className={arrowClass}
                >
                  <svg
                    width="21"
                    height="21"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M15 6l-6 6 6 6" />
                  </svg>
                </button>

                <div
                  className="min-w-0 flex-1 rounded-xl border border-gold-main/50 bg-(--bg-primary) p-1.5 gold-glow sm:rounded-2xl sm:p-2"
                  onMouseEnter={pauseWhileHovering}
                  onMouseLeave={resumeAfterHovering}
                >
                  <div
                    ref={emblaRef}
                    className="overflow-hidden rounded-lg sm:rounded-xl"
                    aria-roledescription="carousel"
                  >
                    <div className="flex touch-pan-y">
                      {screens.map((screen, index) => (
                        <div
                          key={`${screen.title}-${index}`}
                          className="min-w-0 flex-[0_0_100%]"
                          aria-roledescription="slide"
                          aria-label={`${index + 1} of ${screens.length}`}
                        >
                          <div
                            className="
                              aspect-[4/3]
                              max-h-[43dvh]
                              min-h-[190px]
                              w-full
                              overflow-hidden
                              bg-(--bg-primary)
                              sm:aspect-[16/11.5]
                              sm:max-h-[58vh]
                              sm:min-h-[300px]
                              lg:max-h-[64vh]
                            "
                          >
                            <ScreenImage
                              screen={screen}
                              alt={`${project.title} — ${screen.title}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={scrollNext}
                  aria-label="Next screen"
                  className={arrowClass}
                >
                  <svg
                    width="21"
                    height="21"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </button>
              </div>

              {/* THUMBNAILS */}
              <div className="mt-3 max-h-[92px] overflow-y-auto px-1 sm:mt-5 sm:max-h-[108px] sm:px-2">
                <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                  {screens.map((screen, index) => {
                    const isActive = index === selectedIndex;

                    return (
                      <button
                        key={`${screen.title}-thumb-${index}`}
                        type="button"
                        onClick={() => scrollTo(index)}
                        aria-label={`Go to screen ${index + 1}: ${screen.title}`}
                        aria-current={isActive ? "true" : undefined}
                        className={`interactive h-[46px] w-[62px] shrink-0 cursor-pointer overflow-hidden rounded-md border-2 bg-(--bg-primary) transition-all duration-150 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-main/60 sm:h-[48px] sm:w-[64px] sm:rounded-lg ${
                          isActive
                            ? "border-gold-main opacity-100"
                            : "border-borderColor opacity-55 hover:border-gold-main/60 hover:opacity-100"
                        }`}
                      >
                        <ScreenImage screen={screen} alt="" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* INFORMATION PANEL */}
            <aside
              key={selectedIndex}
              className="viewer-fade flex min-w-0 flex-col gap-3 border-t border-borderColor pt-5 lg:border-t-0 lg:pt-0"
            >
              {/* COUNTER */}
              <p className="leading-none" aria-hidden="true">
                <span className="text-[40px] font-semibold text-gold-main sm:text-[50px]">
                  {pad(selectedIndex + 1)}
                </span>

                <span className="text-[16px] text-text-muted sm:text-[19px]">
                  {" "}
                  / {pad(screens.length)}
                </span>
              </p>

              {/* SCREEN TITLE */}
              <h3 className="text-[20px] font-semibold leading-tight text-text-primary sm:text-[25px]">
                {currentScreen.title}
              </h3>

              {/* DESCRIPTION + TECHNOLOGIES */}
              <div className="space-y-4">
                <p className="text-[14px] leading-6 text-text-secondary sm:text-[17px] sm:leading-7">
                  {currentScreen.description}
                </p>

                {currentScreen.tech?.length > 0 && (
                  <div className="border-t border-borderColor pt-4">
                    <p className="mb-3 text-xs font-medium uppercase tracking-widest text-text-muted">
                      Technologies & tools
                    </p>

                    <div className="flex min-w-0 flex-wrap gap-2">
                      {currentScreen.tech.map((tech) => (
                        <span
                          key={tech}
                          className="shrink-0 whitespace-nowrap rounded-full border border-gold-main/50 px-3 py-1 text-[12px] text-gold-main sm:px-3.5 sm:text-[13px]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* SOURCE CODE */}
              {project.repo && (
                <div className="pt-2 lg:mt-auto lg:pt-4">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() =>
                      window.open(project.repo, "_blank", "noopener,noreferrer")
                    }
                    className="w-full justify-center"
                  >
                    <Icon name="Github" />
                    <span>Source Code</span>
                  </Button>
                </div>
              )}
            </aside>
          </div>
        </div>

        {/* FOOTER */}
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
