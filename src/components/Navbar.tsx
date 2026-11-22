import React, { useState, useEffect } from 'react';
import { BrandLogo } from './BrandLogo';
import { Sun, Moon, Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onSearchFocus?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearchFocus }) => {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

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
    { name: 'Services', href: '#services' },
    { name: 'Readiness Checker', href: '#readiness-checker', isNew: true },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Civic Alerts', href: '#alerts' },
    { name: 'Find Centers', href: '#kendras' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-slate-200/80 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Tricolor Accent Tag */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-xl">
              <BrandLogo size="md" showSubtitle />
            </a>
            <span className="hidden lg:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/40 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Public Citizen Utility</span>
            </span>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700 dark:text-slate-200">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors focus:outline-none focus-visible:underline flex items-center gap-1.5"
              >
                <span>{link.name}</span>
                {link.isNew && (
                  <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    New
                  </span>
                )}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition border border-slate-200 dark:border-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Quick Action CTA */}
            <a
              href="#services"
              onClick={onSearchFocus}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Find Requirements</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Menu & Theme Buttons */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-200 dark:border-zinc-800 transition"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-zinc-800 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-800"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-2">
              <a
                href="#services"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onSearchFocus) onSearchFocus();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-700 text-white text-xs font-semibold shadow-xs"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Find Service Requirements</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
