
import React, { useMemo } from 'react';
import { Prize } from '../types';

interface WheelProps {
  prizes: Prize[];
  rotation: number;
  isSpinning: boolean;
}

export const Wheel: React.FC<WheelProps> = ({ prizes, rotation, isSpinning }) => {
  const size = 600;
  const center = size / 2;
  const radius = center - 80; 
  const segmentAngle = 360 / prizes.length;

  const segments = useMemo(() => {
    return prizes.map((prize, index) => {
      const startAngle = index * segmentAngle;
      const endAngle = (index + 1) * segmentAngle;
      
      const x1 = center + radius * Math.cos((Math.PI * (startAngle - 90)) / 180);
      const y1 = center + radius * Math.sin((Math.PI * (startAngle - 90)) / 180);
      const x2 = center + radius * Math.cos((Math.PI * (endAngle - 90)) / 180);
      const y2 = center + radius * Math.sin((Math.PI * (endAngle - 90)) / 180);

      const path = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
      const isTopPrize = prize.label === '1000K';
      
      const fill = isTopPrize 
        ? "url(#midnightLuxuryGold)" 
        : (index % 2 === 0 ? "url(#carbonDark)" : "url(#carbonDeep)");

      const textColor = "#f3e29f";

      return (
        <g key={prize.id}>
          <path
            d={path}
            fill={fill}
            stroke={isTopPrize ? "#4d3d1a" : "rgba(207,162,77,0.15)"}
            strokeWidth={isTopPrize ? "2" : "0.5"}
          />
          {isTopPrize && (
            <path
              d={path}
              fill="none"
              stroke="rgba(0,0,0,0.7)"
              strokeWidth="5"
              style={{ filter: 'blur(5px)' }}
            />
          )}
          <g transform={`rotate(${startAngle + segmentAngle / 2}, ${center}, ${center})`}>
            <text
              x={center}
              y={center - radius * 0.7}
              fill={textColor}
              className="font-bodoni font-bold italic"
              textAnchor="middle"
              style={{ 
                fontSize: '32px',
                filter: 'drop-shadow(0px 3px 6px rgba(0,0,0,1))',
                letterSpacing: '-0.5px'
              }}
            >
              {prize.label}
            </text>
          </g>
        </g>
      );
    });
  }, [prizes, radius, center, segmentAngle]);

  const markers = useMemo(() => {
    return Array.from({ length: 48 }).map((_, i) => {
      const angle = (i * 360) / 48;
      const r = radius + 28;
      const x = center + r * Math.cos((Math.PI * angle) / 180);
      const y = center + r * Math.sin((Math.PI * angle) / 180);
      const isMajor = i % 4 === 0;
      return (
        <g key={i}>
          {isMajor && (
            <circle cx={x} cy={y} r="5" fill="rgba(243,226,159,0.15)" style={{ filter: 'blur(3px)' }} />
          )}
          <circle
            cx={x}
            cy={y}
            r={isMajor ? 2.5 : 1}
            fill={isMajor ? "#f3e29f" : "#8a6d3b"}
            style={{ filter: isMajor ? 'drop-shadow(0px 0px 4px rgba(243,226,159,0.8))' : 'none' }}
          />
        </g>
      );
    });
  }, [radius, center]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-visible">
      {/* Pointer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[15%] z-50 filter drop-shadow(0 8px 12px rgba(0,0,0,0.9)) scale-[0.7] sm:scale-[0.85]">
        <svg width="70" height="90" viewBox="0 0 70 90">
          <defs>
            <linearGradient id="pointerGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#f3e29f" />
              <stop offset="75%" stopColor="#8a6d3b" />
              <stop offset="100%" stopColor="#cfa24d" />
            </linearGradient>
            <filter id="pointerShadow">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.5"/>
            </filter>
          </defs>
          <path d="M35 90 L10 25 A 25 25 0 1 1 60 25 Z" fill="url(#pointerGold)" stroke="#000" strokeWidth="1" filter="url(#pointerShadow)"/>
          <circle cx="35" cy="25" r="10" fill="#050505" />
          <circle cx="35" cy="25" r="4" fill="#f3e29f" className="animate-pulse" />
        </svg>
      </div>

      <div className="relative w-full h-full">
        {/* Overlays */}
        <div className="absolute inset-0 z-40 pointer-events-none rounded-full" 
             style={{ 
               background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.4) 100%)',
               boxShadow: 'inset 0 0 80px rgba(0,0,0,0.8), inset 0 0 20px rgba(243,226,159,0.05)'
             }}>
        </div>
        
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full relative z-20"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 10s cubic-bezier(0.1, 0, 0, 1)' : 'none',
          }}
        >
          <defs>
            <linearGradient id="goldBezel3D" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4a360a" />
              <stop offset="15%" stopColor="#f3e29f" />
              <stop offset="30%" stopColor="#fff" />
              <stop offset="45%" stopColor="#f3e29f" />
              <stop offset="60%" stopColor="#8a6d3b" />
              <stop offset="85%" stopColor="#cfa24d" />
              <stop offset="100%" stopColor="#4a360a" />
            </linearGradient>

            <linearGradient id="midnightLuxuryGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0a0a0a" />
              <stop offset="40%" stopColor="#21190a" />
              <stop offset="50%" stopColor="#4a3d1c" />
              <stop offset="60%" stopColor="#21190a" />
              <stop offset="100%" stopColor="#050505" />
            </linearGradient>

            <linearGradient id="carbonDark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0d0d0d" />
              <stop offset="100%" stopColor="#050505" />
            </linearGradient>

            <linearGradient id="carbonDeep" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#121212" />
              <stop offset="100%" stopColor="#080808" />
            </linearGradient>
            
            <radialGradient id="deepHub" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#555" />
              <stop offset="70%" stopColor="#000" />
              <stop offset="100%" stopColor="#111" />
            </radialGradient>
            
            <filter id="innerGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="blur" />
              <feOffset dx="0" dy="0" result="offsetBlur" />
              <feComposite in="offsetBlur" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="glow" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.95 0 0 0 0 0.88 0 0 0 0 0.62 0 0 0 0.3 0" />
            </filter>
          </defs>

          <circle cx={center} cy={center} r={radius + 55} fill="url(#goldBezel3D)" />
          <circle cx={center} cy={center} r={radius + 50} fill="#000" />
          <circle cx={center} cy={center} r={radius + 47} fill="url(#goldBezel3D)" />
          <circle cx={center} cy={center} r={radius + 40} fill="#050505" />
          
          <circle cx={center} cy={center} r={radius} fill="#000" />
          
          {segments}
          {markers}

          <circle cx={center} cy={center} r="75" fill="url(#goldBezel3D)" />
          <circle cx={center} cy={center} r="70" fill="#000" />
          <circle cx={center} cy={center} r="65" fill="url(#deepHub)" filter="url(#innerGlow)" />
          
          <text
            x={center}
            y={center + 6}
            fill="#f3e29f"
            className="font-montserrat font-bold tracking-[0.5em]"
            textAnchor="middle"
            style={{ fontSize: '10px', textTransform: 'uppercase', filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,1))' }}
          >
            ARMANI
          </text>
        </svg>

        <div className="absolute inset-0 rounded-full shadow-[0_0_120px_rgba(207,162,77,0.12)] pointer-events-none z-10 ambient-glow"></div>
      </div>
    </div>
  );
};
