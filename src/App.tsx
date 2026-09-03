import { useState } from 'react'
import './App.css'
import Clock from './Clock'
import AboutPage from './AboutPage'
import ProjectsPage from './ProjectsPage'
import DnDPage from './DnDPage'
import LanguageToggle from './LanguageToggle'
import { useLanguage } from './LanguageProvider';

function App() {
  const [activePage, setActivePage] = useState<'about' | 'projects' | 'other'>('about')
  const { t } = useLanguage();

  return (
    <>
      <header className="top-bar">
        <div className="top-left-clock">
          <Clock />
        </div>
        <nav className="top-bar-nav" aria-label="Main navigation">
          <button
            type="button"
            className={`tab ${activePage === 'about' ? 'active' : ''}`}
            onClick={() => setActivePage('about')}
          >
            {t({ en: 'ABOUT ME', dk: 'OM MIG' })}
          </button>
          <button
            type="button"
            className={`tab ${activePage === 'projects' ? 'active' : ''}`}
            onClick={() => setActivePage('projects')}
          >
            {t({ en: 'PROJECTS', dk: 'PROJEKTER' })}
          </button>
          <button
            type="button"
            className={`tab ${activePage === 'other' ? 'active' : ''}`}
            onClick={() => setActivePage('other')}
          >
            {t({ en: 'OTHER', dk: 'ANDRE' })}
          </button>
        </nav>
        <div className="top-right-lang">
          <LanguageToggle />
        </div>
      </header>
      <div className="app-shell">
        <div key={activePage} className="page-panel slide-in-right">
          {activePage === 'about' ? (
            <AboutPage />
          ) : activePage === 'projects' ? (
            <ProjectsPage />
          ) : (
            <DnDPage />
          )}
        </div>
      </div>
    </>
  )
}

export default App
