import React from 'react';
import { Card } from '../ui/Card';
import { useSettings } from '../../hooks/useSettings';
import { formatMoney } from '../../utils/money';
import { formatTimeCost } from '../../utils/timeCost';
import { Hourglass, Coffee, Pizza, Plane, Sparkles } from 'lucide-react';

export function TimeCostCard({ totalSpent = 0, currency = 'INR' }) {
  const { settings, hourlyWage } = useSettings();
  const baseCurrency = settings.baseCurrency || 'INR';

  const totalHours = totalSpent > 0 ? (totalSpent / hourlyWage).toFixed(1) : '0';
  const totalDaysWork = (totalSpent / (hourlyWage * 8)).toFixed(1);

  const equivalents = [
    {
      name: 'Masala Chai',
      cost: 40,
      icon: Coffee,
      color: '#F97316',
    },
    {
      name: 'Artisan Pizza Dinner',
      cost: 650,
      icon: Pizza,
      color: '#EC4899',
    },
    {
      name: 'Weekend Getaway',
      cost: 12000,
      icon: Plane,
      color: '#0EA5E9',
    },
  ];

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Hourglass className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Life Cost Lens</h4>
        </div>
        <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 rounded-full border border-purple-200/50">
          ₹{Math.round(hourlyWage)}/hr
        </span>
      </div>

      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-transparent border border-purple-500/20 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Work Required</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
            {totalHours} <span className="text-sm font-semibold text-slate-500">hours</span>
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Equivalent to ~{totalDaysWork} full standard 8h workdays
          </p>
        </div>
        <Sparkles className="w-8 h-8 text-purple-400 opacity-60" />
      </div>

      <div className="space-y-2 pt-1">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Real-World Equivalents</span>
        <div className="grid grid-cols-3 gap-2">
          {equivalents.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center"
              >
                <div className="w-7 h-7 rounded-lg mx-auto flex items-center justify-center mb-1.5" style={{ color: item.color, backgroundColor: `${item.color}15` }}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200 truncate">{item.name}</p>
                <p className="text-xs font-black text-slate-900 dark:text-white mt-0.5">
                  {formatTimeCost(item.cost, hourlyWage)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
