import { useState } from 'react'
import './App.css'
import Clock from './Clock'
import AboutPage from './AboutPage'
import ProjectsPage from './ProjectsPage'
import OtherPage from './OtherPage'

function App() {
  const [activePage, setActivePage] = useState<'about' | 'projects' | 'other'>('about')

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
            ABOUT ME
          </button>
          <button
            type="button"
            className={`tab ${activePage === 'projects' ? 'active' : ''}`}
            onClick={() => setActivePage('projects')}
          >
            PROJECTS
          </button>
          <button
            type="button"
            className={`tab ${activePage === 'other' ? 'active' : ''}`}
            onClick={() => setActivePage('other')}
          >
            OTHER
          </button>
        </nav>
      </header>
      <div className="app-shell">
        <div key={activePage} className="page-panel slide-in-right">
          {activePage === 'about' ? (
            <AboutPage />
          ) : activePage === 'projects' ? (
            <ProjectsPage />
          ) : (
            <OtherPage />
          )}
        </div>
      </div>
    </>
  )
}

export default App
