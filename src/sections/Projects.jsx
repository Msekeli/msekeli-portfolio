import { useEffect, useRef, useState } from "react";
import Section from "../components/Section";
import SectionTitle from "../components/SectionTitle";
import Icon from "../components/Icon";
import Button from "../components/Button";
import ProjectViewer from "../components/project-viewer/ProjectViewer";
import projects from "../data/projects.json";

// The card shows languages/frameworks only, all styled equally (same chips as
// the Skills section). Set "cardTech" in projects.json to choose them; every
// entry is shown. Tools and the rest of the stack live in the project viewer.
// Without "cardTech", the first 3 technologies are used.
const FALLBACK_TAGS = 3;

function getCardTags(project) {
  if (project.cardTech) return project.cardTech;
  return (project.tech ?? []).slice(0, FALLBACK_TAGS);
}

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const previousScrollY = useRef(0);

  useEffect(() => {
    const handlePopState = () => {
      setSelectedProject(null);

      requestAnimationFrame(() => {
        window.scrollTo({
          top: previousScrollY.current,
          behavior: "instant",
        });
      });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const openProjectViewer = (project) => {
    previousScrollY.current = window.scrollY;

    window.history.pushState({ projectViewer: true }, "", window.location.href);

    setSelectedProject(project);
  };

  const closeProjectViewer = () => {
    if (window.history.state?.projectViewer) {
      window.history.back();
      return;
    }

    setSelectedProject(null);
  };

  return (
    <>
      <Section id="projects">
        <div className="flex flex-col">
          <SectionTitle>Projects</SectionTitle>

          {/*
            On xl screens the grid is sized to the viewport, with a minimum
            height so cards never get cramped. Adjust the 13.5rem offset (nav
            bar + title + section padding) if the bottom row sits too high or
            too low. The negative top margin pulls the grid up under the title;
            remove it if SectionTitle's spacing changes.
          */}
          <div className="-mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:h-[max(40rem,calc(100svh-13.5rem))] xl:grid-cols-3 xl:grid-rows-2">
            {projects.map((project) => {
              const tags = getCardTags(project);
              const screenCount = project.screens?.length ?? 0;
              const screenLabel = screenCount === 1 ? "screen" : "screens";

              return (
                /* Outer box is static: it receives hover and click, so the
                   lift never makes the hover flicker, and a click anywhere on
                   the card opens the viewer. */
                <div
                  key={project.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${project.title} screens`}
                  onClick={() => openProjectViewer(project)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openProjectViewer(project);
                    }
                  }}
                  className="group/card h-full min-h-0 cursor-pointer rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-main/70"
                >
                  {/* Inner card: the only thing that moves */}
                  <div className="relative h-full min-h-0 transition-transform duration-100 ease-out [@media(hover:hover)]:group-hover/card:-translate-y-1">
                    <div className="surface surface--elevated flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-transparent group-hover/card:border-gold-main/60">
                      {/* Screenshot: always shown in full, never cropped,
                          never moves. */}
                      <div className="relative aspect-video overflow-hidden rounded-t-2xl bg-black/40 xl:aspect-auto xl:min-h-28 xl:flex-1">
                        <img
                          src={project.cover}
                          alt={`${project.title} project screen`}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 h-full w-full object-contain p-2"
                        />

                        {project.ai && (
                          <span className="absolute right-3 top-3 rounded-md border border-gold-main bg-black/50 px-2.5 py-1 text-sm font-semibold text-gold-main">
                            AI
                          </span>
                        )}

                        {screenCount > 0 && (
                          <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md bg-black/70 px-2 py-1 text-xs font-medium text-text-primary">
                            <Icon name="Image" />
                            {screenCount} {screenLabel}
                          </span>
                        )}
                      </div>

                      <div className="flex shrink-0 flex-col gap-2.5 p-4">
                        <h3 className="text-lg font-semibold leading-tight text-text-primary">
                          {project.title}
                        </h3>

                        {/* Never clamped. min-h-10 reserves two lines so
                            every card lines up. Keep summaries to about two
                            lines. */}
                        <p className="min-h-10 text-sm leading-5 text-text-secondary">
                          {project.summary ?? project.description}
                        </p>

                        {/* Same chip style as the Skills section, all equal */}
                        <ul className="flex flex-wrap gap-1.5">
                          {tags.map((tag) => (
                            <li
                              key={tag}
                              className="rounded-full bg-white/10 px-3 py-1 text-xs"
                            >
                              {tag}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Cover: purely visual, never intercepts the mouse, and
                        appears instantly (no fade). */}
                    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-2xl bg-black/75 opacity-0 group-hover/card:opacity-100 group-focus-visible/card:opacity-100">
                      <Button
                        type="button"
                        variant="primary"
                        tabIndex={-1}
                        className="pointer-events-none bg-black/50"
                      >
                        <Icon name="Image" />
                        <span>View screens</span>
                      </Button>

                      {screenCount > 0 && (
                        <span className="text-sm text-text-secondary">
                          {screenCount} {screenLabel} inside
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {selectedProject && (
        <ProjectViewer project={selectedProject} onClose={closeProjectViewer} />
      )}
    </>
  );
}
