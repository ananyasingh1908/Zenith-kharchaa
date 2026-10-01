import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useSettings } from '../hooks/useSettings';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';
import { mockStore } from '../api/mockStore';
import { exportExpensesToCSV } from '../utils/csv';
import {
  User,
  DollarSign,
  Briefcase,
  Moon,
  Download,
  Trash2,
  LogOut,
  ShieldCheck,
  Check,
} from 'lucide-react';

export function Settings() {
  const navigate = useNavigate();
  const { settings, updateSettings, hourlyWage } = useSettings();
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const [baseCurrency, setBaseCurrency] = useState(settings.baseCurrency || 'INR');
  const [usdRate, setUsdRate] = useState(settings.usdRate || 83);
  const [incomeType, setIncomeType] = useState(settings.incomeType || 'monthly');
  const [monthlyIncome, setMonthlyIncome] = useState(settings.monthlyIncome || 150000);
  const [hourlyWageInput, setHourlyWageInput] = useState(settings.hourlyWage || 937.5);
  const [appearance, setAppearance] = useState(settings.appearance || 'light');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    await updateSettings({
      baseCurrency,
      usdRate: Number(usdRate),
      incomeType,
      monthlyIncome: Number(monthlyIncome),
      hourlyWage: incomeType === 'hourly' ? Number(hourlyWageInput) : Number(monthlyIncome) / 160,
      appearance,
    });
    setSaved(true);
    showToast({ message: 'Settings saved and currency recalculated', type: 'success' });
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExportCSV = () => {
    const expenses = mockStore.getExpenses();
    exportExpensesToCSV(expenses, `kharcha_export_${Date.now()}.csv`);
    showToast({ message: 'Expenses exported to CSV', type: 'success' });
  };

  const handleClearAllData = () => {
    mockStore.clearAll();
    setShowClearConfirm(false);
    showToast({ message: 'All local data has been reset to defaults', type: 'info' });
    window.location.reload();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card className="flex items-center gap-4 p-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/25">
          {user?.name?.[0]?.toUpperCase() || 'A'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">{user?.name || 'Ananya'}</h3>
          <p className="text-xs text-slate-400 truncate">{user?.email || 'ananya@kharcha.app'}</p>
          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 mt-1">
            Mindful Spender
          </span>
        </div>
      </Card>

      <form onSubmit={handleSavePreferences} className="space-y-6">
        <Card className="space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <DollarSign className="w-4 h-4 text-blue-500" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Currency & Valuation</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Base Currency</label>
              <select
                value={baseCurrency}
                onChange={(e) => setBaseCurrency(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                <option value="INR">₹ Indian Rupee (INR)</option>
                <option value="USD">$ US Dollar (USD)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">USD to INR Exchange Rate</label>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">1 USD =</span>
                <input
                  type="number"
                  step="0.1"
                  value={usdRate}
                  onChange={(e) => setUsdRate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Briefcase className="w-4 h-4 text-blue-500" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Time Cost Lens Calibration</h4>
          </div>

          <div className="space-y-4">
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
              <button
                type="button"
                onClick={() => setIncomeType('monthly')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  incomeType === 'monthly'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                Monthly Income
              </button>
              <button
                type="button"
                onClick={() => setIncomeType('hourly')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  incomeType === 'hourly'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                Hourly Wage
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {incomeType === 'monthly' ? 'Monthly In-Hand Net Salary' : 'Hourly Wage Rate'}
              </label>
              <input
                type="number"
                value={incomeType === 'monthly' ? monthlyIncome : hourlyWageInput}
                onChange={(e) =>
                  incomeType === 'monthly'
                    ? setMonthlyIncome(e.target.value)
                    : setHourlyWageInput(e.target.value)
                }
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            <p className="text-xs text-slate-400">
              Current calculated hourly rate: <strong className="text-blue-600 dark:text-blue-400">₹{Math.round(hourlyWage)} / hr</strong>
            </p>
          </div>
        </Card>

        <Card className="space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Moon className="w-4 h-4 text-blue-500" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Appearance & Theme</h4>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'light', label: 'Light' },
              { id: 'dark', label: 'Dark' },
              { id: 'auto', label: 'System Auto' },
            ].map(theme => (
              <button
                type="button"
                key={theme.id}
                onClick={() => setAppearance(theme.id)}
                className={`p-3 rounded-2xl text-xs font-bold text-center border transition-all ${
                  appearance === theme.id
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                {theme.label}
              </button>
            ))}
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" icon={saved ? Check : undefined}>
            {saved ? 'Changes Saved!' : 'Save Preferences'}
          </Button>
        </div>
      </form>

      <Card className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <ShieldCheck className="w-4 h-4 text-blue-500" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Data Governance</h4>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Export Raw Transactions</p>
            <p className="text-[11px] text-slate-400">Download complete ledger in universal CSV format.</p>
          </div>
          <Button size="sm" variant="secondary" onClick={handleExportCSV} icon={Download}>
            Export CSV
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div>
            <p className="text-xs font-bold text-rose-600">Reset Local Storage</p>
            <p className="text-[11px] text-slate-400">Purge local cache and reset initial seed data.</p>
          </div>
          {!showClearConfirm ? (
            <Button size="sm" variant="outline" onClick={() => setShowClearConfirm(true)} icon={Trash2}>
              Clear Data
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1"
              >
                Cancel
              </button>
              <Button size="sm" variant="danger" onClick={handleClearAllData}>
                Confirm Reset
              </Button>
            </div>
          )}
        </div>

        <div className="flex justify-start pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button size="sm" variant="ghost" onClick={handleLogout} icon={LogOut}>
            Sign Out
          </Button>
        </div>
      </Card>
    </div>
  );
}
