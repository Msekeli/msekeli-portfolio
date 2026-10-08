import { useContext } from "react";
import Container from "./Container";
import SectionPagerContext from "../context/SectionPagerContext";

export default function Section({ children, id, className = "" }) {
  const { activeId, ids } = useContext(SectionPagerContext);

  // On desktop only one section shows at a time. Sections before the active
  // one rest slightly above, sections after it slightly below, and the CSS in
  // index.css fades them in and out. Below md this is ignored and the
  // sections scroll normally.
  const index = ids.indexOf(id);
  const activeIndex = ids.indexOf(activeId);
  const position =
    index === activeIndex ? "active" : index < activeIndex ? "before" : "after";

  return (
    <section
      id={id}
      data-pos={position}
      className={`scroll-mt-14 py-12 pt-12 md:h-[calc(100vh-3.5rem)] md:pt-8 ${className}`}
    >
      <Container className="flex flex-col h-full">{children}</Container>
    </section>
  );
}
