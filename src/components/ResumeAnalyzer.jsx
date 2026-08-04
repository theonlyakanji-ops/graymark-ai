import React, { useState, useEffect, useRef } from 'react';
import { SAMPLE_RESUMES } from '../data/sampleResumes';
import { analyzeResume } from '../services/aiEngine';
import { parseFileToText } from '../utils/fileParser';
import { exportAnalysisToPDF } from '../utils/pdfExport';
import SkillRadarChart from './SkillRadarChart';
import {
  Play, CheckCircle2, AlertTriangle, Lightbulb, FileText,
  RefreshCw, Download, FileUp, Copy, CheckCheck, ExternalLink, AlertCircle
} from 'lucide-react';

export default function ResumeAnalyzer({ resumeText, setResumeText, analysisResult, setAnalysisResult }) {
  const [selectedSample, setSelectedSample] = useState('fullstack-engineer');
  const [isLoading, setIsLoading] = useState(false);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!resumeText) {
      const defaultSample = SAMPLE_RESUMES.find(s => s.id === 'fullstack-engineer');
      if (defaultSample) setResumeText(defaultSample.content);
    }
  }, []);

  // Keyboard shortcut Ctrl+Enter or Cmd+Enter to analyze
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleAnalyze();
    }
  };

  const handleSelectSample = (sampleId) => {
    setSelectedSample(sampleId);
    setErrorMessage(null);
    const sample = SAMPLE_RESUMES.find(s => s.id === sampleId);
    if (sample) {
      setResumeText(sample.content);
      setAnalysisResult(null);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setIsParsingFile(true);
    try {
      const extractedText = await parseFileToText(file);
      if (!extractedText.trim()) {
        throw new Error('No readable text found in file. Please ensure it is a valid text PDF or TXT.');
      }
      setResumeText(extractedText);
      setAnalysisResult(null);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to parse uploaded file.');
    } finally {
      setIsParsingFile(false);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setErrorMessage('Please paste or upload resume content before running analysis.');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);
    try {
      const result = await analyzeResume(resumeText);
      setAnalysisResult(result);

      // Save to Smart Career Memory
      const { updateCareerMemory, addInsightToMemory, getCareerMemory } = await import('../services/careerMemory');
      const curMemory = getCareerMemory();
      const newHighest = Math.max(result.overallScore, curMemory.highestAtsScore || 0);
      updateCareerMemory({ highestAtsScore: newHighest, lastAtsScore: result.overallScore });
      addInsightToMemory(`Achieved ATS score of ${result.overallScore}% on latest resume iteration.`);
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred while evaluating your resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyRewrite = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleExportPDF = () => {
    if (!analysisResult) return;
    const htmlContent = `
      <div class="score-box">
        <div class="score-num">${analysisResult.overallScore}%</div>
        <div><strong>Verdict:</strong> ${analysisResult.executiveTakeaway}</div>
      </div>
      <div class="section">
        <h3>What You Did Well</h3>
        <ul>
          ${(analysisResult.whatYouDidWell || analysisResult.strengths || []).map(s => `<li>${s}</li>`).join('')}
        </ul>
      </div>
      <div class="section">
        <h3>How to Fix Issues</h3>
        <ul>
          ${(analysisResult.howToFixIt || []).map(item => `<li><strong>${item.context}:</strong> ${item.concreteRewrite}</li>`).join('')}
        </ul>
      </div>
    `;
    exportAnalysisToPDF('ATS Resume Analysis Report', htmlContent);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'var(--color-success)';
    if (score >= 60) return 'var(--color-warning)';
    return 'var(--color-danger)';
  };

  const getScoreBadgeClass = (score) => {
    if (score >= 80) return 'badge-success';
    if (score >= 60) return 'badge-warning';
    return 'badge-danger';
  };

  return (
    <div className="animate-fade-in" role="region" aria-label="ATS Resume Analyzer">
      <div className="section-header">
        <div>
          <h2 style={{ fontSize: '1.25rem' }}>ATS Resume Analyzer</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Inspect candidate resume structure, metrics, and keyword density. Press <strong>Ctrl+Enter</strong> to run.
          </p>
        </div>

        {/* Preset Sample & Upload Selector */}
        <div className="sample-selector">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.docx,.txt"
            style={{ display: 'none' }}
            aria-label="Upload Resume File"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-secondary btn-sm"
            aria-label="Upload PDF or Text File"
          >
            <FileUp size={14} />
            Upload PDF/TXT File
          </button>

          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Samples:</span>
          {SAMPLE_RESUMES.map(sample => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample.id)}
              className={`btn btn-sm ${selectedSample === sample.id ? 'btn-primary' : 'btn-secondary'}`}
              aria-label={`Load ${sample.title} sample`}
            >
              {sample.title}
            </button>
          ))}
        </div>
      </div>

      {/* Error Alert Message */}
      {errorMessage && (
        <div className="card" style={{ background: 'var(--bg-danger)', border: '1px solid var(--border-danger)', marginTop: '1rem', padding: '0.875rem 1.25rem' }} role="alert">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-danger)' }}>
            <AlertCircle size={16} />
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{errorMessage}</span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Actionable Next Step: Check your input or click &quot;Load Sample&quot; to test with a pre-formatted resume.
          </p>
        </div>
      )}

      <div className="grid-2" style={{ marginTop: '1.25rem', alignItems: 'start' }}>
        {/* Left Column: Input Resume Area */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={18} />
              <h3 className="card-title">Resume Content</h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {isParsingFile ? 'Reading File...' : `${resumeText.trim().split(/\s+/).filter(Boolean).length} words`}
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="resume-textarea" className="label">
              <span>Plain Text / Document Input</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Shortcut: Ctrl+Enter</span>
            </label>
            <textarea
              id="resume-textarea"
              className="textarea"
              placeholder="Paste or upload your resume here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={16}
              disabled={isParsingFile}
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isLoading || isParsingFile || !resumeText.trim()}
            className="btn btn-primary"
            style={{ width: '100%' }}
            aria-label="Analyze Resume ATS Score"
          >
            {isLoading ? (
              <>
                <RefreshCw size={16} className="pulse" />
                Evaluating Resume Structure...
              </>
            ) : (
              <>
                <Play size={16} />
                Analyze Resume ATS Score
              </>
            )}
          </button>
        </div>

        {/* Right Column: 5-Part Structured AI Analysis */}
        <div>
          {!analysisResult && !isLoading && (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'var(--bg-subtle)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem',
                color: 'var(--text-muted)'
              }}>
                <FileText size={24} />
              </div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>No Analysis Generated Yet</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: 320, margin: '0 auto 1.25rem' }}>
                Click &quot;Analyze Resume ATS Score&quot; to inspect metric impact, brevity, keyword density, and actionable fixes.
              </p>
              <button onClick={handleAnalyze} className="btn btn-secondary btn-sm">
                Run Quick Demo Analysis
              </button>
            </div>
          )}

          {isLoading && (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }} role="status">
              <div className="pulse" style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }}>
                <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite' }} />
              </div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Evaluating Resume Structure</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Parsing section hierarchy, calculating metric density, checking ATS keyword patterns...
              </p>
            </div>
          )}

          {analysisResult && !isLoading && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* 1. Score & Executive Reframe */}
              <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div className="score-box" style={{ minWidth: 100, padding: '1rem' }}>
                    <span className="score-value" style={{ color: getScoreColor(analysisResult.overallScore) }}>
                      {analysisResult.overallScore}
                    </span>
                    <span className="score-label">ATS Score</span>
                  </div>
                  <div>
                    <span className={`badge ${getScoreBadgeClass(analysisResult.overallScore)}`} style={{ marginBottom: '0.375rem' }}>
                      {analysisResult.overallScore >= 80 ? 'ATS Optimized' : 'Needs Optimization'}
                    </span>
                    <p style={{ fontSize: '0.84375rem', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.4 }}>
                      {analysisResult.executiveTakeaway || analysisResult.summary}
                    </p>
                  </div>
                </div>

                <button onClick={handleExportPDF} className="btn btn-secondary btn-sm" title="Download PDF Report" aria-label="Export Report to PDF">
                  <Download size={14} />
                  PDF
                </button>
              </div>

              {/* Metric Radar Chart */}
              <div className="card">
                <h4 style={{ marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  Metric Distribution Radar
                </h4>
                <SkillRadarChart scores={analysisResult.scores} />
              </div>

              {/* 2. What You Did Well */}
              <div className="card">
                <h4 style={{ fontSize: '0.9375rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <CheckCircle2 size={16} color="var(--color-success)" />
                  1. What You Did Well
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {(analysisResult.whatYouDidWell || analysisResult.strengths || []).map((str, idx) => (
                    <li key={idx} style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>•</span>
                      {str}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3. What is Not Working */}
              <div className="card">
                <h4 style={{ fontSize: '0.9375rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <AlertTriangle size={16} color="var(--color-warning)" />
                  2. What is Not Working
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {(analysisResult.whatIsNotWorking || analysisResult.improvements || []).map((imp, idx) => (
                    <div key={idx} style={{ background: 'var(--bg-subtle)', padding: '0.75rem 0.875rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                      <span className="badge badge-warning" style={{ fontSize: '0.6875rem', marginBottom: '0.25rem' }}>
                        {imp.category || 'Structure'}
                      </span>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                        {imp.issue || imp}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. How to Fix It (Concrete Copyable Rewrites) */}
              <div className="card">
                <h4 style={{ fontSize: '0.9375rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Lightbulb size={16} color="var(--color-info)" />
                  3. How to Fix It (Copyable Rewrites)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {(analysisResult.howToFixIt || []).map((fix, idx) => (
                    <div key={idx} style={{ background: 'var(--bg-subtle)', padding: '0.875rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                        <span className="badge badge-neutral" style={{ fontSize: '0.6875rem' }}>
                          {fix.context}
                        </span>
                        {fix.concreteRewrite && (
                          <button
                            onClick={() => handleCopyRewrite(fix.concreteRewrite, idx)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                            aria-label="Copy concrete rewrite text"
                          >
                            {copiedIndex === idx ? <><CheckCheck size={12} /> Copied</> : <><Copy size={12} /> Copy Rewrite</>}
                          </button>
                        )}
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>
                        <strong>Action:</strong> {fix.actionableStep}
                      </p>
                      {fix.concreteRewrite && (
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', fontWeight: 600, background: 'var(--bg-card)', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                          &quot;{fix.concreteRewrite}&quot;
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. External Resources */}
              {analysisResult.externalResources && analysisResult.externalResources.length > 0 && (
                <div className="card">
                  <h4 style={{ fontSize: '0.9375rem', marginBottom: '0.75rem' }}>
                    4. External Resources & Official Guides
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {analysisResult.externalResources.map((res, idx) => (
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

      <style>{`
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .sample-selector {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
