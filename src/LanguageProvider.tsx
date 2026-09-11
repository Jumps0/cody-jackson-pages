import React, { useEffect, useState } from 'react';
import { LanguageContext, type Lang, type TranslationInput } from './LanguageContext';

const STORAGE_KEY = 'lang';

function getInitialLang(): Lang {
  try {
    const segs = window.location.pathname.split('/').filter(Boolean);
    if (segs[segs.length - 1] === 'dk') return 'dk';

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dk' || stored === 'en') return stored;
  } catch {
    // Ignore unavailable browser APIs.
  }

  return 'en';
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore unavailable browser APIs.
    }
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
    } catch {
      // Ignore unavailable browser APIs.
    }
  };

  const toggle = () => setLang(lang === 'en' ? 'dk' : 'en');

  const t = ({ en, dk }: TranslationInput) => (lang === 'dk' && dk ? dk : en);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

