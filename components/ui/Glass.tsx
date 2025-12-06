import React from 'react';

interface GlassProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high' | 'ultra';
  interactive?: boolean;
  border?: boolean;
  onClick?: () => void;
}

export const Glass: React.FC<GlassProps> = ({ 
  children, 
  className = '', 
  intensity = 'medium',
  interactive = false,
  border = true,
  onClick
}) => {
  // Optimized blur levels for better performance
  const bgIntensity = {
    low: 'bg-glass-50 backdrop-blur-sm',
    medium: 'bg-glass-100 backdrop-blur-md',
    high: 'bg-glass-200 backdrop-blur-lg',
    ultra: 'bg-glass-300 backdrop-blur-xl',
  };

  const borderClass = border ? 'border border-white/10' : 'border border-transparent';
  
  const hoverEffects = interactive 
    ? 'hover:bg-glass-200 hover:border-white/20 hover:shadow-glow-purple/20 transition-all duration-300 active:scale-[0.98] cursor-pointer' 
    : '';

  return (
    <div 
      onClick={onClick}
      className={`
        ${bgIntensity[intensity]} 
        ${borderClass}
        ${hoverEffects}
        shadow-glass
        transform-gpu will-change-transform
        ${className}
      `}
    >
      {children}
    </div>
  );
};