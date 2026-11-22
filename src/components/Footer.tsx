import React from 'react';
import { BrandLogo } from './BrandLogo';
import { AlertCircle, ExternalLink, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const governmentLinks = [
    { name: 'National Portal of India (india.gov.in)', url: 'https://www.india.gov.in' },
    { name: 'UIDAI Aadhaar Portal (uidai.gov.in)', url: 'https://uidai.gov.in' },
    { name: 'Passport Seva Online (passportindia.gov.in)', url: 'https://passportindia.gov.in' },
    { name: 'Parivahan Sewa - Driving Licences', url: 'https://parivahan.gov.in' },
    { name: 'Protean e-Gov PAN Services', url: 'https://www.onlineservices.nsdl.com' },
    { name: 'State e-District Portal (Chhattisgarh)', url: 'https://edistrict.cgstate.gov.in' },
  ];

  const nationalHelplines = [
    { title: 'Emergency Service', number: '112' },
    { title: 'Aadhaar Helpdesk', number: '1947' },
    { title: 'Passport Call Center', number: '1800-258-1800' },
    { title: 'National Cyber Crime', number: '1930' },
    { title: 'Senior Citizen Helpline', number: '14567' },
  ];

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 mt-16 pt-12 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <BrandLogo lightText size="lg" showSubtitle />
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              CivicSaathi is a citizen-first civic guidance platform built to bridge the gap between Indian citizens and public services. We simplify government procedures with clear document checklists, pre-submission consistency checking, and facilitation office discovery.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Independent Civic-Tech Initiative • Non-Commercial</span>
            </div>
          </div>

          {/* Column 2: Official Government Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Official Government Portals
            </h4>
            <ul className="space-y-2 text-xs">
              {governmentLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition flex items-center gap-1 group text-slate-400"
                  >
                    <span className="truncate">{link.name}</span>
                    <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-blue-400 shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Statutory Helplines */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              National Citizen Helplines
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {nationalHelplines.map((item) => (
                <li key={item.number} className="flex justify-between items-center py-0.5 border-b border-slate-900">
                  <span>{item.title}</span>
                  <strong className="text-emerald-400 font-mono font-bold">{item.number}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Highlighted Non-Governmental Disclaimer Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-sm text-xs text-slate-300">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Official Guidance Notice:</strong> CivicSaathi is an independent civic-tech guidance platform. It is not an official government agency and does not issue documents, approve applications, or collect government fees. Always confirm final statutory rules and pay statutory fees directly on official government portals or at authorized facilitation counters.
          </p>
        </div>

        {/* Bottom Legal Navigation & Copyright */}
        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="text-center sm:text-left">
            © {currentYear} CivicSaathi. Citizen Assistance Platform. Built for public good.
          </p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Designed for Indian Public Service Transparency</span>
            <span className="text-emerald-400 ml-1">🇮🇳</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
