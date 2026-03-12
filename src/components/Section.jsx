import { useEffect, useRef, useState } from "react";
import Container from "./Container";

export default function Section({ children, id }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id={id}
      className={`snap-start py-12 md:min-h-full pt-12 md:pt-8 ${
        visible ? "animate-fade" : "opacity-0"
      }`}
    >
      <Container className="flex flex-col">{children}</Container>
    </section>
  );
}
