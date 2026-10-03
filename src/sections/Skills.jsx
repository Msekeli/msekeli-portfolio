import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Section from "../components/Section";
import SectionTitle from "../components/SectionTitle";
import Surface from "../components/Surface";
import CertificatesSlider from "../components/CertificatesSlider";
import skills from "../data/skills.json";

export default function Skills() {
  const [activeCert, setActiveCert] = useState(null);
  const closeButtonRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setActiveCert(null);
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  useEffect(() => {
    if (activeCert) {
      previouslyFocusedRef.current = document.activeElement;
      closeButtonRef.current?.focus();
    } else if (previouslyFocusedRef.current) {
      previouslyFocusedRef.current.focus();
      previouslyFocusedRef.current = null;
    }
  }, [activeCert]);

  return (
    <Section id="skills">
      <SectionTitle>Skills</SectionTitle>

      <div
        className={
          activeCert ? "blur-sm pointer-events-none transition" : "transition"
        }
      >
        <div
          className="
            grid grid-cols-1 md:grid-cols-3
            gap-5
            max-w-6xl mx-auto
            mb-15
          "
        >
          <Surface className="gold-glow surface-lift p-10">
            <h3 className="text-base font-semibold mb-2">Frontend</h3>

            <div className="flex flex-wrap gap-2">
              {skills.frontend.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 text-xs rounded-full bg-white/10 transition hover:-translate-y-0.5 hover:bg-gold-main/15 hover:text-gold-soft"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Surface>

          <Surface className="gold-glow surface-lift p-10">
            <h3 className="text-base font-semibold mb-2">Backend & Data</h3>

            <div className="flex flex-wrap gap-2">
              {skills.backend.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 text-xs rounded-full bg-white/10 transition hover:-translate-y-0.5 hover:bg-gold-main/15 hover:text-gold-soft"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Surface>

          <Surface className="gold-glow surface-lift p-10">
            <h3 className="text-base font-semibold mb-2">Cloud & Tools</h3>

            <div className="flex flex-wrap gap-2">
              {skills.cloud.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 text-xs rounded-full bg-white/10 transition hover:-translate-y-0.5 hover:bg-gold-main/15 hover:text-gold-soft"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Surface>
        </div>

        <CertificatesSlider onSelect={setActiveCert} paused={!!activeCert} />
      </div>

      {activeCert &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Certificate preview"
            onClick={() => setActiveCert(null)}
          >
            <Surface
              noPadding
              elevated
              className="gold-glow relative p-3 max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activeCert.image}
                alt="Certificate preview"
                className="max-h-[70vh] w-auto object-contain"
              />

              <button
                ref={closeButtonRef}
                onClick={() => setActiveCert(null)}
                className="absolute -top-5 right-0 text-white/70 hover:text-yellow-400 transition"
              >
                Close ✕
              </button>
            </Surface>
          </div>,
          document.body,
        )}
    </Section>
  );
}
