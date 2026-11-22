import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEVA_KENDRAS } from '../data/kendrasData';
import { SevaKendra } from '../types';
import {
  MapPin,
  Clock,
  Phone,
  ExternalLink,
  Navigation,
  Search,
  Filter,
  Building2,
  CheckSquare,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';

export const FindCentersPage: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');

  const types = ['All', 'Aadhaar Seva Kendra', 'Passport Seva Kendra', 'Lok Seva Kendra', 'RTO Office'];
  const districts = ['All', 'Durg / Bhilai', 'Raipur', 'Durg'];

  const filteredKendras = SEVA_KENDRAS.filter((k: SevaKendra) => {
    const matchesSearch =
      searchKeyword.trim() === '' ||
      k.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      k.address.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      k.district.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      k.servicesAvailable.some((s) => s.toLowerCase().includes(searchKeyword.toLowerCase()));

    const matchesType = selectedType === 'All' || k.type === selectedType;
    const matchesDistrict = selectedDistrict === 'All' || k.district === selectedDistrict;

    return matchesSearch && matchesType && matchesDistrict;
  });

  return (
    <div className="space-y-10 sm:space-y-12 animate-in fade-in duration-200">
      {/* Breadcrumb & Navigation Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Link
            to="/"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-800 dark:text-slate-200">Find Centers</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900/60 inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Physical Facilitation Directory</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Authorized Seva Kendras & Office Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Locate official facilitation centers, operating schedules, supported services, and direct navigation routes across your district.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 px-3.5 py-2 rounded-2xl self-start md:self-auto shrink-0">
            <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <div className="text-left">
              <p className="text-[11px] font-bold text-blue-900 dark:text-blue-200">
                Official Counters Only
              </p>
              <p className="text-[10px] text-blue-700 dark:text-blue-300">
                Gazetted centers with statutory fee limits
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Search by center name, address, district, or service (e.g. Biometric Update, Tatkaal)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Center Type & District Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-zinc-900">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 shrink-0 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>Center Type:</span>
            </span>
            <div className="flex items-center gap-1.5">
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
                    selectedType === t
                      ? 'bg-blue-700 text-white shadow-2xs'
                      : 'bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 shrink-0">
              District:
            </span>
            <div className="flex items-center gap-1.5">
              {districts.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDistrict(d)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
                    selectedDistrict === d
                      ? 'bg-slate-800 dark:bg-zinc-200 text-white dark:text-zinc-900 shadow-2xs'
                      : 'bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Centers Cards Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <span>
            Showing <strong className="text-slate-900 dark:text-white">{filteredKendras.length}</strong> facilitation center
            {filteredKendras.length === 1 ? '' : 's'}
          </span>
          {(searchKeyword || selectedType !== 'All' || selectedDistrict !== 'All') && (
            <button
              onClick={() => {
                setSearchKeyword('');
                setSelectedType('All');
                setSelectedDistrict('All');
              }}
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredKendras.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-zinc-950 rounded-3xl border border-slate-200 dark:border-zinc-800 space-y-3 p-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-zinc-900 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No facilitation centers match your search
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Try adjusting your search criteria or resetting filters to see all available centers.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {filteredKendras.map((kendra: SevaKendra) => (
              <div
                key={kendra.id}
                className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4 hover:border-slate-300 dark:hover:border-zinc-700 transition flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900">
                        {kendra.type}
                      </span>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                        {kendra.name}
                      </h2>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-zinc-900 px-2.5 py-1 rounded-md shrink-0">
                      {kendra.district}
                    </span>
                  </div>

                  {/* Physical Address */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5 leading-relaxed">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{kendra.address}</span>
                  </p>

                  {/* Operational Timing & Helpline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100 dark:border-zinc-900 text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                      <span className="truncate">{kendra.timing}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="truncate">{kendra.phone}</span>
                    </div>
                  </div>

                  {/* Available Counters Chips */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-semibold text-slate-500">Available Counters:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {kendra.servicesAvailable.map((srv, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-50 dark:bg-zinc-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-zinc-800"
                        >
                          {srv}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Google Maps CTA */}
                <div className="pt-2">
                  <a
                    href={kendra.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-zinc-700 transition"
                  >
                    <Navigation className="w-3.5 h-3.5 text-blue-600" />
                    <span>Get Directions on Google Maps</span>
                    <ExternalLink className="w-3 h-3 text-slate-400 ml-0.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Preparation Checklist Before In-Person Visit */}
      <section className="rounded-3xl bg-slate-100/70 dark:bg-zinc-900/60 p-6 sm:p-8 border border-slate-200 dark:border-zinc-800 space-y-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Counter Readiness Checklist</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            What to Carry to Your Kendra Visit
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-1">
            <p className="text-xs font-bold text-slate-900 dark:text-white">1. Original Cards</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Counter officials only verify against original laminated/plastic cards or digilocker copies.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-1">
            <p className="text-xs font-bold text-slate-900 dark:text-white">2. Two Photocopy Sets</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Carry self-attested photocopies of all POI, POA, and DOB proofs.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-1">
            <p className="text-xs font-bold text-slate-900 dark:text-white">3. Active Mobile Phone</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Required for real-time SMS OTP authentication at the counter terminal.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-1">
            <p className="text-xs font-bold text-slate-900 dark:text-white">4. Token / Appointment Slip</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              For PSK and ASK, ensure you carry your pre-booked appointment receipt.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
