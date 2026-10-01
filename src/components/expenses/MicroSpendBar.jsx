import React, { useState } from 'react';
import { Zap, Plus, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useSettings } from '../../hooks/useSettings';
import { formatMoney } from '../../utils/money';

export function MicroSpendBar({ onLogExpense, onUndoExpense }) {
  const { settings } = useSettings();
  const { showToast } = useToast();
  const [customAmount, setCustomAmount] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const currency = settings.baseCurrency || 'INR';

  const amounts = currency === 'INR' ? [10, 20, 50, 100] : [1, 2, 5, 10];

  const handleQuickSpend = async (amt) => {
    const amountVal = Number(amt);
    if (!amountVal || amountVal <= 0) return;

    const logged = await onLogExpense({
      title: 'Quick spend',
      amount: amountVal,
      currency,
      category: 'Micro-spends',
      mood: 'worth',
      date: new Date().toISOString(),
      note: 'One-tap micro spend',
    });

    setCustomAmount('');
    setShowCustomInput(false);

    showToast({
      message: `Logged ${formatMoney(amountVal, currency, 0)} Quick spend`,
      type: 'success',
      actionText: 'Undo',
      duration: 5000,
      onAction: () => {
        if (logged?.id && onUndoExpense) {
          onUndoExpense(logged.id);
        }
      },
    });
  };

  return (
    <div className="flex items-center gap-2 p-2 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 shadow-glass overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-1 pl-2 pr-1 text-xs font-extrabold text-amber-500 shrink-0">
        <Zap className="w-4 h-4" />
        <span className="hidden sm:inline">Micro-spend</span>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {amounts.map((amt) => (
          <button
            key={amt}
            type="button"
            onClick={() => handleQuickSpend(amt)}
            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 transition-all active:scale-95 shadow-sm"
          >
            {currency === 'INR' ? `₹${amt}` : `$${amt}`}
          </button>
        ))}

        {!showCustomInput ? (
          <button
            type="button"
            onClick={() => setShowCustomInput(true)}
            className="px-2.5 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleQuickSpend(customAmount);
            }}
            className="flex items-center gap-1"
          >
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="Amount"
              className="w-16 px-2 py-1 text-xs font-bold rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="p-1 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
