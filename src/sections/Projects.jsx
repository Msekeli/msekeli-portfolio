import { useState, useEffect } from "react";
import Section from "../components/Section";
import SectionTitle from "../components/SectionTitle";
import Text from "../components/Text";
import Surface from "../components/Surface";
import Button from "../components/Button";
import Icon from "../components/Icon";
import projects from "../data/projects.json";
import { track } from "@vercel/analytics";

export default function Projects() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState("next");
  const [perPage, setPerPage] = useState(2);

  const total = projects.length;

  // Responsive projects per page
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 768) {
        setPerPage(1);
      } else {
        setPerPage(2);
      }
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const visible = projects.slice(index, index + perPage);

  const next = () => {
    if (index + perPage < total) {
      setDirection("next");
      setIndex(index + perPage);
    }
  };

  const prev = () => {
    if (index - perPage >= 0) {
      setDirection("prev");
      setIndex(index - perPage);
    }
  };

  return (
    <Section id="projects">
      <div className="flex flex-col">
        {/* Controller */}
        <div className="flex items-center justify-between mb-1">
          <SectionTitle>Projects</SectionTitle>

          <span className="text-sm md:text-lg font-bold text-text-white">
            {index + 1}-{Math.min(index + perPage, total)} of {total}
          </span>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mb-3">
          <button
            onClick={prev}
            disabled={index === 0}
            className="text-sm md:text-lg font-bold text-text-white hover:text-gold-main disabled:opacity-30"
          >
            ← Previous
          </button>

          <button
            onClick={next}
            disabled={index + perPage >= total}
            className="text-sm md:text-lg font-bold text-text-white hover:text-gold-main disabled:opacity-30"
          >
            Next →
          </button>
        </div>

        {/* Divider */}
        <div className="border-b border-borderColor mb-4"></div>

        {/* Projects */}
        <div
          key={index}
          className={`
            grid grid-cols-1 md:grid-cols-2 gap-6
            ${direction === "next" ? "animate-slide-left" : "animate-slide-right"}
          `}
        >
          {visible.map((project) => (
            <Surface
              key={project.title}
              elevated
              className="group flex flex-col gold-glow transition"
            >
              {/* Image */}
              <div className="aspect-video overflow-hidden rounded-lg">
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 image-render-crisp"
                  style={{ imageRendering: "auto" }}
                />
              </div>

              <div className="mt-3 space-y-3 flex flex-col grow">
                {/* Title */}
                <h3 className="text-sm font-medium text-text-primary">
                  {project.title}
                </h3>

                {/* Tech */}
                <div className="flex flex-wrap gap-1">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-1 border border-gold-main/30 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <Text
                  variant="secondary"
                  className="text-sm leading-relaxed line-clamp-3"
                >
                  {project.description}
                </Text>

                {/* Buttons */}
                <div className="flex flex-wrap gap-2 pt-2 mt-auto">
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="primary"
                        onClick={() =>
                          track("project_demo_click", {
                            project: project.title,
                          })
                        }
                      >
                        <Icon name="ExternalLink" />
                        Live Demo
                      </Button>
                    </a>
                  )}

                  {project.repo && (
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="secondary"
                        onClick={() =>
                          track("project_repo_click", {
                            project: project.title,
                          })
                        }
                      >
                        <Icon name="Github" />
                        Source Code
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </Surface>
          ))}
        </div>
      </div>
    </Section>
  );
}
