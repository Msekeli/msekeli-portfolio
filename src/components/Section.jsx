import Container from "./Container";

export default function Section({ children, id, className = "" }) {
  return (
    <section
      id={id}
      className={`scroll-mt-14 scroll-snap-align-start py-12 pt-12 md:h-[calc(100vh-3.5rem)] md:pt-8 ${className}`}
    >
      <Container className="flex flex-col h-full">{children}</Container>
    </section>
  );
}
