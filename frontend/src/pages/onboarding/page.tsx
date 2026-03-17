import { HeroSection } from './components/HeroSection';
import { TechStackSection } from './components/TechStackSection';
import { ProjectStructureSection } from './components/ProjectStructureSection';
import { FooterSection } from './components/FooterSection';

export function OnboardingPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <TechStackSection />
      <ProjectStructureSection />
      <FooterSection />
    </div>
  );
}
