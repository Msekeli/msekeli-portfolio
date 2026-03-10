import Footer from "./Footer";

export default function AppShell({ top, nav, children }) {
  return (
    <div className="h-screen flex flex-col overflow-hidden px-4 md:px-[clamp(2rem,6vw,8rem)]">
      {top}
      <div className="flex flex-1 overflow-hidden">
        {nav}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main
            id="scroll-container"
            className="flex-1 overflow-y-auto snap-y snap-mandatory"
          >
            {children}
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}
