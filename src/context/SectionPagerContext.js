import { createContext } from "react";

// Tells each Section which section is currently showing.
const SectionPagerContext = createContext({ activeId: null, ids: [] });

export default SectionPagerContext;
