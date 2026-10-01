import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { CountdownRing } from '../charts/CountdownRing';
import { formatMoney } from '../../utils/money';
import { formatTimeCost } from '../../utils/timeCost';
import { useSettings } from '../../hooks/useSettings';
import { Lock, CheckCircle2, Sparkles, HeartHandshake, ShoppingBag } from 'lucide-react';

export function VaultCard({ item, onBuy, onRelease }) {
  const { hourlyWage } = useSettings();
  const now = Date.now();
  const isUnlockPast = new Date(item.unlockAt).getTime() <= now;
  const isReady = item.status === 'ready' || (item.status === 'locked' && isUnlockPast);
  const isBought = item.status === 'bought';
  const isReleased = item.status === 'released';

  const unlockDate = new Date(item.unlockAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <Card
      className={`relative overflow-hidden transition-all ${
        isReady && !isBought && !isReleased
          ? 'ring-2 ring-emerald-500/40 shadow-glow-green bg-gradient-to-b from-emerald-500/5 to-transparent'
          : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <CountdownRing
            createdAt={item.createdAt}
            unlockAt={item.unlockAt}
            isReady={isReady}
          />

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-slate-900 dark:text-white truncate">{item.name}</h4>
              {isReady && !isBought && !isReleased && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-sm">
                  <Sparkles className="w-2.5 h-2.5" />
                  Ready to decide
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 mt-0.5">
              {item.durationDays}-day mindful pause • Cooldown until {unlockDate}
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <p className="text-lg font-black text-slate-900 dark:text-white">
            {formatMoney(item.price, item.currency, 0)}
          </p>
          <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
            {formatTimeCost(item.priceBase || item.price, hourlyWage)}
          </p>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        {isBought ? (
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400">
            <CheckCircle2 className="w-4 h-4" /> Purchased with clarity
          </div>
        ) : isReleased ? (
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <HeartHandshake className="w-4 h-4" /> Saved by patience!
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onRelease(item.id)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            >
              Let it go
            </button>

            <Button
              size="sm"
              disabled={!isReady}
              onClick={() => onBuy(item.id)}
              icon={isReady ? ShoppingBag : Lock}
              variant={isReady ? 'success' : 'secondary'}
            >
              {isReady ? 'I still want it' : 'Locked cooldown'}
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}
