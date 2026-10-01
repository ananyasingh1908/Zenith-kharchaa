import React from 'react';
import { motion } from 'framer-motion';

export function ConcentricBudgetRing({ percentage = 0, size = 160, strokeWidth = 14, label, sublabel }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPercent = Math.min(100, Math.max(0, percentage));
  const strokeDashoffset = circumference - (circumference * clampedPercent) / 100;

  let ringColor = '#10B981';
  let glowClass = 'shadow-glow-green';
  if (percentage >= 100) {
    ringColor = '#EF4444';
    glowClass = 'shadow-glow-red';
  } else if (percentage >= 80) {
    ringColor = '#F59E0B';
    glowClass = 'shadow-glow-amber';
  }

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-200 dark:text-slate-800"
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
        <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          {Math.round(percentage)}%
        </span>
        {label && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>}
        {sublabel && <span className="text-[11px] font-semibold text-slate-500">{sublabel}</span>}
      </div>
    </div>
  );
}

export function MiniBudgetBar({ percentage = 0, className = '' }) {
  const clamped = Math.min(100, Math.max(0, percentage));

  let barColor = 'bg-emerald-500';
  if (percentage >= 100) {
    barColor = 'bg-rose-500';
  } else if (percentage >= 80) {
    barColor = 'bg-amber-500';
  }

  return (
    <div className={`h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ${className}`}>
      <motion.div
        className={`h-full rounded-full ${barColor}`}
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
    </div>
  );
}
