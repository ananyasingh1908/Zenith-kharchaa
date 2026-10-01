import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { VelocityGauge } from '../components/charts/VelocityGauge';
import { CategoryDonut } from '../components/charts/CategoryDonut';
import { ExpenseRow } from '../components/expenses/ExpenseRow';
import { MicroSpendBar } from '../components/expenses/MicroSpendBar';
import { SpikeAlertsCard } from '../components/insights/SpikeAlertsCard';
import { CardSkeleton } from '../components/ui/Skeleton';
import { useSummary } from '../hooks/useSummary';
import { useExpenses } from '../hooks/useExpenses';
import { useSettings } from '../hooks/useSettings';
import { formatMoney } from '../utils/money';
import { TrendingUp, TrendingDown, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export function Home() {
  const { currentMonth, onOpenAddExpense, onEditExpense, onDeleteExpense } = useOutletContext();
  const { settings } = useSettings();
  const { summary, loading: summaryLoading, refresh: refreshSummary } = useSummary(currentMonth);
  const { expenses, loading: expensesLoading, addExpense, removeExpense } = useExpenses({ month: currentMonth });

  const baseCurrency = settings.baseCurrency || 'INR';
  const recentExpenses = expenses.slice(0, 5);

  const handleMicroSpend = async (data) => {
    const res = await addExpense(data);
    refreshSummary();
    return res;
  };

  const handleUndoMicroSpend = async (id) => {
    await removeExpense(id);
    refreshSummary();
  };

  if (summaryLoading && !summary) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <CardSkeleton className="md:col-span-6" />
          <CardSkeleton className="md:col-span-6" />
        </div>
      </div>
    );
  }

  const isSpendUp = (summary?.changePercent || 0) > 0;

  return (
    <div className="space-y-6 pb-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <Card className="lg:col-span-6 flex flex-col justify-between p-6 md:p-8 bg-gradient-to-br from-blue-600/10 via-transparent to-transparent">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Month Outflow</span>
              {summary?.prevTotalSpent > 0 && (
                <div
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    isSpendUp
                      ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400'
                      : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
                  }`}
                >
                  {isSpendUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  <span>{Math.abs(summary.changePercent)}% vs last month</span>
                </div>
              )}
            </div>

            <div className="pt-2">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                {formatMoney(summary?.totalSpent || 0, baseCurrency, 0)}
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Across {summary?.count || 0} expenses recorded this month
              </p>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Monthly Budget</span>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {formatMoney(settings.monthlyBudget || 45000, baseCurrency, 0)}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Time Cost</span>
              <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                {summary?.totalHours || '0'} hrs
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenAddExpense}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/25 hover:bg-blue-500 transition-all"
            >
              + Add Expense
            </button>
          </div>
        </Card>

        <Card className="lg:col-span-6 flex flex-col items-center justify-center p-6">
          <VelocityGauge
            safeToday={summary?.safeToday || 0}
            spentToday={summary?.spentToday || 0}
            velocityStatus={summary?.velocityStatus || 'green'}
            runOutDay={summary?.runOutDay}
            currency={baseCurrency}
            projectedMonthTotal={summary?.projectedMonthTotal || 0}
          />
        </Card>
      </div>

      <div className="w-full">
        <MicroSpendBar
          onLogExpense={handleMicroSpend}
          onUndoExpense={handleUndoMicroSpend}
        />
      </div>

      {summary?.spikeAlerts && summary.spikeAlerts.length > 0 && (
        <SpikeAlertsCard
          spikeAlerts={summary.spikeAlerts}
          currency={baseCurrency}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Category Distribution</h3>
            <Link to="/insights" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
              Deep Dive
            </Link>
          </div>

          <CategoryDonut
            categories={summary?.categoryBreakdown || []}
            totalSpent={summary?.totalSpent || 0}
            currency={baseCurrency}
          />
        </Card>

        <Card className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
            <Link
              to="/expenses"
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2">
            {recentExpenses.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No expenses logged for this month yet.
              </div>
            ) : (
              recentExpenses.map((exp) => (
                <ExpenseRow
                  key={exp.id}
                  expense={exp}
                  onEdit={onEditExpense}
                  onDelete={onDeleteExpense}
                />
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
