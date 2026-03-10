import Hero from "../sections/Hero";
import About from "../sections/About";
import Certificates from "../sections/Certificates";
import Projects from "../sections/Projects";
import Contact from "../sections/Contact";
import { Analytics } from "@vercel/analytics/react";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Certificates />
      <Projects />
      <Contact />
      <Analytics />
    </>
  );
}
