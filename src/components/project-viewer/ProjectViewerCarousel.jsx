import { useEffect, useRef } from "react";

// Always shows the whole screenshot: contain, no zoom, no offset, no GPU tricks.
function ScreenImage({ screen, alt }) {
  return (
    <img
      src={screen.image}
      alt={alt}
      className="h-full w-full object-contain"
      decoding="async"
    />
  );
}

export default function ProjectViewerCarousel({
  project,
  screens,
  selectedIndex,
  emblaRef,
  onPrevious,
  onNext,
  onSelect,
  onPauseHover,
  onResumeHover,
}) {
  const stripRef = useRef(null);

  // Keep the active thumbnail centred. Only the strip scrolls, never the page.
  useEffect(() => {
    const strip = stripRef.current;
    const active = strip?.querySelector('[aria-current="true"]');

    if (!strip || !active) return;

    strip.scrollTo({
      left: active.offsetLeft - strip.clientWidth / 2 + active.clientWidth / 2,
      behavior: "smooth",
    });
  }, [selectedIndex]);

  const arrowClass =
    "flex h-9 w-9 shrink-0 cursor-pointer select-none items-center justify-center rounded-full border border-borderColor text-text-secondary transition-colors duration-100 hover:border-gold-main hover:bg-gold-main/15 hover:text-gold-main active:bg-gold-main/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-main/60 sm:h-[42px] sm:w-[42px]";

  return (
    <section className="min-w-0">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onPrevious}
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
          onMouseEnter={onPauseHover}
          onMouseLeave={onResumeHover}
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
          onClick={onNext}
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

      {/* One row that scrolls sideways, so 5 or 15 screens never squeeze or
          wrap. justify-center-safe centres a short row and keeps a long row
          scrollable from its first thumbnail. */}
      <div
        ref={stripRef}
        className="relative mt-3 flex justify-center-safe gap-1.5 overflow-x-auto px-1 py-1 [scrollbar-width:none] sm:mt-5 sm:gap-2 sm:px-2 [&::-webkit-scrollbar]:hidden"
      >
        {screens.map((screen, index) => {
          const isActive = index === selectedIndex;

          return (
            <button
              key={`${screen.title}-thumb-${index}`}
              type="button"
              onClick={() => onSelect(index)}
              aria-label={`Go to screen ${index + 1}: ${screen.title}`}
              aria-current={isActive ? "true" : undefined}
              className={`h-[46px] w-[62px] shrink-0 cursor-pointer overflow-hidden rounded-md border-2 bg-(--bg-primary) transition-colors duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-main/60 sm:h-[48px] sm:w-[64px] sm:rounded-lg ${
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
  );
}
