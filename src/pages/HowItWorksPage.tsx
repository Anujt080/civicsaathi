import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileSearch,
  CheckCircle2,
  Building2,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Clock,
  Sparkles,
  ChevronRight,
  FileText,
  BadgeAlert,
  ArrowLeft,
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      number: '01',
      icon: FileSearch,
      phase: 'Phase 1: Upfront Discovery',
      title: 'Know Requirements Upfront',
      subtitle: 'Clear, Gazette-Backed Document Lists',
      description:
        'Search through 24+ Indian public services to inspect exact statutory document requirements. CivicSaathi breaks proofs into four standardized categories (POI, POA, DOB, and POR), highlighting which documents are mandatory and which are situational alternatives.',
      details: [
        'Understand statutory fee schedules and average processing turnaround times.',
        'View accepted primary and secondary proof combinations approved by UIDAI, MEA, and State Governments.',
        'Determine whether an application can be completed 100% online or requires counter biometric enrollment.',
      ],
      color: 'blue',
    },
    {
      number: '02',
      icon: CheckCircle2,
      phase: 'Phase 2: Pre-Counter Scrutiny',
      title: 'Pre-Submission Self-Check',
      subtitle: 'Eliminate Name, Initial & Date Discrepancies',
      description:
        'Before heading to an Aadhaar Seva Kendra, PSK, or RTO, use our client-side Discrepancy Verifier. Enter your details as they appear on your application and physical identity cards to catch subtle mismatches before a counter official does.',
      details: [
        'Token-level name consistency analysis: detects exact matches, word order permutations, and abbreviated initials (e.g. "R. Sharma").',
        'Automatic utility bill currency check: ensures electricity and water bills fall strictly within the mandatory 3-month statutory window.',
        'Age eligibility & statutory verification tailored to the specific service requirements.',
      ],
      color: 'emerald',
    },
    {
      number: '03',
      icon: Building2,
      phase: 'Phase 3: Confident Submission',
      title: 'Submit First-Time-Right',
      subtitle: 'Direct Portal Links & Seva Kendra Navigation',
      description:
        'Armed with your verified documents and 1-page Civic Readiness Slip, proceed with certainty. Connect directly to official ministry portals or navigate to the nearest authorized facilitation center with operating hours and helpline guidance.',
      details: [
        'Print or export your personalized Civic Readiness Slip to keep proofs organized.',
        'Find authorized Lok Seva Kendras, Passport Seva Kendras, and ASK centers in your district.',
        'Avoid repeat visits, unexpected counter rejections, and unnecessary leave days.',
      ],
      color: 'amber',
    },
  ];

  const commonPitfalls = [
    {
      icon: BadgeAlert,
      title: 'Name Spelling & Initial Mismatches',
      stat: '68% of counter rejections',
      description:
        'Having initials on your PAN card (e.g. "A. K. Verma") but full names on Aadhaar ("Anand Kumar Verma") causes instant counter verification blocks unless supported by secondary gazetted proof.',
    },
    {
      icon: Clock,
      title: 'Outdated Utility Bills (>3 Months)',
      stat: '21% of address proof rejections',
      description:
        'Electricity, piped gas, and water bills must not be older than 3 months on the date of submission. Citizens frequently carry 4-to-6 month old bills and face rejection.',
    },
    {
      icon: FileText,
      title: 'Invalid Date of Birth Proofs',
      stat: '11% of statutory rejections',
      description:
        'Affidavits or notary certificates are not accepted as primary DOB proofs for passport or fresh Aadhaar applications—only municipal birth certificates or Class 10 school boards are valid.',
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 animate-in fade-in duration-200">
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
          <span className="text-slate-800 dark:text-slate-200">How It Works</span>
        </div>

        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-900/60 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The CivicSaathi Framework</span>
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            How CivicSaathi Simplifies Public Services
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Every day, thousands of Indian citizens face counter rejection at government facilitation
            centers due to minor documentation oversights. CivicSaathi is engineered as a prevention-first
            guidance platform that eliminates counter friction before you leave home.
          </p>
        </div>
      </div>

      {/* 3-Step Guided Journey */}
      <section className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="rounded-3xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition"
              >
                <div className="space-y-5">
                  {/* Step Header */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                        step.color === 'blue'
                          ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-400'
                          : step.color === 'emerald'
                          ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400'
                          : 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400'
                      }`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-3xl font-black text-slate-200 dark:text-zinc-800 tracking-tighter">
                      {step.number}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 block">
                      {step.phase}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {step.title}
                    </h2>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {step.subtitle}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Bullet points */}
                  <div className="pt-2 border-t border-slate-100 dark:border-zinc-900 space-y-2">
                    {step.details.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0 mt-1.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-zinc-900 flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400">Step {idx + 1} of 3</span>
                  <span className="text-blue-700 dark:text-blue-400 flex items-center gap-1">
                    <span>Verified Procedure</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Rejections Happen Section */}
      <section className="space-y-6 rounded-3xl bg-slate-100/70 dark:bg-zinc-900/60 p-6 sm:p-8 border border-slate-200 dark:border-zinc-800">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/70 px-2.5 py-1 rounded-md">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Pre-Counter Scrutiny Insights</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Top 3 Counter Rejection Triggers
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Based on standard facilitation counter guidelines across ASK, PSK, and RTO counters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {commonPitfalls.map((pitfall, i) => {
            const Icon = pitfall.icon;
            return (
              <div
                key={i}
                className="bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-3 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950 px-2 py-0.5 rounded-full border border-red-200 dark:border-red-900">
                    {pitfall.stat}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {pitfall.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {pitfall.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Quick Action CTAs */}
      <section className="rounded-3xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white p-8 sm:p-10 shadow-lg space-y-6">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-200 bg-blue-600/40 px-3 py-1 rounded-full border border-blue-400/30 inline-block">
            Put It Into Practice
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to Verify Your Documents?
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Run your documents through our instant, client-side discrepancy verifier. No data leaves
            your device, and you receive an instant Counter Readiness Scorecard.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Link
            to="/#readiness-checker"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-blue-800 text-xs sm:text-sm font-bold shadow-sm hover:bg-blue-50 transition"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Run Readiness Checker</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/find-centers"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-800/60 hover:bg-blue-800 text-white text-xs sm:text-sm font-semibold border border-blue-400/30 transition"
          >
            <Building2 className="w-4 h-4 text-blue-300" />
            <span>Locate Nearby Kendras</span>
          </Link>

          <Link
            to="/civic-alerts"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-800/60 hover:bg-blue-800 text-white text-xs sm:text-sm font-semibold border border-blue-400/30 transition"
          >
            <HelpCircle className="w-4 h-4 text-amber-300" />
            <span>View Latest Advisories</span>
          </Link>
        </div>
      </section>
    </div>
  );
};
