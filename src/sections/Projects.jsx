import { useState } from "react";
import Section from "../components/Section";
import SectionTitle from "../components/SectionTitle";
import Text from "../components/Text";
import Surface from "../components/Surface";
import Button from "../components/Button";
import Icon from "../components/Icon";
import projects from "../data/projects.json";

export default function Projects() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState("next");

  const total = projects.length;
  const visible = projects.slice(index, index + 2);

  const next = () => {
    if (index + 2 < total) {
      setDirection("next");
      setIndex(index + 2);
    }
  };

  const prev = () => {
    if (index - 2 >= 0) {
      setDirection("prev");
      setIndex(index - 2);
    }
  };

  return (
    <Section id="projects">
      <div className="flex flex-col h-[75vh]">
        {/* Controller */}
        <div className="flex items-center justify-between mb-1">
          <SectionTitle>Projects</SectionTitle>

          <span className="text-sm text-text-secondary">
            {index + 1}-{Math.min(index + 2, total)} of {total}
          </span>
        </div>

        <div className="flex justify-between mb-3">
          <button
            onClick={prev}
            disabled={index === 0}
            className="text-sm text-text-secondary hover:text-gold-main disabled:opacity-30"
          >
            ← Previous
          </button>

          <button
            onClick={next}
            disabled={index + 2 >= total}
            className="text-sm text-text-secondary hover:text-gold-main disabled:opacity-30"
          >
            Next →
          </button>
        </div>

        {/* Divider */}
        <div className="border-b border-borderColor mb-4"></div>

        {/* Animated Project Grid */}
        <div
          key={index}
          className={`
            grid grid-cols-1 md:grid-cols-2 gap-6 flex-1
            ${direction === "next" ? "animate-slide-left" : "animate-slide-right"}
          `}
        >
          {visible.map((project) => (
            <Surface key={project.title} className="group hover:gold-glow">
              {/* Image */}
              <div className="h-27.5 overflow-hidden rounded-lg">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
              </div>

              <div className="mt-3 space-y-2">
                {/* Title */}
                <h3 className="text-sm font-medium text-text-primary">
                  {project.title}
                </h3>

                {/* Description */}
                <Text variant="secondary" className="text-sm leading-relaxed">
                  {project.description}
                </Text>

                {/* Tech */}
                <div className="flex flex-wrap gap-1">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-0.5 border border-gold-main/30 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-2">
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="primary">
                        <Icon name="ExternalLink" />
                      </Button>
                    </a>
                  )}

                  {project.repo && (
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="secondary">
                        <Icon name="Github" />
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
