import { useEffect, useRef, useState } from "react";
import Section from "../components/Section";
import SectionTitle from "../components/SectionTitle";
import Surface from "../components/Surface";
import Icon from "../components/Icon";
import Button from "../components/Button";
import ProjectViewer from "../components/ProjectViewer";
import projects from "../data/projects.json";

const MAX_TAGS = 3;

// Card tags show the core stack only (frontend, backend, database), never a
// "+N" overflow. Set "cardTech" in projects.json to choose them; otherwise the
// frontend plus the first two other technologies are used. The full stack is
// listed in the project viewer.
function getCardTags(project) {
  if (project.cardTech) return project.cardTech;
  if (!project.frontend) return project.tech;

  const frontendKey = project.frontend.split(" ")[0];
  const rest = project.tech.filter((tech) => !tech.startsWith(frontendKey));

  return [project.frontend, ...rest];
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
              const visibleTags = tags.slice(0, MAX_TAGS);

              return (
                <Surface
                  key={project.id}
                  elevated
                  noPadding
                  className="group flex h-full min-h-0 flex-col overflow-hidden transition duration-300 hover:-translate-y-0.5"
                >
                  <div className="relative aspect-[16/7] overflow-hidden rounded-t-2xl xl:aspect-auto xl:min-h-28 xl:flex-1">
                    <img
                      src={project.cover}
                      alt={`${project.title} project screen`}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover object-top image-render-crisp transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                    />

                    {project.ai && (
                      <span className="absolute right-3 top-3 rounded-md border border-gold-main px-2.5 py-1 text-sm font-semibold text-gold-main">
                        AI
                      </span>
                    )}
                  </div>

                  <div className="flex shrink-0 flex-col gap-2.5 p-4">
                    <h3 className="text-lg font-semibold leading-tight text-text-primary">
                      {project.title}
                    </h3>

                    <p className="line-clamp-2 min-h-10 text-sm leading-5 text-text-secondary">
                      {project.summary ?? project.description}
                    </p>

                    <ul className="flex flex-nowrap gap-1.5 overflow-hidden">
                      {visibleTags.map((tag, index) => (
                        <li
                          key={tag}
                          className={`whitespace-nowrap rounded-md border px-2.5 py-1 text-xs font-medium ${
                            index === 0
                              ? "border-gold-main/60 bg-gold-main/10 text-gold-main"
                              : "border-transparent bg-text-primary/5 text-text-secondary"
                          }`}
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>

                    <div className="flex gap-2 pt-1">
                      <Button
                        type="button"
                        variant="primary"
                        onClick={() => openProjectViewer(project)}
                        className="flex-1 justify-center"
                      >
                        <Icon name="Image" />
                        <span>View screens</span>
                      </Button>

                      {project.repo && (
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() =>
                            window.open(
                              project.repo,
                              "_blank",
                              "noopener,noreferrer",
                            )
                          }
                          aria-label={`${project.title} source code`}
                          className="border border-borderColor px-3! hover:border-gold-main"
                        >
                          <Icon name="Github" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Surface>
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
