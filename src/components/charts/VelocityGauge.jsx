import React from 'react';
import { motion } from 'framer-motion';
import { formatMoney } from '../../utils/money';
import { ShieldCheck, AlertTriangle, Flame } from 'lucide-react';

export function VelocityGauge({
  safeToday = 0,
  spentToday = 0,
  velocityStatus = 'green',
  runOutDay = null,
  currency = 'INR',
  projectedMonthTotal = 0,
}) {
  const statusConfig = {
    green: {
      color: '#10B981',
      bgGlow: 'shadow-glow-green',
      badgeBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/50',
      label: 'Ultra Safe Pace',
      icon: ShieldCheck,
      needlePercent: 35,
    },
    yellow: {
      color: '#F59E0B',
      bgGlow: 'shadow-glow-amber',
      badgeBg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/50',
      label: 'Elevated Spend',
      icon: AlertTriangle,
      needlePercent: 68,
    },
    red: {
      color: '#EF4444',
      bgGlow: 'shadow-glow-red',
      badgeBg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200/50',
      label: 'Over Budget Velocity',
      icon: Flame,
      needlePercent: 92,
    },
  };

  const config = statusConfig[velocityStatus] || statusConfig.green;
  const Icon = config.icon;

  const radius = 80;
  const strokeWidth = 14;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * config.needlePercent) / 100;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-28 flex items-end justify-center overflow-hidden">
        <svg className="w-48 h-48 -rotate-180" viewBox="0 0 200 200">
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-200 dark:text-slate-800"
            strokeLinecap="round"
          />
          <motion.path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={config.color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute bottom-1 flex flex-col items-center text-center">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Daily Safe-To-Spend</span>
          <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {formatMoney(safeToday, currency, 0)}
          </span>
        </div>
      </div>

      <div className="mt-3 flex flex-col items-center gap-1 text-center">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${config.badgeBg}`}>
          <Icon className="w-3.5 h-3.5" />
          <span>{config.label}</span>
        </div>

        {velocityStatus === 'red' && runOutDay && (
          <p className="text-xs font-semibold text-rose-500 mt-1 animate-pulse">
            Projected budget exhaustion around Day {runOutDay}
          </p>
        )}

        {velocityStatus !== 'red' && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Spent {formatMoney(spentToday, currency, 0)} today
          </p>
        )}
      </div>
    </div>
  );
}
