import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Button from "./Button";
import Icon from "./Icon";
import Surface from "./Surface";

const AUTOPLAY_DELAY = 6000;
const EMBLA_OPTIONS = { loop: true, align: "center", dragFree: false };

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
      className={`h-full w-full object-cover image-render-crisp ${className}`}
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
    if (!pausedRef.current) autoplay.reset();
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
    "interactive flex h-[42px] w-[42px] shrink-0 cursor-pointer select-none items-center justify-center rounded-full border border-borderColor text-text-secondary transition-all duration-150 hover:scale-105 hover:border-gold-main hover:bg-gold-main/15 hover:text-gold-main active:scale-90 active:bg-gold-main/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-main/60";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-5"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <style>{`
        @keyframes viewer-fade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: none; }
        }
        .viewer-fade { animation: viewer-fade 280ms ease-out; }
        @media (prefers-reduced-motion: reduce) {
          .viewer-fade { animation: none; }
        }
      `}</style>
      <Surface
        elevated
        noPadding
        className="flex max-h-[96vh] w-full max-w-[1210px] flex-col overflow-hidden bg-(--bg-elevated) gold-glow"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-viewer-title"
      >
        <header className="flex shrink-0 items-center justify-between gap-4 px-5 py-[18px] sm:px-7">
          <h2
            id="project-viewer-title"
            className="truncate text-[15px] font-medium uppercase tracking-widest text-text-secondary"
          >
            {project.title}
          </h2>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close project viewer"
            className="interactive flex h-[46px] w-[46px] shrink-0 cursor-pointer select-none items-center justify-center rounded-full border border-borderColor text-text-secondary transition-all duration-150 hover:scale-105 hover:border-gold-main hover:bg-gold-main/15 hover:text-gold-main active:scale-90 active:bg-gold-main/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-main/60"
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
          <div className="grid grid-cols-1 gap-6 px-5 pb-6 sm:px-7 lg:grid-cols-[minmax(0,1.5fr)_minmax(260px,1fr)] lg:gap-8">
            <section className="min-w-0">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={scrollPrevious}
                  aria-label="Previous screen"
                  className={arrowClass}
                >
                  <svg
                    width="22"
                    height="22"
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
                  className="min-w-0 flex-1 rounded-2xl border border-gold-main/50 bg-(--bg-primary) p-2 gold-glow"
                  onMouseEnter={pauseWhileHovering}
                  onMouseLeave={resumeAfterHovering}
                >
                  <div
                    ref={emblaRef}
                    className="overflow-hidden rounded-xl"
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
                          <div className="aspect-[16/10.5] max-h-[58vh] w-full overflow-hidden">
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
                    width="22"
                    height="22"
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

              <div className="mt-5 flex justify-center gap-2 px-12">
                {screens.map((screen, index) => {
                  const isActive = index === selectedIndex;

                  return (
                    <button
                      key={`${screen.title}-thumb-${index}`}
                      type="button"
                      onClick={() => scrollTo(index)}
                      aria-label={`Go to screen ${index + 1}: ${screen.title}`}
                      aria-current={isActive ? "true" : undefined}
                      className={`interactive h-[59px] max-w-[101px] flex-1 cursor-pointer overflow-hidden rounded-lg border-2 bg-(--bg-primary) transition-all duration-150 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-main/60 ${
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
            </section>

            <aside
              key={selectedIndex}
              className="viewer-fade flex min-w-0 flex-col gap-3"
            >
              <p className="leading-none" aria-hidden="true">
                <span className="text-[50px] font-semibold text-gold-main">
                  {pad(selectedIndex + 1)}
                </span>
                <span className="text-[19px] text-text-muted">
                  {" "}
                  / {pad(screens.length)}
                </span>
              </p>

              <h3 className="text-[21px] font-semibold leading-tight text-text-primary sm:text-[25px]">
                {currentScreen.title}
              </h3>

              <p className="text-[15px] leading-6 text-text-secondary sm:text-[17px] sm:leading-7">
                {currentScreen.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {currentScreen.tech.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-gold-main/50 px-3.5 py-1 text-[13px] text-gold-main"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {project.tech?.length > 0 && (
                <div className="mt-2 border-t border-borderColor pt-4">
                  <p className="text-xs font-medium uppercase tracking-widest text-text-muted">
                    Built with
                  </p>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    {project.tech.join(" · ")}
                  </p>
                </div>
              )}

              {project.repo && (
                <div className="mt-auto pt-4">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() =>
                      window.open(project.repo, "_blank", "noopener,noreferrer")
                    }
                  >
                    <Icon name="Github" />
                    <span>Source Code</span>
                  </Button>
                </div>
              )}
            </aside>
          </div>
        </div>

        <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-borderColor px-5 py-[14px] sm:px-7">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="border border-borderColor text-[15px]! hover:border-gold-main"
          >
            <Icon name="ArrowLeft" />
            <span>Back to projects</span>
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={toggleAutoplay}
            className="border border-borderColor text-[15px]! hover:border-gold-main"
          >
            <Icon name={paused ? "Play" : "Pause"} />
            <span>{paused ? "Play slideshow" : "Pause slideshow"}</span>
          </Button>

          <p className="hidden items-center gap-2 text-[15px] text-text-secondary sm:flex">
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
