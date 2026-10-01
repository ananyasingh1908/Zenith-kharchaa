import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { MonthStoryCarousel } from '../components/insights/MonthStoryCarousel';
import { TimeCostCard } from '../components/insights/TimeCostCard';
import { MoodBar } from '../components/charts/MoodBar';
import { SpikeAlertsCard } from '../components/insights/SpikeAlertsCard';
import { DailySpendingChart } from '../components/charts/DailySpendingChart';
import { ForecastCard } from '../components/insights/ForecastCard';
import { ExpenseRow } from '../components/expenses/ExpenseRow';
import { CardSkeleton } from '../components/ui/Skeleton';
import { useSummary } from '../hooks/useSummary';
import { useSettings } from '../hooks/useSettings';
import { Trophy, TrendingUp } from 'lucide-react';

export function Insights() {
  const { currentMonth, onEditExpense, onDeleteExpense } = useOutletContext();
  const { settings } = useSettings();
  const { summary, loading } = useSummary(currentMonth);

  const baseCurrency = settings.baseCurrency || 'INR';

  if (loading && !summary) {
    return (
      <div className="space-y-6">
        <CardSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  const topThree = summary?.topExpenses?.slice(0, 3) || [];

  return (
    <div className="space-y-6">
      <MonthStoryCarousel summary={summary} currency={baseCurrency} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Daily Spending Curve</h4>
              </div>
            </div>

            <DailySpendingChart
              dailyTrend={summary?.dailyTrend || []}
              peakDay={summary?.peakDay}
              peakAmount={summary?.peakAmount || 0}
              currency={baseCurrency}
            />
          </Card>

          <Card className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Mindful Sentiment Spectrum</h4>
            <MoodBar
              moodCounts={summary?.moodCounts || {}}
              moodAmounts={summary?.moodAmounts || {}}
              currency={baseCurrency}
            />
          </Card>

          <TimeCostCard
            totalSpent={summary?.totalSpent || 0}
            currency={baseCurrency}
          />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <ForecastCard
            summary={summary}
            budget={settings.monthlyBudget || 45000}
            currency={baseCurrency}
          />

          <SpikeAlertsCard
            spikeAlerts={summary?.spikeAlerts || []}
            currency={baseCurrency}
          />

          <Card className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Trophy className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Top 3 Heavyweight Outflows</h4>
            </div>

            <div className="space-y-2">
              {topThree.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No expenses to rank</p>
              ) : (
                topThree.map(item => (
                  <ExpenseRow
                    key={item.id}
                    expense={item}
                    onEdit={onEditExpense}
                    onDelete={onDeleteExpense}
                  />
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
