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

      {/* Fills whatever height the Section leaves under the title. */}
      <div
        className={`flex flex-1 min-h-0 flex-col gap-4 transition ${
          activeCert ? "blur-sm pointer-events-none" : ""
        }`}
      >
        {/* Skills: one row per category, every skill visible.
            If the list ever outgrows the height, this area scrolls
            inside itself instead of overflowing the Section. */}
        <Surface
          noPadding
          className="gold-glow flex-1 min-h-0 md:overflow-hidden"
        >
          <div className="flex flex-col px-6 py-1 md:h-full md:overflow-y-auto">
            {skills.map((group) => (
              <div
                key={group.title}
                className="grid flex-auto grid-cols-1 items-center gap-2 border-t border-white/10 py-2 first:border-t-0 md:grid-cols-6 md:gap-4"
              >
                <h3 className="text-sm font-semibold text-gold-main md:col-span-1">
                  {group.title}
                </h3>

                <ul className="flex flex-wrap gap-1.5 md:col-span-5">
                  {group.skills.map((skill) => (
                    <li
                      key={skill}
                      className="px-3 py-1 text-xs rounded-full bg-white/10 transition hover:-translate-y-0.5 hover:bg-gold-main/15 hover:text-gold-soft"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Surface>

        <div className="shrink-0">
          <CertificatesSlider onSelect={setActiveCert} paused={!!activeCert} />
        </div>
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
