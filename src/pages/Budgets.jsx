import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ConcentricBudgetRing } from '../components/charts/ConcentricBudgetRing';
import { BudgetCard } from '../components/budgets/BudgetCard';
import { BudgetEditSheet } from '../components/budgets/BudgetEditSheet';
import { WarningBanner } from '../components/budgets/WarningBanner';
import { CardSkeleton } from '../components/ui/Skeleton';
import { useBudgets } from '../hooks/useBudgets';
import { useSummary } from '../hooks/useSummary';
import { useSettings } from '../hooks/useSettings';
import { formatMoney } from '../utils/money';
import { CATEGORIES } from '../utils/categories';
import { Sliders, ShieldCheck } from 'lucide-react';

export function Budgets() {
  const { currentMonth } = useOutletContext();
  const { settings } = useSettings();
  const { budgets, loading: budgetsLoading, saveBudgets } = useBudgets(currentMonth);
  const { summary, loading: summaryLoading } = useSummary(currentMonth);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const baseCurrency = settings.baseCurrency || 'INR';

  if (budgetsLoading && summaryLoading && !summary) {
    return (
      <div className="space-y-6">
        <CardSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  const monthlyBudget = budgets.monthlyBudget || 45000;
  const totalSpent = summary?.totalSpent || 0;
  const overallPercentage = monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0;

  const categoryLimits = budgets.categories || {};
  const categorySpends = {};
  (summary?.categoryBreakdown || []).forEach(c => {
    categorySpends[c.category] = c.amount;
  });

  const overBudget = [];
  const nearBudget = [];

  CATEGORIES.forEach(cat => {
    const limit = categoryLimits[cat.id] || 0;
    const spent = categorySpends[cat.id] || 0;
    if (limit > 0) {
      const pct = Math.round((spent / limit) * 100);
      if (pct >= 100) {
        overBudget.push({ category: cat.name, limit, spent, percentage: pct });
      } else if (pct >= 80) {
        nearBudget.push({ category: cat.name, limit, spent, percentage: pct });
      }
    }
  });

  return (
    <div className="space-y-6">
      <WarningBanner
        overBudget={overBudget}
        nearBudget={nearBudget}
        currency={baseCurrency}
      />

      <Card className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-8">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Monthly Envelope</span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
            {formatMoney(totalSpent, baseCurrency, 0)}
            <span className="text-xl text-slate-400 font-medium"> / {formatMoney(monthlyBudget, baseCurrency, 0)}</span>
          </h2>
          <p className="text-xs text-slate-500 max-w-sm">
            {monthlyBudget - totalSpent >= 0
              ? `${formatMoney(monthlyBudget - totalSpent, baseCurrency, 0)} safe reserve remaining for this cycle.`
              : `Budget exceeded by ${formatMoney(Math.abs(monthlyBudget - totalSpent), baseCurrency, 0)}.`}
          </p>

          <div className="pt-2">
            <Button size="sm" onClick={() => setIsEditOpen(true)} icon={Sliders}>
              Adjust Budgets
            </Button>
          </div>
        </div>

        <ConcentricBudgetRing
          percentage={overallPercentage}
          size={170}
          strokeWidth={14}
          label="Envelope"
          sublabel={`${Math.round(overallPercentage)}% Spent`}
        />
      </Card>

      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Category Allocations</h3>
          <span className="text-xs text-slate-400">{CATEGORIES.length} Active Buckets</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map(cat => {
            const limit = categoryLimits[cat.id] || 0;
            const spent = categorySpends[cat.id] || 0;
            return (
              <BudgetCard
                key={cat.id}
                category={cat.id}
                spent={spent}
                limit={limit}
                currency={baseCurrency}
              />
            );
          })}
        </div>
      </div>

      <BudgetEditSheet
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        budgets={budgets}
        onSave={saveBudgets}
      />
    </div>
  );
}
