import React, { useState, useMemo } from 'react';
import { ExpenseRow } from './ExpenseRow';
import { EmptyState } from '../ui/EmptyState';
import { formatMoney } from '../../utils/money';
import { groupByDate } from '../../utils/dates';
import { CATEGORIES } from '../../utils/categories';
import { useSettings } from '../../hooks/useSettings';
import { Search, SlidersHorizontal, ArrowDownUp, Receipt } from 'lucide-react';

export function ExpenseList({
  expenses = [],
  onEdit,
  onDelete,
  onAddNew,
}) {
  const { settings, hourlyWage } = useSettings();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  const filtered = useMemo(() => {
    let list = [...expenses];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        e =>
          (e.title && e.title.toLowerCase().includes(q)) ||
          (e.note && e.note.toLowerCase().includes(q)) ||
          (e.category && e.category.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== 'all') {
      list = list.filter(e => e.category === selectedCategory);
    }

    if (sortOrder === 'highest') {
      list.sort((a, b) => (Number(b.amountBase) || 0) - (Number(a.amountBase) || 0));
    } else {
      list.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
    }

    return list;
  }, [expenses, search, selectedCategory, sortOrder]);

  const totalAmount = useMemo(() => {
    return filtered.reduce((sum, e) => sum + (Number(e.amountBase) || 0), 0);
  }, [filtered]);

  const totalHours = (totalAmount / hourlyWage).toFixed(1);
  const grouped = useMemo(() => groupByDate(filtered), [filtered]);
  const baseCurrency = settings.baseCurrency || 'INR';

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search expenses, notes, categories..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setSortOrder(prev => (prev === 'newest' ? 'highest' : 'newest'))}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowDownUp className="w-3.5 h-3.5" />
            <span>{sortOrder === 'newest' ? 'Newest' : 'Highest'}</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white/60 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
          }`}
        >
          All Categories
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white/60 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 text-xs text-slate-600 dark:text-slate-300">
        <span className="font-semibold">{filtered.length} entries</span>
        <div className="flex items-center gap-3">
          <span>Life Cost: <strong className="text-blue-600 dark:text-blue-400">{totalHours} hrs</strong></span>
          <span>Total: <strong className="text-slate-900 dark:text-white">{formatMoney(totalAmount, baseCurrency, 0)}</strong></span>
        </div>
      </div>

      {grouped.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No expenses found"
          description="Try clearing search filters or log a new transaction."
          actionText={onAddNew ? "Add New Expense" : undefined}
          onAction={onAddNew}
        />
      ) : (
        <div className="space-y-6">
          {grouped.map(group => (
            <div key={group.date} className="space-y-2">
              <div className="sticky top-16 z-10 py-1 px-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-[#F6F8FB]/90 dark:bg-[#090D16]/90 backdrop-blur-md rounded-lg">
                {group.label}
              </div>

              <div className="space-y-2">
                {group.items.map(item => (
                  <ExpenseRow
                    key={item.id}
                    expense={item}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
