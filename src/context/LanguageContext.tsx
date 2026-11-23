import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  SupportedLanguage,
  SUPPORTED_LANGUAGES,
  LanguageOption,
  flattenedTranslations,
  servicesTranslations,
} from '../locales';
import { LocalizedServiceInfo } from '../locales/servicesTranslations';

const STORAGE_KEY = 'civicsaathi_language';

export interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  dir: 'ltr' | 'rtl';
  isRtl: boolean;
  languages: LanguageOption[];
  currentLanguage: LanguageOption;
  t: (key: string, params?: Record<string, string | number>, fallback?: string) => string;
  getServiceTranslation: (serviceId: string) => LocalizedServiceInfo | undefined;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Apply language and text-direction attributes directly to DOM
const applyLanguageToDOM = (lang: SupportedLanguage, dir: 'ltr' | 'rtl') => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  root.lang = lang;
  root.dir = dir;
  root.setAttribute('data-lang', lang);

  if (dir === 'rtl') {
    root.classList.add('rtl');
  } else {
    root.classList.remove('rtl');
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as SupportedLanguage;
      if (saved && (saved === 'en' || saved === 'hi' || saved === 'ur' || saved === 'te' || saved === 'gu')) {
        return saved;
      }
    } catch {
      // fallback
    }
    return 'en';
  });

  const currentLanguage = useMemo(() => {
    return SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];
  }, [language]);

  const dir = currentLanguage.dir;
  const isRtl = dir === 'rtl';

  const setLanguage = useCallback((newLang: SupportedLanguage) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // ignore
    }
    const targetOption = SUPPORTED_LANGUAGES.find((l) => l.code === newLang) || SUPPORTED_LANGUAGES[0];
    applyLanguageToDOM(newLang, targetOption.dir);
  }, []);

  // Sync to DOM on initial mount & whenever language changes
  useEffect(() => {
    applyLanguageToDOM(language, dir);
  }, [language, dir]);

  // Translation function: key format like 'nav.services' or 'hero.title'
  const t = useCallback(
    (key: string, params?: Record<string, string | number>, fallback?: string): string => {
      // 1. Look up in current language flattened dictionary
      let text = flattenedTranslations[language]?.[key];

      // 2. Fall back to English dictionary if not found in current language
      if (!text && language !== 'en') {
        text = flattenedTranslations.en?.[key];
      }

      // 3. Fall back to supplied fallback or key itself
      if (!text) {
        text = fallback !== undefined ? fallback : key;
      }

      // 4. Parameter interpolation: replace {paramName}
      if (params && text) {
        return Object.entries(params).reduce((acc, [paramKey, val]) => {
          return acc.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
        }, text);
      }

      return text;
    },
    [language]
  );

  // Helper to fetch localized service name & description
  const getServiceTranslation = useCallback(
    (serviceId: string): LocalizedServiceInfo | undefined => {
      if (language === 'en') return undefined;
      return servicesTranslations[language]?.[serviceId];
    },
    [language]
  );

  const contextValue = useMemo<LanguageContextType>(
    () => ({
      language,
      setLanguage,
      dir,
      isRtl,
      languages: SUPPORTED_LANGUAGES,
      currentLanguage,
      t,
      getServiceTranslation,
    }),
    [language, setLanguage, dir, isRtl, currentLanguage, t, getServiceTranslation]
  );

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};

export const useLanguage = useTranslation;
