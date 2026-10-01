import React from 'react';
import { motion } from 'framer-motion';

export function CountdownRing({
  createdAt,
  unlockAt,
  size = 56,
  strokeWidth = 5,
  isReady = false,
}) {
  const now = Date.now();
  const start = new Date(createdAt).getTime();
  const end = new Date(unlockAt).getTime();
  const total = Math.max(1, end - start);
  const elapsed = Math.max(0, now - start);
  const percent = isReady ? 100 : Math.min(100, (elapsed / total) * 100);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * percent) / 100;

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
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
          stroke={isReady ? '#10B981' : '#3B82F6'}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span className="absolute text-[11px] font-black text-slate-800 dark:text-slate-200">
        {Math.round(percent)}%
      </span>
    </div>
  );
}
