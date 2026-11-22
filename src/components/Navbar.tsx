import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrandLogo } from './BrandLogo';
import { Sun, Moon, Menu, X, ShieldCheck, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onSearchFocus?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearchFocus }) => {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('civicsaathi_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('civicsaathi_theme', 'light');
    }
  };

  const navLinks = [
    { name: 'Services Explorer', path: '/#services', isRoute: false },
    { name: 'Readiness Checker', path: '/#readiness-checker', isRoute: false },
    { name: 'Report an Issue', path: '/report-issue', isRoute: true, isNew: true },
    { name: 'My Reports', path: '/my-reports', isRoute: true },
    { name: 'How It Works', path: '/how-it-works', isRoute: true },
    { name: 'Civic Alerts', path: '/civic-alerts', isRoute: true },
    { name: 'Find Centers', path: '/find-centers', isRoute: true },
    { name: 'FAQ', path: '/#faq', isRoute: false },
  ];

  const isLinkActive = (link: typeof navLinks[0]) => {
    if (link.isRoute) {
      return location.pathname === link.path;
    }
    if (location.pathname === '/') {
      const id = link.path.replace('/#', '');
      return location.hash === `#${id}`;
    }
    return false;
  };

  const handleLinkClick = (link: typeof navLinks[0]) => {
    setMobileMenuOpen(false);
    if (!link.isRoute && location.pathname === '/') {
      const id = link.path.replace('/#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    if (link.path === '/#services' && location.pathname === '/' && onSearchFocus) {
      onSearchFocus();
    }
  };

  const handleActionClick = () => {
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      const el = document.getElementById('services');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      if (onSearchFocus) {
        onSearchFocus();
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-slate-200/80 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Logo & Tricolor Accent Tag */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/"
              className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-xl cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            >
              <BrandLogo size="md" showSubtitle />
            </Link>
            <span className="hidden 2xl:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/40 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Public Citizen Utility</span>
            </span>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center gap-1.5 2xl:gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            {navLinks.map((link) => {
              const active = isLinkActive(link);

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => handleLinkClick(link)}
                  className={`px-2.5 py-1.5 rounded-xl transition-all duration-150 focus:outline-none focus-visible:underline flex items-center gap-1.5 text-xs 2xl:text-sm whitespace-nowrap ${
                    active
                      ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-bold border border-blue-200/80 dark:border-blue-900/60 shadow-2xs'
                      : 'hover:text-blue-700 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-zinc-800/60 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.isNew && (
                    <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-800 animate-pulse">
                      New
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition border border-slate-200 dark:border-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Quick Action CTA: Find Requirements */}
            <Link
              to="/#services"
              onClick={handleActionClick}
              className="inline-flex items-center gap-2 px-3.5 2xl:px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer whitespace-nowrap"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Find Requirements</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu & Theme Buttons */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 sm:hidden rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-200 dark:border-zinc-800 transition cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 transition cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden py-4 border-t border-slate-200 dark:border-zinc-800 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
            {navLinks.map((link) => {
              const active = isLinkActive(link);

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => handleLinkClick(link)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition ${
                    active
                      ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-bold border-l-4 border-blue-600'
                      : 'font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.isNew && (
                    <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
                      New
                    </span>
                  )}
                </Link>
              );
            })}
            <div className="pt-2">
              <Link
                to="/#services"
                onClick={handleActionClick}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Find Service Requirements</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
