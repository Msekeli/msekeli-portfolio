import Container from "./Container";

export default function Section({ children, id }) {
  return (
    <section
      id={id}
      className="scroll-mt-14 py-12 pt-12 md:min-h-[calc(100vh-3.5rem)] md:pt-8"
    >
      <Container className="flex flex-col">{children}</Container>
    </section>
  );
}
