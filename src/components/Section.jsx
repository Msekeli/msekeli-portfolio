import Container from "./Container";

export default function Section({ children, id }) {
  return (
    <section id={id} className="snap-start py-12 md:min-h-full pt-12 md:pt-8">
      <Container className="flex flex-col">{children}</Container>
    </section>
  );
}
