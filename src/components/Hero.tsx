import React, { useState } from 'react';
import { Search, ArrowRight, FileCheck, CheckCircle2, Lock } from 'lucide-react';

interface HeroProps {
  onSearchChange: (query: string) => void;
  searchQuery: string;
}

export const Hero: React.FC<HeroProps> = ({ onSearchChange, searchQuery }) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalQuery(val);
    onSearchChange(val);
  };

  const popularShortcuts = [
    'Aadhaar Card',
    'Passport',
    'PAN Correction',
    'Driving Licence',
    'Domicile Certificate',
    'Social Pensions',
  ];

  const handleShortcutClick = (term: string) => {
    setLocalQuery(term);
    onSearchChange(term);
    const servicesElement = document.getElementById('services');
    if (servicesElement) {
      servicesElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden bg-white dark:bg-black transition-colors">
      {/* Background Graphic Illustration */}
      <div
        className="absolute inset-0 bg-cover bg-right bg-no-repeat pointer-events-none opacity-85 dark:opacity-25 transition-opacity"
        style={{ backgroundImage: `url('/hero-banner.png')` }}
        aria-hidden="true"
      />

      {/* Multi-Stop Clean Gradients to guarantee high readability */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent sm:from-white sm:via-white/80 sm:to-transparent dark:from-black dark:via-black/90 dark:to-transparent pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-transparent dark:from-black/80 dark:via-transparent to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Hero Content Container */}
      <div className="relative z-10 p-6 sm:p-10 lg:p-14">
        <div className="max-w-2xl space-y-6">
          {/* Civic Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
            <span>Citizen Guidance Platform</span>
            <span className="text-slate-300 dark:text-zinc-700">|</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">100% Free Public Utility</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
            Government services, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-emerald-600 dark:from-blue-400 dark:via-blue-300 dark:to-emerald-400">
              without the confusion.
            </span>
          </h1>

          {/* Description Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
            Eliminate counter rejection before standing in line. Check verified document requirements, verify paperwork consistency, and discover authorized Seva Kendras across India.
          </p>

          {/* Search Bar Input */}
          <div className="pt-1">
            <div className="relative flex items-center max-w-xl">
              <Search className="absolute left-4 w-5 h-5 text-slate-400" />
              <input
                id="hero-service-search"
                type="text"
                value={localQuery}
                onChange={handleInputChange}
                placeholder="Search services (e.g., Aadhaar update, Fresh Passport, PAN card)..."
                className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-2xl bg-white dark:bg-zinc-900 border-2 border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 shadow-md focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition"
              />
              {localQuery && (
                <button
                  onClick={() => {
                    setLocalQuery('');
                    onSearchChange('');
                  }}
                  className="absolute right-4 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Popular Shortcut Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-3 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Quick Suggestions:</span>
              {popularShortcuts.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleShortcutClick(chip)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 dark:bg-zinc-800/80 dark:hover:bg-blue-950/60 text-slate-700 hover:text-blue-700 dark:text-slate-300 dark:hover:text-blue-300 border border-slate-200 dark:border-zinc-700 transition font-medium"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="#services"
              className="bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold px-6 py-3.5 rounded-xl transition flex items-center gap-2 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <span>Explore All Services</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#how-it-works"
              className="bg-white/90 dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-slate-200 font-semibold px-6 py-3.5 rounded-xl transition border border-slate-300 dark:border-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 shadow-2xs"
            >
              How CivicSaathi Works
            </a>
          </div>

          {/* Trust Value Badges Grid */}
          <div className="pt-6 border-t border-slate-100 dark:border-zinc-900 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span>100% Free & No Broker Fees</span>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
                <FileCheck className="w-4 h-4" />
              </div>
              <span>Verified Statutory Rules</span>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <span>Zero Personal Data Tracking</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
