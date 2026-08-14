import React, { createContext, useContext, useEffect, useState } from 'react';

type Lang = 'en' | 'dk';

type TranslationInput = { en: string; dk?: string };

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (s: TranslationInput) => string;
}

const STORAGE_KEY = 'lang';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    try {
      const segs = window.location.pathname.split('/').filter(Boolean);
      const last = segs[segs.length - 1];
      if (last === 'dk') {
        setLangState('dk');
        return;
      }
      const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (stored === 'dk' || stored === 'en') setLangState(stored);
    } catch (e) {
      // ignore (SSR or unavailable)
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {}
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      const pathname = window.location.pathname.replace(/\/$/, '');
      const segs = pathname.split('/').filter(Boolean);
      const last = segs[segs.length - 1];

      if (l === 'dk' && last !== 'dk') {
        const base = pathname === '' ? '' : pathname;
        const newPath = `${base}/dk${window.location.search}${window.location.hash}`;
        window.history.replaceState({}, '', newPath);
      } else if (l === 'en' && last === 'dk') {
        segs.pop();
        const base = '/' + segs.join('/');
        const newPath = (base === '/' ? '/' : base) + window.location.search + window.location.hash;
        window.history.replaceState({}, '', newPath);
      }
    } catch {}
  };

  const toggle = () => setLang(lang === 'en' ? 'dk' : 'en');

  const t = ({ en, dk }: TranslationInput) => (lang === 'dk' && dk ? dk : en);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
