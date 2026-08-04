import React from 'react';

export default function SkillRadarChart({ scores }) {
  // Metric labels and scores (0-100)
  const metrics = [
    { label: 'Impact', val: scores.impact || 75 },
    { label: 'Brevity', val: scores.brevity || 80 },
    { label: 'Style', val: scores.style || 85 },
    { label: 'Keywords', val: scores.keywords || 70 }
  ];

  // Radar points on a 200x200 SVG canvas
  const center = 100;
  const radius = 65;

  // Angles for 4 axes: Top, Right, Bottom, Left (0, 90, 180, 270 deg)
  const angles = [ -Math.PI / 2, 0, Math.PI / 2, Math.PI ];

  const getCoordinates = (index, valuePercent) => {
    const angle = angles[index];
    const r = (valuePercent / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Polygon points
  const points = metrics.map((m, i) => {
    const coords = getCoordinates(i, m.val);
    return `${coords.x},${coords.y}`;
  }).join(' ');

  // Grid levels (25%, 50%, 75%, 100%)
  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <div style={{ textAlign: 'center' }}>
      <svg width="220" height="220" viewBox="0 0 200 200">
        {/* Background Grid Concentric Polygons */}
        {gridLevels.map((lvl, idx) => {
          const levelPoints = angles.map(angle => {
            const r = lvl * radius;
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
          }).join(' ');
          return (
            <polygon
              key={idx}
              points={levelPoints}
              fill="none"
              stroke="var(--border-color)"
              strokeWidth="1"
              strokeDasharray={idx < 3 ? '3 3' : 'none'}
            />
          );
        })}

        {/* Axes lines */}
        {angles.map((angle, idx) => (
          <line
            key={idx}
            x1={center}
            y1={center}
            x2={center + radius * Math.cos(angle)}
            y2={center + radius * Math.sin(angle)}
            stroke="var(--border-color)"
            strokeWidth="1"
          />
        ))}

        {/* Score Data Polygon */}
        <polygon
          points={points}
          fill="rgba(61, 40, 23, 0.15)"
          stroke="var(--accent-primary)"
          strokeWidth="2.5"
        />

        {/* Data points (dots) */}
        {metrics.map((m, i) => {
          const coords = getCoordinates(i, m.val);
          return (
            <g key={i}>
              <circle
                cx={coords.x}
                cy={coords.y}
                r="4"
                fill="var(--accent-primary)"
                stroke="var(--bg-card)"
                strokeWidth="2"
              />
            </g>
          );
        })}

        {/* Metric Labels */}
        {/* Top: Impact */}
        <text x="100" y="16" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text-primary)">
          Impact ({metrics[0].val}%)
        </text>

        {/* Right: Brevity */}
        <text x="180" y="104" textAnchor="start" fontSize="10" fontWeight="600" fill="var(--text-primary)">
          Brevity ({metrics[1].val}%)
        </text>

        {/* Bottom: Style */}
        <text x="100" y="192" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text-primary)">
          Style ({metrics[2].val}%)
        </text>

        {/* Left: Keywords */}
        <text x="20" y="104" textAnchor="end" fontSize="10" fontWeight="600" fill="var(--text-primary)">
          Keywords ({metrics[3].val}%)
        </text>
      </svg>
    </div>
  );
}
