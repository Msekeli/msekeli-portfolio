import AppBackground from "../components/AppBackground";
import Footer from "./Footer";

export default function AppShell({ top, nav, children }) {
  return (
    <div className="relative isolate h-screen overflow-hidden">
      <AppBackground />

      <div className="relative z-10 flex h-full flex-col px-4 md:px-[clamp(2rem,6vw,8rem)]">
        {top}

        <div className="flex flex-1 overflow-hidden">
          {nav}

          <div className="flex-1 flex flex-col overflow-hidden">
            <main
              id="scroll-container"
              className="flex-1 overflow-y-auto md:snap-y md:snap-proximity"
            >
              {children}
            </main>

            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
