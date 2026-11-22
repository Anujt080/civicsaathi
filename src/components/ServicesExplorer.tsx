import React, { useState, useMemo } from 'react';
import { CivicService } from '../types';
import { CIVIC_SERVICES, SERVICE_CATEGORIES } from '../data/servicesData';
import { ServiceCard } from './ServiceCard';
import { ServiceCategoryFilter } from './ServiceCategoryFilter';
import { Search, Compass, X, RotateCcw, Sparkles } from 'lucide-react';

interface ServicesExplorerProps {
  onSelectService: (service: CivicService) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const ServicesExplorer: React.FC<ServicesExplorerProps> = ({
  onSelectService,
  searchQuery,
  onSearchChange,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: CIVIC_SERVICES.length,
    };
    for (const cat of SERVICE_CATEGORIES) {
      counts[cat] = CIVIC_SERVICES.filter((s) => s.category === cat).length;
    }
    return counts;
  }, []);

  // Filtered services based on search query and selected category
  const filteredServices = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return CIVIC_SERVICES.filter((service) => {
      const matchesCategory =
        selectedCategory === 'All' || service.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!q) return true;

      const matchesName = service.name.toLowerCase().includes(q);
      const matchesHindi = service.hindiName ? service.hindiName.toLowerCase().includes(q) : false;
      const matchesSummary = service.summary.toLowerCase().includes(q);
      const matchesDescription = service.description ? service.description.toLowerCase().includes(q) : false;
      const matchesDepartment = service.department.toLowerCase().includes(q);
      const matchesCategoryName = service.category.toLowerCase().includes(q);
      const matchesTags = service.tags ? service.tags.some((t) => t.toLowerCase().includes(q)) : false;
      const matchesDocs = service.documents.some(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.acceptedExamples.some((ex) => ex.toLowerCase().includes(q))
      );

      return (
        matchesName ||
        matchesHindi ||
        matchesSummary ||
        matchesDescription ||
        matchesDepartment ||
        matchesCategoryName ||
        matchesTags ||
        matchesDocs
      );
    });
  }, [selectedCategory, searchQuery]);

  const suggestedQueries = [
    'Aadhaar',
    'Passport',
    'Scholarship',
    'Ayushman Health',
    'PM Kisan',
    'Driving Licence',
    'PMAY House',
    'Solar Roof',
  ];

  return (
    <section id="services" className="space-y-6 pt-6 scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 px-2.5 py-1 rounded-md border border-blue-200/60 dark:border-blue-900/40">
            <Compass className="w-3.5 h-3.5" />
            <span>Civic Services Explorer</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Explore Public Services & Statutory Checklists
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Search verified Central and State government services, compare statutory fees, inspect required documentation, and review step-by-step submission workflows.
          </p>
        </div>

        {/* Dynamic Counter Pill */}
        <div className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-zinc-800/80 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 self-start md:self-auto shrink-0 shadow-2xs">
          Showing <strong className="text-blue-700 dark:text-blue-400 font-bold">{filteredServices.length}</strong> of {CIVIC_SERVICES.length} Services
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="bg-white dark:bg-zinc-950 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-2xs space-y-4">
        {/* Prominent Search Bar */}
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by service name, department, proof type, or keyword (e.g., Aadhaar, Ayushman, Driving Licence)..."
            className="w-full pl-11 pr-10 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-zinc-800 transition"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Pills Component */}
        <ServiceCategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          categoryCounts={categoryCounts}
        />

        {/* Active Filters Bar (when filter is applied) */}
        {(searchQuery || selectedCategory !== 'All') && (
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-blue-50/70 dark:bg-blue-950/40 p-2.5 rounded-xl border border-blue-200 dark:border-blue-900/60 text-blue-900 dark:text-blue-200">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-medium text-slate-600 dark:text-slate-400">Active filters:</span>
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/80 font-semibold text-blue-800 dark:text-blue-200">
                  <span>Category: {selectedCategory}</span>
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className="hover:text-blue-950 dark:hover:text-white"
                  >
                    ×
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/80 font-semibold text-blue-800 dark:text-blue-200">
                  <span>Query: "{searchQuery}"</span>
                  <button
                    onClick={() => onSearchChange('')}
                    className="hover:text-blue-950 dark:hover:text-white"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>

            <button
              onClick={() => {
                onSearchChange('');
                setSelectedCategory('All');
              }}
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 dark:text-blue-400 hover:underline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Services Grid or Clean Empty State */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onSelect={onSelectService}
            />
          ))}
        </div>
      ) : (
        /* Clean Empty State */
        <div className="text-center py-12 px-4 rounded-3xl border border-dashed border-slate-300 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/60 space-y-4 max-w-2xl mx-auto shadow-2xs">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto border border-blue-200/60 dark:border-blue-900/60">
            <Search className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base sm:text-lg text-slate-800 dark:text-white">
              No matching public services found
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              We couldn't find any services matching <strong className="text-slate-700 dark:text-slate-300 font-semibold">{searchQuery ? `"${searchQuery}"` : selectedCategory}</strong>. Try refining your search query or explore one of the suggested categories below.
            </p>
          </div>

          {/* Quick suggestion queries */}
          <div className="pt-1">
            <span className="text-[11px] font-semibold text-slate-400 block mb-2">Try searching for:</span>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {suggestedQueries.map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setSelectedCategory('All');
                    onSearchChange(term);
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-blue-50 dark:bg-zinc-800 dark:hover:bg-blue-950/60 text-slate-700 hover:text-blue-700 dark:text-slate-300 dark:hover:text-blue-300 border border-slate-200 dark:border-zinc-700 transition"
                >
                  <Sparkles className="w-3 h-3 inline mr-1 text-amber-500" />
                  {term}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                onSearchChange('');
                setSelectedCategory('All');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Filters & Show All Services</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
