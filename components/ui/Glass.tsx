import React from 'react';

interface GlassProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high' | 'ultra';
  interactive?: boolean;
  border?: boolean;
  onClick?: () => void;
  variant?: 'glass' | 'flat'; // Added 'flat' variant for performance
}

export const Glass: React.FC<GlassProps> = ({ 
  children, 
  className = '', 
  intensity = 'medium',
  interactive = false,
  border = true,
  onClick,
  variant = 'glass'
}) => {
  // Optimized blur levels for better performance
  const bgIntensity = {
    low: 'bg-glass-50 backdrop-blur-sm',
    medium: 'bg-glass-100 backdrop-blur-md',
    high: 'bg-glass-200 backdrop-blur-lg',
    ultra: 'bg-glass-300 backdrop-blur-xl',
  };

  // Flat mode uses solid semi-transparent colors without blur to save GPU
  const flatIntensity = {
    low: 'bg-[#1a1f2e] bg-opacity-80',
    medium: 'bg-[#1e2336] bg-opacity-90',
    high: 'bg-[#252a40]',
    ultra: 'bg-[#2a304a]',
  };

  const selectedBg = variant === 'flat' ? flatIntensity[intensity] : bgIntensity[intensity];
  const borderClass = border ? 'border border-white/10' : 'border border-transparent';
  
  const hoverEffects = interactive 
    ? 'hover:bg-white/10 hover:border-white/20 hover:shadow-glow-purple/20 transition-all duration-300 active:scale-[0.98] cursor-pointer' 
    : '';

  return (
    <div 
      onClick={onClick}
      className={`
        ${selectedBg} 
        ${borderClass}
        ${hoverEffects}
        ${variant === 'glass' ? 'shadow-glass' : 'shadow-sm'}
        transform-gpu
        ${className}
      `}
    >
      {children}
    </div>
  );
};