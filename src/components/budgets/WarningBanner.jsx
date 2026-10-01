import React from 'react';
import { AlertTriangle, Flame } from 'lucide-react';
import { formatMoney } from '../../utils/money';

export function WarningBanner({ overBudget = [], nearBudget = [], currency = 'INR' }) {
  if (overBudget.length === 0 && nearBudget.length === 0) return null;

  return (
    <div className="space-y-2">
      {overBudget.map(item => (
        <div
          key={item.category}
          className="flex items-center gap-3 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 backdrop-blur-md"
        >
          <Flame className="w-5 h-5 text-rose-500 shrink-0" />
          <div className="text-xs">
            <strong className="font-bold">{item.category}</strong> exceeded limit ({item.percentage}% used). Spent {formatMoney(item.spent, currency, 0)} of {formatMoney(item.limit, currency, 0)}.
          </div>
        </div>
      ))}

      {nearBudget.map(item => (
        <div
          key={item.category}
          className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 backdrop-blur-md"
        >
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
          <div className="text-xs">
            <strong className="font-bold">{item.category}</strong> is at {item.percentage}% of its allocation. {formatMoney(item.limit - item.spent, currency, 0)} remaining.
          </div>
        </div>
      ))}
    </div>
  );
}
