import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { CivicAlertsMarquee } from '../components/CivicAlertsMarquee';
import { CivicIssuesBanner } from '../components/CivicIssuesBanner';
import { ServicesExplorer } from '../components/ServicesExplorer';
import { ReadinessChecker } from '../components/ReadinessChecker';
import { HowItWorks } from '../components/HowItWorks';
import { KendrasSection } from '../components/KendrasSection';
import { PillarsSection } from '../components/PillarsSection';
import { FaqSection } from '../components/FaqSection';
import { CivicService } from '../types';

interface HomePageProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedService: CivicService | null;
  onSelectService: (service: CivicService) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  searchQuery,
  onSearchChange,
  selectedService,
  onSelectService,
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* 1. Hero Landing Banner & Quick Search */}
      <Hero searchQuery={searchQuery} onSearchChange={onSearchChange} />

      {/* 2. Civic Alerts & Procedural Bulletins Marquee */}
      <CivicAlertsMarquee />

      {/* 3. Civic Issue Reporting Discovery Banner */}
      <CivicIssuesBanner
        onReportIssue={() => navigate('/report-issue')}
        onViewMyReports={() => navigate('/my-reports')}
      />

      {/* 4. Civic Services Explorer & Statutory Checklist Directory */}
      <ServicesExplorer
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onSelectService={onSelectService}
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
    </div>
  );
};
