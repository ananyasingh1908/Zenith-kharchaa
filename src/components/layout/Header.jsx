import React from 'react';
import { ChevronLeft, ChevronRight, Sun, Moon, Calendar } from 'lucide-react';
import { formatMonthDisplay, getPreviousMonthKey, getNextMonthKey } from '../../utils/dates';
import { useSettings } from '../../hooks/useSettings';

export function Header({ currentMonth, onMonthChange, title, showMonthPicker = true }) {
  const { settings, updateSettings } = useSettings();
  const isDark = settings.appearance === 'dark';

  const toggleDarkMode = () => {
    updateSettings({ appearance: isDark ? 'light' : 'dark' });
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-4 md:px-8 py-4 bg-[#F6F8FB]/80 dark:bg-[#090D16]/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
      <div className="flex items-center gap-3">
        {title && <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h2>}

        {showMonthPicker && currentMonth && (
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <button
              type="button"
              onClick={() => onMonthChange(getPreviousMonthKey(currentMonth))}
              className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-lg transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5 px-2 text-xs font-extrabold text-slate-800 dark:text-slate-200">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              <span>{formatMonthDisplay(currentMonth)}</span>
            </div>

            <button
              type="button"
              onClick={() => onMonthChange(getNextMonthKey(currentMonth))}
              className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-lg transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleDarkMode}
          className="p-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 shadow-sm transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
