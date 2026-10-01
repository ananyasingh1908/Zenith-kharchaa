import React, { useState, useEffect } from 'react';
import { Sheet } from '../ui/Sheet';
import { Button } from '../ui/Button';
import { CATEGORIES } from '../../utils/categories';
import { useSettings } from '../../hooks/useSettings';
import { formatMoney } from '../../utils/money';

export function BudgetEditSheet({ isOpen, onClose, budgets, onSave }) {
  const { settings } = useSettings();
  const currency = settings.baseCurrency || 'INR';

  const [monthlyBudget, setMonthlyBudget] = useState(budgets?.monthlyBudget || 45000);
  const [categories, setCategories] = useState(budgets?.categories || {});

  useEffect(() => {
    if (budgets) {
      setMonthlyBudget(budgets.monthlyBudget || 45000);
      setCategories(budgets.categories || {});
    }
  }, [budgets, isOpen]);

  const handleCategoryChange = (catId, val) => {
    setCategories(prev => ({
      ...prev,
      [catId]: Number(val) || 0,
    }));
  };

  const handleDistributeRecommended = () => {
    const total = Number(monthlyBudget) || 45000;
    const distributed = {};
    CATEGORIES.forEach(cat => {
      distributed[cat.id] = Math.round((total * (cat.budgetPercent || 0)) / 100);
    });
    setCategories(distributed);
  };

  const totalAllocated = Object.values(categories).reduce((sum, v) => sum + (Number(v) || 0), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      monthlyBudget: Number(monthlyBudget),
      categories,
    });
    onClose();
  };

  return (
    <Sheet isOpen={isOpen} onClose={onClose} title="Configure Spending Caps">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Monthly Spending Cap
          </label>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-slate-400">
              {currency === 'INR' ? '₹' : '$'}
            </span>
            <input
              type="number"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
              className="text-2xl font-black w-full bg-transparent text-slate-900 dark:text-white focus:outline-none"
            />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-blue-100 dark:border-blue-900/30">
            <span>Allocated: {formatMoney(totalAllocated, currency, 0)}</span>
            <button
              type="button"
              onClick={handleDistributeRecommended}
              className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Auto-Distribute
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Category Allocations
          </label>
          <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar p-1">
            {CATEGORIES.map(cat => (
              <div
                key={cat.id}
                className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
              >
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                  {cat.name}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-xs font-bold text-slate-400">
                    {currency === 'INR' ? '₹' : '$'}
                  </span>
                  <input
                    type="number"
                    value={categories[cat.id] ?? ''}
                    onChange={(e) => handleCategoryChange(cat.id, e.target.value)}
                    placeholder="0"
                    className="w-24 px-2 py-1 text-right text-xs font-bold rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Save Budgets
          </Button>
        </div>
      </form>
    </Sheet>
  );
}
