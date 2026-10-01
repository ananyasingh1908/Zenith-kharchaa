import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, Plus, Shield, PieChart } from 'lucide-react';

export function BottomNav({ onOpenAddExpense }) {
  return (
    <div className="md:hidden fixed bottom-4 left-4 right-4 z-40">
      <div className="glass-nav rounded-[24px] shadow-2xl border border-white/40 dark:border-white/10 px-3 py-2 flex items-center justify-around">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 p-1.5 rounded-xl transition-colors ${
              isActive ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-400'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </NavLink>

        <NavLink
          to="/expenses"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 p-1.5 rounded-xl transition-colors ${
              isActive ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-400'
            }`
          }
        >
          <Receipt className="w-5 h-5" />
          <span className="text-[10px]">Expenses</span>
        </NavLink>

        <button
          type="button"
          onClick={onOpenAddExpense}
          className="relative -top-4 w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/40 active:scale-95 transition-transform"
          aria-label="Add new expense"
        >
          <Plus className="w-6 h-6" />
        </button>

        <NavLink
          to="/vault"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 p-1.5 rounded-xl transition-colors ${
              isActive ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-400'
            }`
          }
        >
          <Shield className="w-5 h-5" />
          <span className="text-[10px]">Vault</span>
        </NavLink>

        <NavLink
          to="/insights"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 p-1.5 rounded-xl transition-colors ${
              isActive ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-400'
            }`
          }
        >
          <PieChart className="w-5 h-5" />
          <span className="text-[10px]">Insights</span>
        </NavLink>
      </div>
    </div>
  );
}
