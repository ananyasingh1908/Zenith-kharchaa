import React from 'react';

export function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-slate-200/80 dark:bg-slate-800/80 rounded-xl ${className}`} />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-[28px] glass-card p-6 space-y-4">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-4 w-full" />
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-5 w-20" />
    </div>
  );
}
