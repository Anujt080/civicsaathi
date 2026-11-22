import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CivicAlertsMarquee } from './components/CivicAlertsMarquee';
import { ServicesSection } from './components/ServicesSection';
import { ReadinessChecker } from './components/ReadinessChecker';
import { HowItWorks } from './components/HowItWorks';
import { KendrasSection } from './components/KendrasSection';
import { PillarsSection } from './components/PillarsSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { ServiceModal } from './components/ServiceModal';
import { CivicService } from './types';

export const App: React.FC = () => {
  const [selectedService, setSelectedService] = useState<CivicService | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearchFocus = () => {
    const input = document.getElementById('hero-service-search');
    if (input) {
      input.focus();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar onSearchFocus={handleSearchFocus} />

      {/* Main Page Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-12 sm:space-y-16">
        {/* 1. Hero Landing Banner & Quick Search */}
        <Hero
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* 2. Civic Alerts & Procedural Bulletins Marquee */}
        <CivicAlertsMarquee />

        {/* 3. Services Catalog & Document Checklist Directory */}
        <ServicesSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectService={(service) => setSelectedService(service)}
        />

        {/* 4. Interactive Pre-Submission Readiness & Discrepancy Checker (New Feature) */}
        <ReadinessChecker initialServiceId={selectedService?.id} />

        {/* 5. Three-Step Workflow */}
        <HowItWorks />

        {/* 6. Seva Kendras & Facilitation Center Directory */}
        <KendrasSection />

        {/* 7. Why CivicSaathi: Trust, Privacy & Accuracy Pillars */}
        <PillarsSection />

        {/* 8. Common Citizen Questions & FAQ */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Full Guidance & Checklist Detail Modal */}
      <ServiceModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
      />
    </div>
  );
};

export default App;
