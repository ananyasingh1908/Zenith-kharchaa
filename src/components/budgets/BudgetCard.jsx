import React from 'react';
import { Card } from '../ui/Card';
import { MiniBudgetBar } from '../charts/ConcentricBudgetRing';
import { formatMoney } from '../../utils/money';
import { formatTimeCost } from '../../utils/timeCost';
import { getCategoryById } from '../../utils/categories';
import { useSettings } from '../../hooks/useSettings';
import {
  Utensils,
  Car,
  Gamepad2,
  Receipt,
  ShoppingBag,
  HeartPulse,
  Zap,
  Sparkles,
  CircleDot,
} from 'lucide-react';

const ICON_MAP = {
  Utensils,
  Car,
  Gamepad2,
  Receipt,
  ShoppingBag,
  HeartPulse,
  Zap,
  Sparkles,
  CircleDot,
};

export function BudgetCard({ category, spent = 0, limit = 0, currency = 'INR' }) {
  const { hourlyWage } = useSettings();
  const cat = getCategoryById(category);
  const IconComponent = ICON_MAP[cat.icon] || CircleDot;
  const percentage = limit > 0 ? Math.round((spent / limit) * 100) : 0;
  const remaining = Math.max(0, limit - spent);

  let statusText = `${percentage}% used`;
  let statusBadge = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300';
  if (percentage >= 100) {
    statusText = 'Limit exceeded';
    statusBadge = 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300';
  } else if (percentage >= 80) {
    statusText = 'Near cap';
    statusBadge = 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300';
  }

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: cat.bgColor, color: cat.color }}
          >
            <IconComponent className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{cat.name}</h4>
            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${statusBadge}`}>
              {statusText}
            </span>
          </div>
        </div>

        <div className="text-right shrink-0">
          <p className="text-sm font-black text-slate-900 dark:text-white">
            {formatMoney(spent, currency, 0)}
          </p>
          <p className="text-[11px] font-semibold text-slate-400">
            of {formatMoney(limit, currency, 0)}
          </p>
        </div>
      </div>

      <MiniBudgetBar percentage={percentage} />

      <div className="flex items-center justify-between text-xs text-slate-400 font-medium pt-1">
        <span>{formatTimeCost(spent, hourlyWage)} spent</span>
        <span>{formatMoney(remaining, currency, 0)} left</span>
      </div>
    </Card>
  );
}
