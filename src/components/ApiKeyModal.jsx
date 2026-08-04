import React, { useState } from 'react';
import { Key, X, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { getApiKey, setApiKey } from '../services/aiEngine';

export default function ApiKeyModal({ isOpen, onClose }) {
  const [keyInput, setKeyInput] = useState(getApiKey());
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setApiKey(keyInput);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 600);
  };

  const handleClear = () => {
    setKeyInput('');
    setApiKey('');
    onClose();
  };

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-key-modal-title"
    >
      <div className="modal-content card animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Key size={18} />
            <h2 id="api-key-modal-title" className="card-title">Google Gemini API Key</h2>
          </div>
          <button className="btn-close" onClick={onClose} aria-label="Close API Key Modal">
            <X size={16} />
          </button>
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Connect your Gemini API key to enable live AI evaluations. If left blank, the app will run in 
          <strong> Smart Demo Mode</strong> (instant pre-computed AI models).
        </p>

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label htmlFor="gemini-key-input" className="label">
              <span>Gemini API Key</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '0.75rem', color: 'var(--color-info)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
              >
                Get free key <ExternalLink size={10} />
              </a>
            </label>
            <input
              id="gemini-key-input"
              type="password"
              className="input"
              placeholder="AIzaSy..."
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              aria-label="Gemini API Key input field"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            <ShieldCheck size={14} />
            <span>Key is stored securely in your browser&apos;s local storage.</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            {getApiKey() && (
              <button type="button" onClick={handleClear} className="btn btn-secondary btn-sm" aria-label="Clear API Key">
                Clear Key
              </button>
            )}
            <button type="submit" className="btn btn-primary btn-sm" aria-label="Save API Key">
              {saved ? <><Check size={14} /> Saved!</> : 'Save & Enable Live AI'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 1rem;
        }

        .modal-content {
          max-width: 460px;
          width: 100%;
          border-radius: var(--radius-md);
        }

        .btn-close {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 4px;
          display: flex;
          align-items: center;
        }

        .btn-close:hover {
          color: var(--text-primary);
          background: var(--bg-subtle);
        }
      `}</style>
    </div>
  );
}
