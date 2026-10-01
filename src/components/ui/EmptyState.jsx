import React from 'react';
import { Button } from './Button';

export function EmptyState({ icon: Icon, title, description, actionText, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 py-12 rounded-[28px] glass-card border border-dashed border-slate-300 dark:border-slate-700">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
          <Icon className="w-7 h-7" />
        </div>
      )}
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">{title}</h3>
      {description && <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-1 mb-5">{description}</p>}
      {actionText && onAction && (
        <Button size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
