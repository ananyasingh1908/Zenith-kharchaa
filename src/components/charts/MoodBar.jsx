import React from 'react';
import { formatMoney } from '../../utils/money';
import { Smile, Meh, Frown } from 'lucide-react';

export function MoodBar({ moodCounts = {}, moodAmounts = {}, currency = 'INR' }) {
  const worthAmount = moodAmounts.worth || 0;
  const mehAmount = moodAmounts.meh || 0;
  const regretAmount = moodAmounts.regret || 0;
  const total = worthAmount + mehAmount + regretAmount;

  const worthPct = total > 0 ? (worthAmount / total) * 100 : 0;
  const mehPct = total > 0 ? (mehAmount / total) * 100 : 0;
  const regretPct = total > 0 ? (regretAmount / total) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="h-3.5 w-full rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-800">
        {worthPct > 0 && (
          <div
            style={{ width: `${worthPct}%` }}
            className="h-full bg-emerald-500 transition-all duration-500"
            title={`Worth: ${Math.round(worthPct)}%`}
          />
        )}
        {mehPct > 0 && (
          <div
            style={{ width: `${mehPct}%` }}
            className="h-full bg-amber-500 transition-all duration-500"
            title={`Meh: ${Math.round(mehPct)}%`}
          />
        )}
        {regretPct > 0 && (
          <div
            style={{ width: `${regretPct}%` }}
            className="h-full bg-rose-500 transition-all duration-500"
            title={`Regret: ${Math.round(regretPct)}%`}
          />
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-center">
          <div className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
            <Smile className="w-3.5 h-3.5" />
            <span>Worth It</span>
          </div>
          <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
            {formatMoney(worthAmount, currency, 0)}
          </p>
          <span className="text-[10px] text-slate-400">{moodCounts.worth || 0} items ({Math.round(worthPct)}%)</span>
        </div>

        <div className="p-3 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 text-center">
          <div className="flex items-center justify-center gap-1 text-amber-600 dark:text-amber-400 font-bold text-xs">
            <Meh className="w-3.5 h-3.5" />
            <span>Meh</span>
          </div>
          <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
            {formatMoney(mehAmount, currency, 0)}
          </p>
          <span className="text-[10px] text-slate-400">{moodCounts.meh || 0} items ({Math.round(mehPct)}%)</span>
        </div>

        <div className="p-3 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-center">
          <div className="flex items-center justify-center gap-1 text-rose-600 dark:text-rose-400 font-bold text-xs">
            <Frown className="w-3.5 h-3.5" />
            <span>Regret</span>
          </div>
          <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
            {formatMoney(regretAmount, currency, 0)}
          </p>
          <span className="text-[10px] text-slate-400">{moodCounts.regret || 0} items ({Math.round(regretPct)}%)</span>
        </div>
      </div>
    </div>
  );
}
