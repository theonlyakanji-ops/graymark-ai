import React, { useState, useEffect } from 'react';
import { FileText, Target, MessageSquare, Sun, Moon } from 'lucide-react';
import Logo from './Logo';

export default function Navigation({ activeTab, setActiveTab }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('graymark_theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('graymark_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const tabs = [
    { id: 'resume-analyzer', label: 'ATS Resume Analyzer', icon: FileText },
    { id: 'job-matcher', label: 'Job Description Matcher', icon: Target },
    { id: 'mock-interview', label: 'AI Mock Interview', icon: MessageSquare }
  ];

  return (
    <header className="nav-header">
      <div className="container nav-container">
        {/* Brand Custom Logo */}
        <Logo size={36} />

        {/* Navigation Tabs */}
        <nav className="nav-tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-button ${isActive ? 'active' : ''}`}
                aria-label={`Switch to ${tab.label}`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Theme Switcher Toggle */}
        <div className="nav-actions">
          <button
            onClick={toggleTheme}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.35rem 0.6rem' }}
            title={`Switch to ${theme === 'light' ? 'Espresso Dark' : 'Cream Light'} Mode`}
            aria-label={`Switch to ${theme === 'light' ? 'Espresso Dark' : 'Cream Light'} Mode`}
          >
            {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
          </button>
        </div>
      </div>

      <style>{`
        .nav-header {
          background: var(--bg-card);
          border-bottom: 1px solid var(--border-color);
          position: sticky;
          top: 0;
          z-index: 40;
          transition: background-color var(--transition-normal), border-color var(--transition-normal);
        }

        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 66px;
          gap: 1.5rem;
        }

        .nav-tabs {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background: var(--bg-subtle);
          padding: 0.25rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
        }

        .tab-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.45rem 0.875rem;
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-secondary);
          background: transparent;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all var(--transition-fast);
          font-family: var(--font-heading);
        }

        .tab-button:hover {
          color: var(--text-primary);
        }

        .tab-button.active {
          background: var(--bg-card);
          color: var(--text-primary);
          box-shadow: var(--shadow-sm);
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.625rem;
        }

        @media (max-width: 900px) {
          .nav-container {
            height: auto;
            flex-direction: column;
            padding: 0.875rem 1rem;
            gap: 0.875rem;
          }
          .nav-tabs {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </header>
  );
}
