import React, { useState } from 'react';
import Navigation from './components/Navigation';
import CareerMemoryBanner from './components/CareerMemoryBanner';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import JobMatcher from './components/JobMatcher';
import MockInterview from './components/MockInterview';
import ApiKeyModal from './components/ApiKeyModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('resume-analyzer');
  const [resumeText, setResumeText] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* Top Header & Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="main-content container">
        {/* Smart Career Memory Drawer */}
        <CareerMemoryBanner />

        {activeTab === 'resume-analyzer' && (
          <ResumeAnalyzer
            resumeText={resumeText}
            setResumeText={setResumeText}
            analysisResult={analysisResult}
            setAnalysisResult={setAnalysisResult}
          />
        )}

        {activeTab === 'job-matcher' && (
          <JobMatcher resumeText={resumeText} />
        )}

        {activeTab === 'mock-interview' && (
          <MockInterview />
        )}
      </main>

      {/* Minimalist Footer */}
      <footer className="footer">
        <div className="container footer-content">
          <p>© 2026 GRAYMARK AI — Full-Stack AI Portfolio Showcase</p>
          <div className="footer-links">
            <button onClick={() => setIsApiKeyModalOpen(true)} className="footer-link">
              Configure Gemini API Key
            </button>
          </div>
        </div>
      </footer>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />

      <style>{`
        .app-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .footer {
          background: var(--bg-card);
          border-top: 1px solid var(--border-color);
          padding: 1.25rem 0;
          margin-top: auto;
        }

        .footer-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.8125rem;
          color: var(--text-muted);
        }

        .footer-links {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .footer-link {
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 0.8125rem;
          cursor: pointer;
          font-family: inherit;
        }

        .footer-link:hover {
          color: var(--text-primary);
          text-decoration: underline;
        }

        @media (max-width: 640px) {
          .footer-content {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
