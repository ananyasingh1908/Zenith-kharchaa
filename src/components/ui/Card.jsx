import React from 'react';

export function Card({ children, className = '', hover = false, glow = false, onClick, ...props }) {
  return (
    <div
      onClick={onClick}
      className={`relative rounded-[28px] glass-card p-6 transition-all duration-300 ${
        hover ? 'hover:shadow-glass-hover hover:-translate-y-0.5 cursor-pointer' : 'shadow-card'
      } ${glow ? 'shadow-glow-blue border-blue-500/40' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
