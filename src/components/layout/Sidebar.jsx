import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  Shield,
  PieChart,
  Target,
  FileSpreadsheet,
  Settings,
  Plus,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function Sidebar({ onOpenAddExpense }) {
  const { user } = useAuth();

  const navItems = [
    { to: '/', label: 'Overview', icon: LayoutDashboard },
    { to: '/expenses', label: 'Expenses', icon: Receipt },
    { to: '/vault', label: 'Vault', icon: Shield },
    { to: '/insights', label: 'Insights', icon: PieChart },
    { to: '/budgets', label: 'Budgets', icon: Target },
    { to: '/import', label: 'Import', icon: FileSpreadsheet },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col justify-between w-64 h-screen sticky top-0 bg-white/70 dark:bg-slate-900/75 backdrop-blur-2xl border-r border-slate-200/80 dark:border-slate-800/80 p-5 z-20">
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <span className="text-xl font-black">₹</span>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">Kharcha</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mindful Wealth</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenAddExpense}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Log Expense</span>
        </button>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
        <NavLink
          to="/settings"
          className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-100/70 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs">
            {user?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.name || 'Ananya'}</p>
            <p className="text-[10px] text-slate-400 truncate">{user?.email || 'ananya@kharcha.app'}</p>
          </div>
        </NavLink>
      </div>
    </aside>
  );
}
