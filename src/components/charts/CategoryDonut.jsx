import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatMoney } from '../../utils/money';
import { getCategoryById } from '../../utils/categories';
import { formatTimeCost } from '../../utils/timeCost';
import { useSettings } from '../../hooks/useSettings';
import { Sparkles } from 'lucide-react';

export function CategoryDonut({ categories = [], totalSpent = 0, currency = 'INR' }) {
  const { hourlyWage } = useSettings();

  if (!categories || categories.length === 0 || totalSpent === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-52 text-slate-400 text-xs">
        No expense data for this period
      </div>
    );
  }

  const data = categories.map(cat => {
    const meta = getCategoryById(cat.category);
    return {
      name: cat.category,
      value: cat.amount,
      percentage: cat.percentage,
      isBiggest: cat.isBiggest,
      color: meta.color,
    };
  });

  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div className="relative w-44 h-44 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              formatter={(value) => [formatMoney(value, currency, 0), 'Spent']}
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                borderRadius: '16px',
                border: 'none',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Pie
              data={data}
              innerRadius={50}
              outerRadius={68}
              paddingAngle={4}
              dataKey="value"
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke={entry.isBiggest ? '#fff' : 'transparent'}
                  strokeWidth={entry.isBiggest ? 2 : 0}
                  className={entry.isBiggest ? 'filter drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]' : ''}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total</span>
          <span className="text-sm font-extrabold text-slate-900 dark:text-white">
            {formatMoney(totalSpent, currency, 0)}
          </span>
        </div>
      </div>

      <div className="flex-1 w-full space-y-2.5">
        {data.slice(0, 4).map(item => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="font-semibold text-slate-700 dark:text-slate-200 truncate">{item.name}</span>
              {item.isBiggest && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  <Sparkles className="w-2.5 h-2.5" />
                  Biggest
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-slate-400 font-medium">{formatTimeCost(item.value, hourlyWage)}</span>
              <span className="font-bold text-slate-900 dark:text-white">{formatMoney(item.value, currency, 0)}</span>
              <span className="text-slate-400 w-8 text-right font-medium">{item.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
