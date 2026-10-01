import { useEffect, useRef, useState } from "react";
import Container from "./Container";

export default function Section({ children, id }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id={id}
      className={`scroll-mt-32 py-12 pt-12 md:pt-8 ${
        visible ? "animate-fade" : "opacity-0"
      }`}
    >
      <Container className="flex flex-col">{children}</Container>
    </section>
  );
}
