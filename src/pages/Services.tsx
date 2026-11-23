import React, { useState, useMemo, useEffect, useRef } from 'react';
import { SERVICES_DATA } from '../data/services';
import { ServiceCard } from '../components/ServiceCard';
import { Search, X, SlidersHorizontal, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { Service } from '../types';

const INITIAL_VISIBLE_COUNT = 6;

const APPLICATION_TYPES = [
  'All',
  'New Applications',
  'Updation / Corrections',
] as const;

const DOMAIN_CATEGORIES = [
  'Identity',
  'Certificates',
  'Pensions',
  'Transport',
  'Travel & Immigration',
  'Taxation',
] as const;

const ALL_CATEGORIES = [...APPLICATION_TYPES, ...DOMAIN_CATEGORIES] as const;

const NEW_APPLICATION_IDS = new Set([
  'aadhaar-enrolment',
  'passport-application',
  'cg-domicile-certificate',
  'cg-caste-scst',
  'cg-caste-obc',
  'cg-pension-ignoaps',
  'cg-pension-ignwps',
  'cg-pension-igndps',
  'dl-learners',
  'dl-permanent',
]);

const UPDATION_CORRECTION_IDS = new Set([
  'aadhaar-update',
  'dl-renewal',
  'dl-duplicate',
  'pan-correction',
]);

const matchServiceCategory = (service: Service, category: string): boolean => {
  if (category === 'All') return true;
  if (category === 'New Applications') return NEW_APPLICATION_IDS.has(service.id);
  if (category === 'Updation / Corrections') return UPDATION_CORRECTION_IDS.has(service.id);
  return service.category === category;
};

export const Services: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterContainerRef = useRef<HTMLDivElement>(null);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterContainerRef.current &&
        !filterContainerRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Reset pagination/expansion state whenever search term or category changes
  useEffect(() => {
    setIsExpanded(false);
  }, [searchTerm, selectedCategory]);

  // Filter services by search term and category together
  const filteredServices = useMemo(() => {
    return SERVICES_DATA.filter((service) => {
      const matchesCategory = matchServiceCategory(service, selectedCategory);
      if (!matchesCategory) return false;

      if (!searchTerm.trim()) return true;

      const query = searchTerm.toLowerCase();
      const inName = service.name.toLowerCase().includes(query);
      const inDesc = service.description.toLowerCase().includes(query);
      const inCategory = service.category.toLowerCase().includes(query);
      const inDocs = service.requiredDocuments.some(
        (doc) =>
          doc.name.toLowerCase().includes(query) ||
          doc.description.toLowerCase().includes(query) ||
          (doc.acceptedExamples &&
            doc.acceptedExamples.some((ex) => ex.toLowerCase().includes(query)))
      );

      return inName || inDesc || inCategory || inDocs;
    });
  }, [searchTerm, selectedCategory]);

  // Compute category counts for badges
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    ALL_CATEGORIES.forEach((cat) => {
      counts[cat] = SERVICES_DATA.filter((s) => matchServiceCategory(s, cat)).length;
    });
    return counts;
  }, []);

  // Sliced services to display (first 6 initially, or all when expanded)
  const visibleServices = useMemo(() => {
    if (isExpanded || filteredServices.length <= INITIAL_VISIBLE_COUNT) {
      return filteredServices;
    }
    return filteredServices.slice(0, INITIAL_VISIBLE_COUNT);
  }, [filteredServices, isExpanded]);

  return (
    <div className="space-y-8">
      {/* Page Title (Description removed as requested) */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Government Services Directory
        </h1>
      </div>

      {/* Guidance Note */}
      <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 flex items-start gap-3 text-xs text-blue-950 dark:text-blue-200">
        <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">Official Guidelines & Variable Requirements:</span>{' '}
          Services marked with <span className="font-semibold text-amber-700 dark:text-amber-400">Conditional</span> have document checklists that vary based on applicant age, community category, or existing proof availability. Always confirm live requirements on the linked official government portal.
        </div>
      </div>

      {/* Controls: Search Bar & Expandable Category Filters */}
      <div ref={filterContainerRef} className="relative space-y-3 max-w-2xl">
        {/* Prominent Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search services or document proofs (e.g. Aadhaar, Domicile, Pension, Driving Licence)..."
            value={searchTerm}
            onClick={() => setIsFilterOpen(true)}
            onFocus={() => setIsFilterOpen(true)}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-2xl pl-11 pr-20 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 shadow-xs transition"
          />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full transition"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsFilterOpen((prev) => !prev)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg transition hover:bg-slate-100 dark:hover:bg-zinc-800"
              aria-label={isFilterOpen ? 'Close category filters' : 'Open category filters'}
              title={isFilterOpen ? 'Collapse categories' : 'Expand categories'}
            >
              {isFilterOpen ? (
                <ChevronUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Selected Category Tag (when filter tray is closed and category is active) */}
        {!isFilterOpen && selectedCategory !== 'All' && (
          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-xs text-slate-500 dark:text-slate-400">Filtered by:</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/60 shadow-2xs">
              <span>{selectedCategory}</span>
              <button
                type="button"
                onClick={() => setSelectedCategory('All')}
                className="hover:text-blue-900 dark:hover:text-white p-0.5 cursor-pointer"
                aria-label="Clear category filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          </div>
        )}

        {/* Expandable Filter / Search Interface */}
        {isFilterOpen && (
          <div className="p-4 sm:p-5 bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Service Categories</span>
              </div>
              <div className="flex items-center gap-3">
                {selectedCategory !== 'All' && (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('All')}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Reset to All
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition cursor-pointer"
                  aria-label="Collapse categories"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Segregated Section 1: Application Type */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                Application Type
              </span>
              <div className="flex flex-wrap gap-2">
                {APPLICATION_TYPES.map((cat) => {
                  const count = categoryCounts[cat] || 0;
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer select-none ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <span>{cat}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          isSelected
                            ? 'bg-blue-700 text-blue-100'
                            : 'bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Segregated Section 2: Service Domains / Departments */}
            <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-zinc-800/80">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                Service Domain
              </span>
              <div className="flex flex-wrap gap-2">
                {DOMAIN_CATEGORIES.map((cat) => {
                  const count = categoryCounts[cat] || 0;
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer select-none ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <span>{cat}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          isSelected
                            ? 'bg-blue-700 text-blue-100'
                            : 'bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Services Count Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>
          Showing{' '}
          <strong className="text-slate-900 dark:text-white">
            {!isExpanded && filteredServices.length > INITIAL_VISIBLE_COUNT
              ? `${INITIAL_VISIBLE_COUNT} of ${filteredServices.length}`
              : filteredServices.length}
          </strong>{' '}
          services
          {filteredServices.length < SERVICES_DATA.length && (
            <span> ({SERVICES_DATA.length} total)</span>
          )}
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          {searchTerm && ` matching "${searchTerm}"`}
        </span>

        {(selectedCategory !== 'All' || searchTerm) && (
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setSearchTerm('');
            }}
            className="text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Services Grid or Empty State */}
      {filteredServices.length === 0 ? (
        <div className="bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-zinc-900 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              No matching government services found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Try adjusting your search terms or clearing the category filter.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setSearchTerm('');
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition cursor-pointer"
          >
            Show All Services
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          {/* Show More / Show Less Toggle Button */}
          {filteredServices.length > INITIAL_VISIBLE_COUNT && (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm shadow-xs transition hover:border-slate-300 dark:hover:border-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer"
                aria-expanded={isExpanded}
                aria-label={isExpanded ? 'Show less services' : 'Show more services'}
              >
                <span>{isExpanded ? 'Show Less' : 'Show More'}</span>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
