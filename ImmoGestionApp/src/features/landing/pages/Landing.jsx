import { Navbar } from "../components/Navbar";
import { HeroSection } from "../components/HeroSection";
import { ServicesSection } from "../components/ServicesSection";
import { CRMSection } from "../components/CRMSection";
import { DashboardPreview } from "../components//DashboardPreview";
import { Footer } from "../components/Footer";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <CRMSection />
        <DashboardPreview />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;