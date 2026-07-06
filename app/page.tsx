import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import ProjectsSection from "./components/ProjectsSection";
import BeeSection from "./components/BeeSection";
import ExperienceSection from "./components/ExperienceSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-[#0a0a0f]">
      <Header />
      <main className="flex flex-col flex-1 pt-20">
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <BeeSection />
        <ExperienceSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
