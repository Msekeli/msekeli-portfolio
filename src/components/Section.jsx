import Container from "./Container";

export default function Section({ children, id }) {
  return (
    <section id={id} className="scroll-mt-32 py-12 pt-12 md:pt-8">
      <Container className="flex flex-col">{children}</Container>
    </section>
  );
}
