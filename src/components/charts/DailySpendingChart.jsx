import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { formatMoney } from '../../utils/money';

export function DailySpendingChart({ dailyTrend = [], peakDay = null, peakAmount = 0, currency = 'INR' }) {
  if (!dailyTrend || dailyTrend.length === 0) {
    return <div className="h-48 flex items-center justify-center text-xs text-slate-400">No daily records</div>;
  }

  const peakDayNum = peakDay ? parseInt(peakDay.split('-')[2], 10) : null;

  return (
    <div className="space-y-3">
      {peakDay && peakAmount > 0 && (
        <div className="flex items-center justify-between text-xs px-1">
          <span className="text-slate-500 dark:text-slate-400">Monthly Peak Day</span>
          <span className="font-bold text-amber-500">
            Day {peakDayNum} ({formatMoney(peakAmount, currency, 0)})
          </span>
        </div>
      )}

      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dailyTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="dayNumber"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: '#94A3B8' }}
              interval="preserveStartEnd"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: '#94A3B8' }}
              tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v)}
            />
            <Tooltip
              formatter={(value) => [formatMoney(value, currency, 0), 'Spent']}
              labelFormatter={(label) => `Day ${label}`}
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.92)',
                borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#3B82F6"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#spendGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
