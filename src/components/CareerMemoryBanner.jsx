import React, { useState, useEffect } from 'react';
import { Brain, Trash2, CheckCircle2, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { getCareerMemory, clearCareerMemory } from '../services/careerMemory';

export default function CareerMemoryBanner() {
  const [memory, setMemory] = useState(getCareerMemory());
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Sync memory state
    const handleStorage = () => setMemory(getCareerMemory());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleClear = () => {
    if (confirm('Clear AI Candidate Memory?')) {
      const reset = clearCareerMemory();
      setMemory(reset);
    }
  };

  return (
    <div className="card memory-banner" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--bg-subtle)', color: 'var(--text-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid var(--border-color)'
          }}>
            <Brain size={16} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600 }}>Smart AI Candidate Memory</h4>
              <span className="badge badge-neutral" style={{ fontSize: '0.6875rem' }}>
                Active Context
              </span>
            </div>
            <p style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
              Target: <strong>{memory.targetRole}</strong> {memory.highestAtsScore ? `• Best ATS Score: ${memory.highestAtsScore}%` : ''}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
          >
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {isExpanded ? 'Hide Details' : 'View Memory'}
          </button>

          {isExpanded && (
            <button
              onClick={handleClear}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--color-danger)' }}
              title="Reset remembered context"
            >
              <Trash2 size={12} /> Clear
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="animate-fade-in" style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
          <h5 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>
            Remembered Candidate Insights:
          </h5>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {memory.rememberedInsights.map((insight, idx) => (
              <span key={idx} className="badge badge-info" style={{ fontSize: '0.75rem', fontWeight: 400 }}>
                <Sparkles size={10} /> {insight}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
