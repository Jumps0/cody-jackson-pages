import React from 'react';
import { useLanguage } from './LanguageProvider';

export const LanguageToggle: React.FC = () => {
  const { lang, setLang } = useLanguage();

  return (
    <div className="language-switch" role="tablist" aria-label="Language switch">
      <button
        type="button"
        className={`lang-button ${lang === 'en' ? 'selected' : ''}`}
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
      >
        English
      </button>
      <span className="lang-sep">/</span>
      <button
        type="button"
        className={`lang-button ${lang === 'dk' ? 'selected' : ''}`}
        onClick={() => setLang('dk')}
        aria-pressed={lang === 'dk'}
      >
        Dansk
      </button>
    </div>
  );
};

export default LanguageToggle;
