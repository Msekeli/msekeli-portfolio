import Header from "../components/Header";
import Navigation from "../components/Navigation";
import MobileNavigation from "../components/MobileNavigation";
import Footer from "../components/Footer";
import AppBackground from "../components/AppBackground";

import Hero from "../sections/Hero";
import About from "../sections/About";
import Skills from "../sections/Skills";
import Projects from "../sections/Projects";
import Contact from "../sections/Contact";

import { Analytics } from "@vercel/analytics/react";

export default function Home() {
  return (
    <div className="relative isolate min-h-screen">
      <AppBackground />

      <div className="relative z-10">
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
      </div>

      <Analytics />
    </div>
  );
}
