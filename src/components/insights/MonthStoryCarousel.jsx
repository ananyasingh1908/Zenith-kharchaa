import React from 'react';
import { formatMoney } from '../../utils/money';
import { Sparkles, TrendingUp, Calendar, Frown, Award } from 'lucide-react';

export function MonthStoryCarousel({ summary, currency = 'INR' }) {
  if (!summary) return null;

  const topCategory = summary.categoryBreakdown?.[0];
  const biggestRegret = summary.biggestRegret;

  const stories = [
    {
      id: 'total',
      icon: Award,
      tag: 'Monthly Flow',
      title: `${formatMoney(summary.totalSpent, currency, 0)} Total Outflow`,
      desc: `Across ${summary.count} expenses recorded this month with an average daily burn of ${formatMoney(Math.round(summary.totalSpent / (summary.daysElapsed || 1)), currency, 0)}.`,
      gradient: 'from-blue-600 to-indigo-700 text-white',
    },
    {
      id: 'top-category',
      icon: TrendingUp,
      tag: 'Heavyweight Sector',
      title: `${topCategory?.category || 'Lifestyle'} took ${topCategory?.percentage || 0}%`,
      desc: `${topCategory?.category || 'Top category'} consumed ${formatMoney(topCategory?.amount || 0, currency, 0)}, making it your largest financial bucket.`,
      gradient: 'from-purple-600 to-pink-600 text-white',
    },
    {
      id: 'peak-day',
      icon: Calendar,
      tag: 'Spike Occurrence',
      title: `Peak Spend on Day ${summary.peakDay ? parseInt(summary.peakDay.split('-')[2], 10) : '-'}`,
      desc: `You logged ${formatMoney(summary.peakAmount || 0, currency, 0)} in a single 24-hour cycle.`,
      gradient: 'from-amber-500 to-orange-600 text-white',
    },
    {
      id: 'regret',
      icon: Frown,
      tag: 'Mindful Retrospective',
      title: biggestRegret ? `${formatMoney(biggestRegret.amount, currency, 0)} Impulsive Spend` : 'Zero Regrets Reported!',
      desc: biggestRegret
        ? `"${biggestRegret.title}" was marked as regret. Reflect on its value before similar purchases.`
        : 'All expenses marked as worth it or acceptable this cycle. Exceptional discipline!',
      gradient: 'from-rose-600 to-red-700 text-white',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5 px-1">
        <Sparkles className="w-4 h-4 text-blue-500" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Month Story Highlights</h3>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory py-2 -mx-2 px-2">
        {stories.map((story) => {
          const Icon = story.icon;
          return (
            <div
              key={story.id}
              className={`snap-center shrink-0 w-72 md:w-80 p-6 rounded-[28px] bg-gradient-to-br ${story.gradient} shadow-lg flex flex-col justify-between h-44`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md">
                  {story.tag}
                </span>
                <Icon className="w-5 h-5 opacity-80" />
              </div>

              <div>
                <h4 className="text-lg font-black tracking-tight leading-snug">{story.title}</h4>
                <p className="text-xs text-white/80 line-clamp-2 mt-1">{story.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
