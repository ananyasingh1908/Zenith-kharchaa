import React, { useState } from 'react';
import { Sheet } from '../ui/Sheet';
import { Button } from '../ui/Button';
import { CurrencyToggle } from '../ui/CurrencyToggle';
import { formatTimeCost } from '../../utils/timeCost';
import { useSettings } from '../../hooks/useSettings';
import { Shield, Clock } from 'lucide-react';

export function VaultAddModal({ isOpen, onClose, onAdd, initialDraft = null }) {
  const { settings, hourlyWage } = useSettings();
  const defaultCurrency = settings.baseCurrency || 'INR';

  const [name, setName] = useState(initialDraft?.name || '');
  const [price, setPrice] = useState(initialDraft?.price || '');
  const [currency, setCurrency] = useState(initialDraft?.currency || defaultCurrency);
  const [durationDays, setDurationDays] = useState(7);
  const [errors, setErrors] = useState({});

  const durationOptions = [
    { label: '48 Hours', days: 2 },
    { label: '7 Days', days: 7 },
    { label: '30 Days', days: 30 },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!name.trim()) errs.name = 'Item name is required';
    if (!price || Number(price) <= 0) errs.price = 'Price must be greater than 0';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    onAdd({
      name: name.trim(),
      price: Number(price),
      currency,
      durationDays,
    });
    setName('');
    setPrice('');
    onClose();
  };

  return (
    <Sheet isOpen={isOpen} onClose={onClose} title="Park in Mindful Vault">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex items-center gap-3">
          <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <p className="text-xs text-slate-700 dark:text-slate-300">
            Pause impulsive spending. If you still want this after the cooling-off period, purchase with absolute peace of mind.
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Item Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sony WH-1000XM5, Mechanical Keyboard"
            className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            autoFocus
          />
          {errors.name && <p className="text-xs text-rose-500 font-semibold">{errors.name}</p>}
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Price</label>
              <div className="relative mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-400">
                  {currency === 'INR' ? '₹' : '$'}
                </span>
                <input
                  type="number"
                  step="any"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0"
                  className="w-full text-3xl font-black bg-transparent text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 focus:outline-none"
                />
              </div>
              {errors.price && <p className="text-xs text-rose-500 font-semibold mt-1">{errors.price}</p>}
            </div>

            <CurrencyToggle
              amount={Number(price)}
              currency={currency}
              onChangeCurrency={setCurrency}
            />
          </div>

          {price > 0 && (
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs font-medium text-slate-500">
              <span>Life Cost Lens</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {formatTimeCost(price, hourlyWage)} of your work
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Cooling-off Period
          </label>
          <div className="grid grid-cols-3 gap-2">
            {durationOptions.map((opt) => (
              <button
                type="button"
                key={opt.days}
                onClick={() => setDurationDays(opt.days)}
                className={`p-3 rounded-2xl text-xs font-bold text-center border transition-all ${
                  durationDays === opt.days
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25'
                    : 'bg-slate-100 dark:bg-slate-800 border-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Park in Vault
          </Button>
        </div>
      </form>
    </Sheet>
  );
}
