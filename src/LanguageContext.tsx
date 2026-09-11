import { createContext, useContext } from 'react';

export type Lang = 'en' | 'dk';

export type TranslationInput = { en: string; dk?: string };

export interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (s: TranslationInput) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
