import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const SaarthiLogo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const dimensions = {
    sm: { icon: 28, text: 'text-lg' },
    md: { icon: 36, text: 'text-xl' },
    lg: { icon: 48, text: 'text-2xl' },
    xl: { icon: 80, text: 'text-3xl' }
  }[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div 
        className="relative shrink-0 flex items-center justify-center rounded-full bg-[#012d1d] text-[#ffffff] p-1.5 shadow-sm border border-[#006c48]/30"
        style={{ width: dimensions.icon, height: dimensions.icon }}
      >
        {/* Custom Saarthi Emblem SVG */}
        <svg viewBox="0 0 100 100" className="w-full h-full text-current fill-current">
          {/* Outer ring arc */}
          <circle cx="50" cy="50" r="46" fill="none" stroke="#92f7c3" strokeWidth="4" strokeDasharray="220 60" />
          <circle cx="50" cy="50" r="46" fill="none" stroke="#c7e7ff" strokeWidth="3" strokeDasharray="40 180" strokeDashoffset="120" />
          
          {/* Speech Bubble at top */}
          <rect x="42" y="8" width="16" height="12" rx="4" fill="#d4af37" />
          <circle cx="46" cy="14" r="1.5" fill="#012d1d" />
          <circle cx="50" cy="14" r="1.5" fill="#012d1d" />
          <circle cx="54" cy="14" r="1.5" fill="#012d1d" />
          
          {/* Scales of justice (left) */}
          <path d="M 22 38 L 34 38 M 28 38 L 28 52 M 22 52 L 28 42 L 34 52 Z" stroke="#ffffff" strokeWidth="2.5" fill="none" />
          
          {/* Voice Waves (right) */}
          <line x1="68" y1="40" x2="68" y2="48" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="73" y1="36" x2="73" y2="52" stroke="#92f7c3" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="78" y1="42" x2="78" y2="46" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />

          {/* Supportive Hand holding land at bottom */}
          <path 
            d="M 15 72 C 25 88, 75 88, 85 72 C 75 80, 25 80, 15 72 Z" 
            fill="#006c48" 
          />
          {/* Land path & hill */}
          <path d="M 20 70 Q 50 55 80 70 L 80 75 Q 50 65 20 75 Z" fill="#1b4332" />
          <path d="M 45 70 Q 50 60 55 70" fill="none" stroke="#f9faf2" strokeWidth="2" />
          
          {/* Small Village Hut & Tree */}
          <polygon points="62,60 68,54 74,60" fill="#d4af37" />
          <rect x="63" y="60" width="10" height="8" fill="#ffffff" />
          <circle cx="78" cy="56" r="5" fill="#92f7c3" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col justify-center">
          <span className={`font-bold font-headline-lg text-primary leading-none tracking-tight ${dimensions.text}`}>
            Saarthi
          </span>
          {size === 'xl' && (
            <span className="text-xs text-on-surface-variant font-label-bold tracking-widest uppercase mt-1">
              Guiding Every Step
            </span>
          )}
        </div>
      )}
    </div>
  );
};
