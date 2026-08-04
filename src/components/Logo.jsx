import React from 'react';

export default function Logo({ size = 36 }) {
  return (
    <div className="logo-container" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {/* Outer Roasted Espresso Emblem Badge */}
        <rect width="100" height="100" rx="22" fill="#3D2817" />
        
        {/* Inner Subtle Latte Ring */}
        <circle cx="50" cy="50" r="34" stroke="#FAF7F2" strokeWidth="2.5" strokeOpacity="0.35" strokeDasharray="6 4" />
        
        {/* Stylized AI Career Target Lines */}
        <path
          d="M32 62C32 62 42 66 50 66C58 66 68 62 68 62"
          stroke="#FAF7F2"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        
        {/* Central Rising AI Sparkle Target */}
        <path
          d="M50 26L53.5 38.5L66 42L53.5 45.5L50 58L46.5 45.5L34 42L46.5 38.5L50 26Z"
          fill="#FAF7F2"
        />
        <circle cx="70" cy="30" r="3.5" fill="#E6DED6" />
        <circle cx="30" cy="34" r="2.5" fill="#E6DED6" opacity="0.8" />
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.0625rem',
          fontWeight: 800,
          lineHeight: 1.1,
          color: 'var(--text-primary)',
          letterSpacing: '0.06em'
        }}>
          GRAYMARK AI
        </span>
        <span style={{
          fontSize: '0.71875rem',
          fontWeight: 500,
          color: 'var(--text-secondary)',
          letterSpacing: '0.02em',
          marginTop: '0.1rem'
        }}>
          Career & Resume Intelligence
        </span>
      </div>
    </div>
  );
}
