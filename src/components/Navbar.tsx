import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Globe,
  LogIn,
  Clock,
  User,
  Menu,
  X,
  Bot,
  MapPin,
  FileText,
  Sun,
  Moon,
  Monitor,
  SlidersHorizontal,
  ChevronDown,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/LanguageContext';
import { BrandLogo } from './BrandLogo';
import { ProfileDropdown } from './ProfileDropdown';

interface NavbarProps {
  onOpenAssistant: () => void;
}

type ActivePanel = 'none' | 'language';

export const Navbar: React.FC<NavbarProps> = ({ onOpenAssistant }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<ActivePanel>('none');

  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const { t, language, setLanguage, languages, currentLanguage } = useTranslation();
  const panelRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  // Close dropdowns on outside click or ESC
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setActivePanel('none');
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActivePanel('none');
    };

    if (activePanel !== 'none') {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activePanel]);

  const togglePanel = (panel: ActivePanel) => {
    setActivePanel((curr) => (curr === panel ? 'none' : panel));
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <header className="bg-white dark:bg-black border-b border-slate-200 dark:border-zinc-900 sticky top-0 z-40 shadow-xs border-t-2 border-t-blue-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center gap-4">
          {/* Left: CivicSaathi Logo */}
          <Link
            to="/"
            className="flex items-center shrink-0 hover:opacity-90 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-1"
            aria-label="CivicSaathi Home"
          >
            <BrandLogo size="md" lightText={false} />
          </Link>

          {/* Desktop Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700 dark:text-slate-200">
            <Link
              to="/services"
              className={`px-3 py-1.5 rounded-lg transition ${
                isActive('/services')
                  ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-semibold'
                  : 'hover:text-blue-700 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {t('nav.services')}
            </Link>
            <Link
              to="/offices"
              className={`px-3 py-1.5 rounded-lg transition ${
                isActive('/offices')
                  ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-semibold'
                  : 'hover:text-blue-700 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {t('nav.offices')}
            </Link>
            {user ? (
              <Link
                to="/profile"
                className={`px-3 py-1.5 rounded-lg transition ${
                  isActive('/profile')
                    ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-semibold'
                    : 'hover:text-blue-700 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {t('nav.myApplications')}
              </Link>
            ) : (
              <a
                href="/#how-it-works"
                className="px-3 py-1.5 rounded-lg transition hover:text-blue-700 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {t('nav.howItWorks')}
              </a>
            )}
          </nav>

          {/* Right Controls: Theme Toggle, Language, Login */}
          <div className="flex items-center gap-1.5 sm:gap-2 relative" ref={panelRef}>
            {/* Theme Toggle Button (Light / Dark / System) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border text-slate-700 dark:text-slate-200 bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 shadow-2xs"
              title={`Switch theme (Currently ${resolvedTheme === 'dark' ? 'Dark' : 'Light'})`}
              aria-label={`Toggle theme (Current: ${resolvedTheme === 'dark' ? 'Dark mode' : 'Light mode'})`}
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Language Selector Trigger Button displaying current language in native script */}
            <button
              onClick={() => togglePanel('language')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 shadow-2xs ${
                activePanel === 'language'
                  ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-500 text-blue-700 dark:text-blue-400'
                  : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
              }`}
              title="Select Language / भाषा चुनें / زبان منتخب کریں / భాష / ભાષા"
              aria-label={`Select Language (Current: ${currentLanguage.nativeName})`}
              aria-expanded={activePanel === 'language'}
            >
              <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="font-bold">{currentLanguage.nativeName}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${activePanel === 'language' ? 'rotate-180' : ''}`} />
            </button>

            {/* Login / Profile Dropdown */}
            {user ? (
              <ProfileDropdown />
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                aria-label="Login to CivicSaathi"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t('nav.login')}</span>
              </Link>
            )}

            {/* Mobile menu toggle button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label={mobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* 3. LANGUAGE SELECTOR DROPDOWN PANEL (5 Languages) */}
            {activePanel === 'language' && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-88 max-w-[calc(100vw-1.5rem)] max-h-[85vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 sm:p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                    <span>{t('nav.selectLanguage')}</span>
                  </h3>
                  <button
                    onClick={() => setActivePanel('none')}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md"
                    aria-label="Close Language Selector"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="py-3 space-y-2 text-xs">
                  {languages.map((lang) => {
                    const isSelected = language === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setLanguage(lang.code);
                          setActivePanel('none');
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border text-start cursor-pointer transition ${
                          isSelected
                            ? 'bg-blue-50/80 dark:bg-blue-950/70 border-blue-500 text-blue-900 dark:text-blue-200 shadow-2xs font-medium'
                            : 'bg-slate-50/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-blue-700 bg-blue-700 text-white' : 'border-slate-400'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <div>
                            <span className="font-bold text-sm block leading-tight text-slate-900 dark:text-white">
                              {lang.nativeName}
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                              {lang.name} • {lang.script}
                            </span>
                          </div>
                        </div>
                        {isSelected && (
                          <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                            {t('nav.languageActive')}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {t('nav.languageNotice')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-black border-b border-slate-200 dark:border-zinc-900 px-4 pt-3 pb-6 space-y-3 shadow-sm">
          {/* Mobile Language Selector */}
          <div className="p-3 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>{t('nav.selectLanguage')}</span>
              </span>
              <span className="text-[11px] text-blue-700 dark:text-blue-400 font-bold">{currentLanguage.nativeName}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {languages.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold text-start border transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-700 text-white border-blue-700'
                        : 'bg-white dark:bg-zinc-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-700'
                    }`}
                  >
                    <span>{lang.nativeName}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile Theme Toggle */}
          <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-800 text-xs font-semibold">
            <span className="text-slate-700 dark:text-slate-300">{t('nav.theme')}</span>
            <div className="flex gap-1">
              <button
                onClick={() => setTheme('light')}
                className={`p-1.5 rounded ${theme === 'light' ? 'bg-blue-700 text-white' : 'text-slate-600 dark:text-slate-400'}`}
                title={t('nav.themeLight')}
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-1.5 rounded ${theme === 'dark' ? 'bg-blue-700 text-white' : 'text-slate-600 dark:text-slate-400'}`}
                title={t('nav.themeDark')}
              >
                <Moon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`p-1.5 rounded ${theme === 'system' ? 'bg-blue-700 text-white' : 'text-slate-600 dark:text-slate-400'}`}
                title={t('nav.themeSystem')}
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>
          </div>

          <Link
            to="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium"
          >
            <FileText className="w-4 h-4 text-blue-700 dark:text-blue-400" />
            <span>{t('nav.govServices')}</span>
          </Link>
          <Link
            to="/offices"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium"
          >
            <MapPin className="w-4 h-4 text-blue-700 dark:text-blue-400" />
            <span>{t('nav.offices')}</span>
          </Link>

          {user ? (
            <>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium"
              >
                <User className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                <span>{t('nav.profile')}</span>
              </Link>
              <Link
                to="/profile#documents"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium"
              >
                <FileText className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                <span>{t('nav.documents')}</span>
              </Link>
              <Link
                to="/applications"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium"
              >
                <Clock className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                <span>{t('nav.myApplications')}</span>
              </Link>
              <Link
                to="/profile#settings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium"
              >
                <SlidersHorizontal className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                <span>{t('nav.settings')}</span>
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAssistant();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 text-sm font-semibold"
              >
                <Bot className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                <span>{t('nav.askAi')}</span>
              </button>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center px-3">
                <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</span>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
                >
                  {t('nav.logout')}
                </button>
              </div>
            </>
          ) : (
            <>
              <a
                href="/#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium"
              >
                <span>{t('nav.howItWorks')}</span>
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAssistant();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium"
              >
                <Bot className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                <span>{t('nav.askAi')}</span>
              </button>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  {t('nav.getStarted')}
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
};