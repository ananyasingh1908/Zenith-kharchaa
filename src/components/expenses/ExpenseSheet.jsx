import React, { useState, useEffect } from 'react';
import { Sheet } from '../ui/Sheet';
import { Button } from '../ui/Button';
import { CurrencyToggle } from '../ui/CurrencyToggle';
import { CATEGORIES } from '../../utils/categories';
import { parseQuickAdd } from '../../utils/parseQuickAdd';
import { formatTimeCost } from '../../utils/timeCost';
import { useSettings } from '../../hooks/useSettings';
import { Sparkles, Trash2, Shield, Smile, Meh, Frown, Calendar } from 'lucide-react';

export function ExpenseSheet({
  isOpen,
  onClose,
  initialExpense = null,
  onSave,
  onDelete,
  onMoveToVault,
}) {
  const { settings, hourlyWage } = useSettings();
  const defaultCurrency = settings.baseCurrency || 'INR';

  const [quickText, setQuickText] = useState('');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState(defaultCurrency);
  const [category, setCategory] = useState('Food & Dining');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [mood, setMood] = useState('worth');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialExpense) {
      setTitle(initialExpense.title || '');
      setAmount(initialExpense.amount || '');
      setCurrency(initialExpense.currency || defaultCurrency);
      setCategory(initialExpense.category || 'Food & Dining');
      setDate(initialExpense.date ? initialExpense.date.split('T')[0] : new Date().toISOString().split('T')[0]);
      setMood(initialExpense.mood || 'worth');
      setNote(initialExpense.note || '');
      setQuickText('');
    } else {
      setTitle('');
      setAmount('');
      setCurrency(defaultCurrency);
      setCategory('Food & Dining');
      setDate(new Date().toISOString().split('T')[0]);
      setMood('worth');
      setNote('');
      setQuickText('');
    }
    setErrors({});
  }, [initialExpense, isOpen, defaultCurrency]);

  const handleQuickAddChange = (e) => {
    const val = e.target.value;
    setQuickText(val);
    const parsed = parseQuickAdd(val, currency);
    if (parsed.title) setTitle(parsed.title);
    if (parsed.amount) setAmount(parsed.amount);
    if (parsed.currency) setCurrency(parsed.currency);
    if (parsed.category) setCategory(parsed.category);
  };

  const parsedQuick = parseQuickAdd(quickText, currency);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!amount || Number(amount) <= 0) errs.amount = 'Amount must be greater than 0';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    onSave({
      id: initialExpense?.id,
      title: title.trim(),
      amount: Number(amount),
      currency,
      category,
      date: new Date(date).toISOString(),
      mood,
      note: note.trim(),
    });
    onClose();
  };

  const handleMoveToVault = () => {
    if (onMoveToVault && amount && title) {
      onMoveToVault({
        name: title.trim(),
        price: Number(amount),
        currency,
      });
      onClose();
    }
  };

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title={initialExpense ? 'Edit Expense' : 'Log Expense'}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {!initialExpense && (
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              Smart Quick-Add
            </label>
            <input
              type="text"
              value={quickText}
              onChange={handleQuickAddChange}
              placeholder="e.g. chai 40, uber to airport 450, netflix $9"
              className="w-full px-4 py-2.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            {parsedQuick.isValid && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                <span>Detected:</span>
                <span className="font-bold">{parsedQuick.title}</span>
                <span>•</span>
                <span>{currency === 'INR' ? '₹' : '$'}{parsedQuick.amount}</span>
                <span>•</span>
                <span>{parsedQuick.category}</span>
              </div>
            )}
          </div>
        )}

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Amount</label>
              <div className="relative mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-400">
                  {currency === 'INR' ? '₹' : '$'}
                </span>
                <input
                  type="number"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full text-3xl font-black bg-transparent text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 focus:outline-none"
                  autoFocus={!initialExpense}
                />
              </div>
              {errors.amount && <p className="text-xs text-rose-500 font-semibold mt-1">{errors.amount}</p>}
            </div>

            <CurrencyToggle
              amount={Number(amount)}
              currency={currency}
              onChangeCurrency={setCurrency}
            />
          </div>

          {amount > 0 && (
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs font-medium text-slate-500">
              <span>Life Cost Lens</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {formatTimeCost(amount, hourlyWage)} of your work
              </span>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What was this expense for?"
            className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          {errors.title && <p className="text-xs text-rose-500 font-semibold">{errors.title}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Category</label>
          <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto no-scrollbar p-1">
            {CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  category === cat.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-105'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Mood Feeling</label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setMood('worth')}
                className={`p-2 rounded-xl flex items-center justify-center gap-1 text-xs font-bold transition-all ${
                  mood === 'worth'
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Smile className="w-4 h-4" /> Worth
              </button>
              <button
                type="button"
                onClick={() => setMood('meh')}
                className={`p-2 rounded-xl flex items-center justify-center gap-1 text-xs font-bold transition-all ${
                  mood === 'meh'
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Meh className="w-4 h-4" /> Meh
              </button>
              <button
                type="button"
                onClick={() => setMood('regret')}
                className={`p-2 rounded-xl flex items-center justify-center gap-1 text-xs font-bold transition-all ${
                  mood === 'regret'
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Frown className="w-4 h-4" /> Regret
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Note (Optional)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add context, place, or friend..."
            className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {initialExpense && onDelete && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  onDelete(initialExpense);
                  onClose();
                }}
                icon={Trash2}
              >
                Delete
              </Button>
            )}
            {!initialExpense && onMoveToVault && amount > 0 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleMoveToVault}
                icon={Shield}
              >
                Move to Vault instead
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialExpense ? 'Save Changes' : 'Record Expense'}
            </Button>
          </div>
        </div>
      </form>
    </Sheet>
  );
}
