import { en, TranslationType } from './en';
import { hi } from './hi';
import { ur } from './ur';
import { te } from './te';
import { gu } from './gu';
import { servicesTranslations } from './servicesTranslations';

export type SupportedLanguage = 'en' | 'hi' | 'ur' | 'te' | 'gu';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
  script: string;
  shortLabel: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    dir: 'ltr',
    script: 'Latin',
    shortLabel: 'EN',
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    dir: 'ltr',
    script: 'Devanagari',
    shortLabel: 'हि',
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    dir: 'rtl',
    script: 'Arabic (Nastaliq)',
    shortLabel: 'اردو',
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    dir: 'ltr',
    script: 'Telugu',
    shortLabel: 'తె',
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    dir: 'ltr',
    script: 'Gujarati',
    shortLabel: 'ગુ',
  },
];

export const translations: Record<SupportedLanguage, TranslationType> = {
  en,
  hi,
  ur,
  te,
  gu,
};

// Flatten helper to support fast O(1) dotted key resolution
function flattenObject(obj: Record<string, any>, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, fullKey));
    } else if (typeof value === 'string') {
      result[fullKey] = value;
    }
  }
  return result;
}

export const flattenedTranslations: Record<SupportedLanguage, Record<string, string>> = {
  en: flattenObject(en),
  hi: flattenObject(hi),
  ur: flattenObject(ur),
  te: flattenObject(te),
  gu: flattenObject(gu),
};

export { servicesTranslations };
