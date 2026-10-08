import Header from "../components/Header";
import Navigation from "../components/Navigation";
import MobileNavigation from "../components/MobileNavigation";
import Footer from "../components/Footer";
import AppBackground from "../components/AppBackground";
import SectionPagerContext from "../context/SectionPagerContext";

import Hero from "../sections/Hero";
import About from "../sections/About";
import Skills from "../sections/Skills";
import Projects from "../sections/Projects";
import Contact from "../sections/Contact";

import { Analytics } from "@vercel/analytics/react";
import useActiveSection from "../hooks/useActiveSection";
import useDesktopSectionPager from "../hooks/useDesktopSectionPager";
import { navIds } from "../data/nav";

export default function Home() {
  const [activeId, setActiveId] = useActiveSection(navIds);

  useDesktopSectionPager(navIds, activeId, setActiveId);

  return (
    <div className="min-h-screen">
      <AppBackground />

      <div className="relative z-10 pt-14">
        <Header />
        <Navigation activeId={activeId} setActiveId={setActiveId} />

        <SectionPagerContext.Provider value={{ activeId, ids: navIds }}>
          <main className="pager">
            <Hero setActiveId={setActiveId} />
            <About />
            <Skills />
            <Projects />
            <Contact />
          </main>
        </SectionPagerContext.Provider>

        <Footer />
        <MobileNavigation activeId={activeId} setActiveId={setActiveId} />
      </div>

      <Analytics />
    </div>
  );
}
