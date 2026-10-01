import React from 'react';
import { Card } from '../ui/Card';
import { formatMoney } from '../../utils/money';
import { TrendingUp, AlertOctagon, CheckCircle2 } from 'lucide-react';

export function ForecastCard({ summary, budget = 45000, currency = 'INR' }) {
  if (!summary) return null;

  const projected = summary.projectedMonthTotal || 0;
  const diff = budget - projected;
  const isOver = diff < 0;

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Month-End Projection</h4>
        </div>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isOver
              ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
              : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
          }`}
        >
          {isOver ? 'Deficit Warning' : 'Within Budget'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400">Projected Total</span>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
            {formatMoney(projected, currency, 0)}
          </p>
          <span className="text-[11px] text-slate-400 font-medium">Budget: {formatMoney(budget, currency, 0)}</span>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400">
            {isOver ? 'Expected Overrun' : 'Projected Savings'}
          </span>
          <p className={`text-xl font-black mt-0.5 ${isOver ? 'text-rose-500' : 'text-emerald-500'}`}>
            {isOver ? '+' : '-'}{formatMoney(Math.abs(diff), currency, 0)}
          </p>
          <span className="text-[11px] text-slate-400 font-medium">
            {isOver ? 'Requires reduction' : 'Compounding wealth'}
          </span>
        </div>
      </div>

      {isOver && summary.runOutDay && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold">
          <AlertOctagon className="w-4 h-4 shrink-0" />
          <span>At this burn rate, budget will be exhausted on Day {summary.runOutDay}.</span>
        </div>
      )}

      {!isOver && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>On track to save {formatMoney(diff, currency, 0)} by month end.</span>
        </div>
      )}
    </Card>
  );
}
