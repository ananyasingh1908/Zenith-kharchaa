import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

export function ErrorState({ message = 'An unexpected error occurred', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 rounded-[28px] glass-card border border-rose-200 dark:border-rose-900/40">
      <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Unable to load data</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 mb-4">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} icon={RotateCcw}>
          Try Again
        </Button>
      )}
    </div>
  );
}
