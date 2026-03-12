'use client';

import React from 'react';

export default function LocalServiceMap() {
  // Relative positions based on Felpham as center (0,0)
  // Mapped to an SVG coordinate system (600x400)
  const centerX = 300;
  const centerY = 200;

  const locations = [
    { name: "Felpham", x: 0, y: 0, pop: 10000, main: true },
    { name: "Bognor Regis", x: -25, y: 10, pop: 63000 },
    { name: "Chichester", x: -80, y: -60, pop: 31000 },
    { name: "Littlehampton", x: 70, y: -5, pop: 28000 },
    { name: "Arundel", x: 85, y: -70, pop: 3500 },
    { name: "Selsey", x: -100, y: 80, pop: 10000 },
    { name: "Worthing", x: 180, y: -15, pop: 110000 },
    { name: "Barnham", x: 45, y: -45, pop: 4000 },
    { name: "Yapton", x: 60, y: -30, pop: 3500 },
  ];

  // Scale for population dots
  const getRadius = (pop: number, isMain: boolean) => {
    if (isMain) return 12;
    return Math.max(5, Math.sqrt(pop) / 30);
  };

  return (
    <div style={{ 
      width: '100%', 
      backgroundColor: 'var(--bg-tertiary)', 
      borderRadius: 'var(--border-radius)',
      padding: '1rem',
      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <svg 
        viewBox="0 0 600 400" 
        width="100%" 
        height="100%" 
        style={{ display: 'block' }}
        aria-label="Service area map showing 15 mile radius around Felpham"
      >
        {/* Background / Sea */}
        <rect x="0" y="0" width="600" height="400" fill="var(--bg-tertiary)" />
        
        {/* Land Representation (Simplified Coastline) */}
        <path 
          d="M0,50 L100,60 L200,80 L300,100 L400,90 L500,70 L600,60 L600,0 L0,0 Z" 
          fill="var(--primary)" 
          opacity="0.03" 
        />

        {/* 15 Mile Radius Circle */}
        <circle 
          cx={centerX} 
          cy={centerY} 
          r="160" 
          fill="rgba(13, 148, 136, 0.05)" 
          stroke="var(--secondary)" 
          strokeWidth="2" 
          strokeDasharray="8,8" 
        />
        
        {/* Radius Label */}
        <text 
          x={centerX} 
          y={centerY + 175} 
          textAnchor="middle" 
          fill="var(--text-muted)" 
          fontSize="12" 
          fontWeight="600"
        >
          15 MILE SERVICE RADIUS
        </text>

        {/* Location Markers & Labels */}
        {locations.map((loc, i) => {
          const x = centerX + loc.x;
          const y = centerY + loc.y;
          const r = getRadius(loc.pop, !!loc.main);

          return (
            <g key={i} style={{ transition: 'all 0.3s' }}>
              {/* Pulse effect for main location */}
              {loc.main && (
                <circle cx={x} cy={y} r={r + 5} fill="var(--accent)" opacity="0.2">
                  <animate attributeName="r" from={r+2} to={r+15} dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              
              <circle 
                cx={x} 
                cy={y} 
                r={r} 
                fill={loc.main ? "var(--accent)" : "var(--secondary)"} 
                stroke="#ffffff" 
                strokeWidth="2" 
              />
              
              <text 
                x={x + r + 6} 
                y={y + 5} 
                fill="var(--primary)" 
                fontSize={loc.main ? "16" : "13"} 
                fontWeight="700"
                style={{ 
                  paintOrder: 'stroke', 
                  stroke: '#ffffff', 
                  strokeWidth: '3px',
                  strokeLinejoin: 'round'
                }}
              >
                {loc.name}
              </text>
            </g>
          );
        })}
      </svg>
      
      {/* Legend / Overlay */}
      <div style={{ 
        position: 'absolute', 
        bottom: '15px', 
        right: '15px', 
        backgroundColor: 'rgba(255,255,255,0.8)', 
        padding: '8px 12px', 
        borderRadius: '8px',
        fontSize: '0.75rem',
        border: '1px solid var(--border-light)',
        backdropFilter: 'blur(4px)',
        color: 'var(--text-primary)'
      }}>
        <strong>Legend:</strong><br/>
        <span style={{ color: 'var(--accent)' }}>●</span> Felpham (Base)<br/>
        <span style={{ color: 'var(--secondary)' }}>●</span> Local Hubs
      </div>
    </div>
  );
}
