import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ServiceModal } from './components/ServiceModal';
import { ScrollToTop } from './components/ScrollToTop';
import { HomePage } from './pages/HomePage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { CivicAlertsPage } from './pages/CivicAlertsPage';
import { FindCentersPage } from './pages/FindCentersPage';
import { ReportIssueForm } from './components/ReportIssueForm';
import { MyReports } from './components/MyReports';
import { CivicService } from './types';

export const App: React.FC = () => {
  const [selectedService, setSelectedService] = useState<CivicService | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();

  // Backward compatibility with hash links: #report-issue and #my-reports
  useEffect(() => {
    if (window.location.hash === '#report-issue' && location.pathname !== '/report-issue') {
      navigate('/report-issue', { replace: true });
    } else if (window.location.hash === '#my-reports' && location.pathname !== '/my-reports') {
      navigate('/my-reports', { replace: true });
    }
  }, [location.pathname, navigate]);

  const handleSearchFocus = () => {
    if (location.pathname !== '/') {
      navigate('/#services');
    }
    const input = document.getElementById('hero-service-search');
    if (input) {
      input.focus();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Scroll to top & hash handler on navigation */}
      <ScrollToTop />

      {/* Top Navbar */}
      <Navbar onSearchFocus={handleSearchFocus} />

      {/* Main Page Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Routes>
          {/* Home Route */}
          <Route
            path="/"
            element={
              <HomePage
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedService={selectedService}
                onSelectService={(service) => setSelectedService(service)}
              />
            }
          />

          {/* Dedicated Navbar Routes */}
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/civic-alerts" element={<CivicAlertsPage />} />
          <Route path="/find-centers" element={<FindCentersPage />} />

          {/* Civic Issue Reporting Routes */}
          <Route
            path="/report-issue"
            element={
              <ReportIssueForm
                onReturnHome={() => navigate('/')}
                onViewMyReports={() => navigate('/my-reports')}
              />
            }
          />
          <Route
            path="/my-reports"
            element={
              <MyReports
                onReportNewIssue={() => navigate('/report-issue')}
                onReturnHome={() => navigate('/')}
              />
            }
          />

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
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
