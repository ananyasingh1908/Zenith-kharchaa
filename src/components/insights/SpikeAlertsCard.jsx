import React from 'react';
import { Card } from '../ui/Card';
import { Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { formatMoney } from '../../utils/money';

export function SpikeAlertsCard({ spikeAlerts = [], currency = 'INR' }) {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Spike Detection Intelligence</h4>
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {spikeAlerts.length} Active
        </span>
      </div>

      {spikeAlerts.length === 0 ? (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
          <div className="text-xs">
            <p className="font-bold">Smooth spending rhythm</p>
            <p className="text-emerald-600/80 dark:text-emerald-400/80">
              No categories have exceeded historical pacing velocity this month.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {spikeAlerts.map((spike) => (
            <div
              key={spike.category}
              className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3"
            >
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-xs space-y-0.5">
                <p className="font-bold text-slate-900 dark:text-white">{spike.category} Velocity Alert</p>
                <p className="text-slate-600 dark:text-slate-300">{spike.message}</p>
                <p className="text-[11px] text-slate-400">
                  Current: {formatMoney(spike.currentSpend, currency, 0)} • Past Avg: {formatMoney(spike.pastAverage, currency, 0)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
