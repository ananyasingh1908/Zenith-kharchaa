import React from 'react';

export function Badge({ children, variant = 'neutral', size = 'sm', className = '' }) {
  const variants = {
    neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    primary: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/50',
    danger: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/50 dark:border-rose-800/50',
    purple: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/50',
  };

  const sizes = {
    xs: 'text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider',
    sm: 'text-xs px-2.5 py-1 font-semibold',
    md: 'text-sm px-3 py-1.5 font-semibold',
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full ${variants[variant] || variants.neutral} ${sizes[size] || sizes.sm} ${className}`}>
      {children}
    </span>
  );
}
