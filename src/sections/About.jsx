import { useState } from "react";
import Section from "../components/Section";
import SectionTitle from "../components/SectionTitle";
import Text from "../components/Text";
import Surface from "../components/Surface";
import items from "../data/about.json";

export default function About() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <Section id="about">
      <SectionTitle>About</SectionTitle>

      <div className="space-y-4 stagger">
        {items.map((item, index) => {
          const open = openIndex === index;

          return (
            <div key={item.q} className="animate-slide-up">
              <Surface
                elevated={open}
                className={open ? "gold-glow border border-gold-main/30" : ""}
              >
                <button
                  onClick={() => setOpenIndex(open ? null : index)}
                  className="
                    w-full px-4 py-3
                    flex justify-between items-start gap-4
                    text-left
                    cursor-pointer
                  "
                >
                  <span className="font-medium text-text-primary">
                    {item.q}
                  </span>

                  <span
                    className={
                      open
                        ? "text-gold-main text-lg leading-none"
                        : "text-text-muted text-lg leading-none"
                    }
                  >
                    {open ? "–" : "+"}
                  </span>
                </button>

                {open && (
                  <div className="px-4 pb-4">
                    <Text variant="secondary">{item.a}</Text>
                  </div>
                )}
              </Surface>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
