import Header from "../components/Header";
import Navigation from "../components/Navigation";
import MobileNavigation from "../components/MobileNavigation";
import Footer from "../components/Footer";

import Hero from "../sections/Hero";
import About from "../sections/About";
import Skills from "../sections/Skills";
import Projects from "../sections/Projects";
import Contact from "../sections/Contact";

import { Analytics } from "@vercel/analytics/react";

export default function Home() {
  return (
    <>
      <Header />
      <Navigation />

      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>

      <Footer />
      <MobileNavigation />

      <Analytics />
    </>
  );
}
