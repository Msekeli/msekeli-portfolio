import AppBackground from "./components/AppBackground";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import MobileNavigation from "./components/MobileNavigation";
import Footer from "./components/Footer";
import Home from "./pages/Home";

export default function App() {
  return (
    <div className="relative isolate min-h-screen">
      <AppBackground />

      <div className="relative z-10">
        <Header />
        <Navigation />

        <main>
          <Home />
        </main>

        <Footer />
        <MobileNavigation />
      </div>
    </div>
  );
}
