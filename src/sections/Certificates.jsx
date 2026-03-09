import { useState, useEffect } from "react";
import Section from "../components/Section";
import SectionTitle from "../components/SectionTitle";
import Surface from "../components/Surface";
import CertificatesSlider from "../components/CertificatesSlider";
import skills from "../data/skills.json";

export default function Certificates() {
  const [activeCert, setActiveCert] = useState(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setActiveCert(null);
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <Section id="certificates">
      <SectionTitle>Skills</SectionTitle>

      {/* Blur only section content when modal is open */}
      <div
        className={
          activeCert ? "blur-sm pointer-events-none transition" : "transition"
        }
      >
        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto mb-6">
          <Surface className="gold-glow p-4">
            <h3 className="text-base font-semibold mb-2">Frontend</h3>
            <div className="flex flex-wrap gap-2">
              {skills.frontend.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 text-xs rounded-full bg-white/10"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Surface>

          <Surface className="gold-glow p-4">
            <h3 className="text-base font-semibold mb-2">Backend & Data</h3>
            <div className="flex flex-wrap gap-2">
              {skills.backend.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 text-xs rounded-full bg-white/10"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Surface>

          <Surface className="gold-glow p-4">
            <h3 className="text-base font-semibold mb-2">Cloud & Tools</h3>
            <div className="flex flex-wrap gap-2">
              {skills.cloud.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 text-xs rounded-full bg-white/10"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Surface>
        </div>

        {/* Certificates Slider */}
        <CertificatesSlider onSelect={setActiveCert} />
      </div>

      {/* Modal */}
      {activeCert && (
        <div
          className="absolute inset-0 z-40 flex items-center justify-center bg-black/40"
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
              onClick={() => setActiveCert(null)}
              className="absolute -top-5  right-0 text-white/70 hover:text-yellow-400 transition"
            >
              Close ✕
            </button>
          </Surface>
        </div>
      )}
    </Section>
  );
}
