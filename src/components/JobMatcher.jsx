import React, { useState, useEffect } from 'react';
import { SAMPLE_JOB_DESCRIPTIONS } from '../data/sampleResumes';
import { matchJobDescription } from '../services/aiEngine';
import { updateCareerMemory, addInsightToMemory } from '../services/careerMemory';
import {
  Target, Check, AlertCircle, Sparkles, RefreshCw, Copy,
  CheckCheck, CheckCircle2, AlertTriangle, Lightbulb, ExternalLink
} from 'lucide-react';

export default function JobMatcher({ resumeText }) {
  const [jobDescription, setJobDescription] = useState('');
  const [selectedJdSample, setSelectedJdSample] = useState('fullstack-engineer');
  const [isLoading, setIsLoading] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (!jobDescription) {
      setJobDescription(SAMPLE_JOB_DESCRIPTIONS['fullstack-engineer']);
    }
  }, []);

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleMatch();
    }
  };

  const handleSelectSample = (key) => {
    setSelectedJdSample(key);
    setErrorMessage(null);
    if (SAMPLE_JOB_DESCRIPTIONS[key]) {
      setJobDescription(SAMPLE_JOB_DESCRIPTIONS[key]);
      setMatchResult(null);
    }
  };

  const handleMatch = async () => {
    if (!resumeText.trim()) {
      setErrorMessage('Please provide your resume content before matching against a job listing.');
      return;
    }
    if (!jobDescription.trim()) {
      setErrorMessage('Please paste or select a target job description.');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);
    try {
      const res = await matchJobDescription(resumeText, jobDescription);
      setMatchResult(res);

      if (res.missingKeywords && res.missingKeywords.length > 0) {
        updateCareerMemory({ topSkillGaps: res.missingKeywords.slice(0, 3) });
        addInsightToMemory(`Target missing keywords: ${res.missingKeywords.slice(0, 2).join(', ')}`);
      }
    } catch (e) {
      setErrorMessage(e.message || 'Failed to analyze job match.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="animate-fade-in" role="region" aria-label="Job Description Matcher">
      <div className="section-header" style={{ marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem' }}>Job Description Matcher</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Compare resume content vs target job postings. Press <strong>Ctrl+Enter</strong> to run.
          </p>
        </div>

        <div className="sample-selector">
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Preset JD:</span>
          <button
            onClick={() => handleSelectSample('fullstack-engineer')}
            className={`btn btn-sm ${selectedJdSample === 'fullstack-engineer' ? 'btn-primary' : 'btn-secondary'}`}
            aria-label="Select Full Stack Job Description"
          >
            Senior Full-Stack JD
          </button>
          <button
            onClick={() => handleSelectSample('data-scientist')}
            className={`btn btn-sm ${selectedJdSample === 'data-scientist' ? 'btn-primary' : 'btn-secondary'}`}
            aria-label="Select Data Scientist Job Description"
          >
            Senior Data Scientist JD
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="card" style={{ background: 'var(--bg-danger)', border: '1px solid var(--border-danger)', marginBottom: '1rem', padding: '0.875rem 1.25rem' }} role="alert">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-danger)' }}>
            <AlertCircle size={16} />
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{errorMessage}</span>
          </div>
        </div>
      )}

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Left Column: Job Description Input */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={18} />
              <h3 className="card-title">Target Job Listing</h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {jobDescription.trim().split(/\s+/).filter(Boolean).length} words
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="jd-textarea" className="label">
              <span>Job Description Requirements</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Shortcut: Ctrl+Enter</span>
            </label>
            <textarea
              id="jd-textarea"
              className="textarea"
              placeholder="Paste job posting / requirements here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={15}
            />
          </div>

          <button
            onClick={handleMatch}
            disabled={isLoading || !resumeText.trim() || !jobDescription.trim()}
            className="btn btn-primary"
            style={{ width: '100%' }}
            aria-label="Calculate Role Match"
          >
            {isLoading ? (
              <>
                <RefreshCw size={16} className="pulse" />
                Matching Keywords & Requirements...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Calculate Role Match & Keyword Gaps
              </>
            )}
          </button>
        </div>

        {/* Right Column: 5-Part Match Results */}
        <div>
          {!matchResult && !isLoading && (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'var(--bg-subtle)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem',
                color: 'var(--text-muted)'
              }}>
                <Target size={24} />
              </div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Ready for Match Analysis</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: 320, margin: '0 auto 1.25rem' }}>
                Run the comparison engine to check skill alignment, highlight missing keywords, and get tailored resume rewrites.
              </p>
              <button onClick={handleMatch} className="btn btn-secondary btn-sm">
                Run Quick Job Match
              </button>
            </div>
          )}

          {isLoading && (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }} role="status">
              <div className="pulse" style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }}>
                <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite' }} />
              </div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Comparing Keywords & Requirements</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Cross-referencing technical skills, hard requirements, and experience fit...
              </p>
            </div>
          )}

          {matchResult && !isLoading && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* 1. Score & Executive Reframe */}
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div className="score-box" style={{ minWidth: 100, padding: '1rem' }}>
                  <span className="score-value" style={{ color: matchResult.matchPercentage >= 75 ? 'var(--color-success)' : 'var(--color-warning)' }}>
                    {matchResult.matchPercentage}%
                  </span>
                  <span className="score-label">Role Fit</span>
                </div>
                <div>
                  <span className={`badge ${matchResult.matchPercentage >= 75 ? 'badge-success' : 'badge-warning'}`} style={{ marginBottom: '0.375rem' }}>
                    {matchResult.verdict}
                  </span>
                  <p style={{ fontSize: '0.84375rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                    {matchResult.executiveTakeaway || matchResult.gapAnalysis}
                  </p>
                </div>
              </div>

              {/* 2. What You Did Well */}
              {matchResult.whatYouDidWell && (
                <div className="card">
                  <h4 style={{ fontSize: '0.9375rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <CheckCircle2 size={16} color="var(--color-success)" />
                    1. What You Did Well
                  </h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    {matchResult.whatYouDidWell.map((w, idx) => (
                      <li key={idx} style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>•</span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 3. Missing Keywords (What is Not Working) */}
              <div className="card">
                <h4 style={{ fontSize: '0.9375rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <AlertTriangle size={16} color="var(--color-warning)" />
                  2. Missing Job Keywords to Add
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {matchResult.missingKeywords.map((kw, idx) => (
                    <span key={idx} className="badge badge-warning" style={{ fontSize: '0.75rem', textTransform: 'capitalize' }}>
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Confirmed Matching Skills */}
              <div className="card">
                <h4 style={{ fontSize: '0.9375rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Check size={16} color="var(--color-success)" />
                  Confirmed Skill Alignments
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {matchResult.matchingSkills.map((kw, idx) => (
                    <span key={idx} className="badge badge-success" style={{ fontSize: '0.75rem', textTransform: 'capitalize' }}>
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* 4. How to Fix It (Concrete Copyable Rewrites) */}
              <div className="card">
                <h4 style={{ fontSize: '0.9375rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Lightbulb size={16} color="var(--color-info)" />
                  3. How to Fix It (Tailored Bullet Points)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {(matchResult.howToFixIt || matchResult.tailoredBulletSuggestions || []).map((sug, idx) => {
                    const textToCopy = sug.concreteRewrite || sug.rewrittenBullet;
                    return (
                      <div key={idx} style={{ background: 'var(--bg-subtle)', padding: '0.875rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                          <span className="badge badge-neutral" style={{ fontSize: '0.6875rem' }}>
                            {sug.section || sug.originalContext || 'Target Section'}
                          </span>
                          <button
                            onClick={() => handleCopy(textToCopy, idx)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                            aria-label="Copy tailored bullet point"
                          >
                            {copiedIndex === idx ? <><CheckCheck size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                          </button>
                        </div>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                          &quot;{textToCopy}&quot;
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 5. External Resources */}
              {matchResult.externalResources && matchResult.externalResources.length > 0 && (
                <div className="card">
                  <h4 style={{ fontSize: '0.9375rem', marginBottom: '0.75rem' }}>
                    4. External Learning Resources
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {matchResult.externalResources.map((res, idx) => (
                      <a
                        key={idx}
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '0.625rem 0.875rem', background: 'var(--bg-subtle)',
                          borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)',
                          textDecoration: 'none', color: 'var(--text-primary)'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{res.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{res.description}</div>
                        </div>
                        <ExternalLink size={14} color="var(--text-muted)" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
