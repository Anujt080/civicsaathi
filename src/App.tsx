import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CivicAlertsMarquee } from './components/CivicAlertsMarquee';
import { CivicIssuesBanner } from './components/CivicIssuesBanner';
import { ServicesExplorer } from './components/ServicesExplorer';
import { ReadinessChecker } from './components/ReadinessChecker';
import { HowItWorks } from './components/HowItWorks';
import { KendrasSection } from './components/KendrasSection';
import { PillarsSection } from './components/PillarsSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { ServiceModal } from './components/ServiceModal';
import { ReportIssueForm } from './components/ReportIssueForm';
import { MyReports } from './components/MyReports';
import { CivicService } from './types';

export type AppView = 'home' | 'report-issue' | 'my-reports';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedService, setSelectedService] = useState<CivicService | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Synchronize view with URL hash
  useEffect(() => {
    const handleHashSync = () => {
      const hash = window.location.hash;
      if (hash === '#report-issue') {
        setCurrentView('report-issue');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#my-reports') {
        setCurrentView('my-reports');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setCurrentView('home');
        if (hash) {
          const targetEl = document.querySelector(hash);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    };

    // Initial check
    handleHashSync();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashSync);
    return () => window.removeEventListener('hashchange', handleHashSync);
  }, []);

  const handleNavigate = (view: AppView, targetHash?: string) => {
    setCurrentView(view);
    if (view === 'report-issue') {
      window.location.hash = '#report-issue';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'my-reports') {
      window.location.hash = '#my-reports';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (targetHash) {
        window.location.hash = targetHash;
        setTimeout(() => {
          const el = document.querySelector(targetHash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      } else {
        window.history.pushState(null, '', window.location.pathname);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleSearchFocus = () => {
    if (currentView !== 'home') {
      handleNavigate('home', '#services');
    }
    const input = document.getElementById('hero-service-search');
    if (input) {
      input.focus();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onSearchFocus={handleSearchFocus}
      />

      {/* Main Page Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-12 sm:space-y-16">
        {currentView === 'report-issue' ? (
          /* Dedicated "Report an Issue" View */
          <ReportIssueForm
            onReturnHome={() => handleNavigate('home', '')}
            onViewMyReports={() => handleNavigate('my-reports', '#my-reports')}
          />
        ) : currentView === 'my-reports' ? (
          /* Dedicated "My Reports" Tracking View */
          <MyReports
            onReportNewIssue={() => handleNavigate('report-issue', '#report-issue')}
            onReturnHome={() => handleNavigate('home', '')}
          />
        ) : (
          /* Standard Complete Homepage */
          <>
            {/* 1. Hero Landing Banner & Quick Search */}
            <Hero
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            {/* 2. Civic Alerts & Procedural Bulletins Marquee */}
            <CivicAlertsMarquee />

            {/* 3. Civic Issue Reporting Discovery Banner (New Feature) */}
            <CivicIssuesBanner
              onReportIssue={() => handleNavigate('report-issue', '#report-issue')}
              onViewMyReports={() => handleNavigate('my-reports', '#my-reports')}
            />

            {/* 4. Civic Services Explorer & Statutory Checklist Directory */}
            <ServicesExplorer
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSelectService={(service) => setSelectedService(service)}
            />

            {/* 5. Interactive Pre-Submission Readiness & Discrepancy Checker */}
            <ReadinessChecker initialServiceId={selectedService?.id} />

            {/* 6. Three-Step Workflow */}
            <HowItWorks />

            {/* 7. Seva Kendras & Facilitation Center Directory */}
            <KendrasSection />

            {/* 8. Why CivicSaathi: Trust, Privacy & Accuracy Pillars */}
            <PillarsSection />

            {/* 9. Common Citizen Questions & FAQ */}
            <FaqSection />
          </>
        )}
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
