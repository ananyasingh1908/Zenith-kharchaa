import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useSettings } from '../hooks/useSettings';
import { CATEGORIES } from '../utils/categories';
import { formatMoney } from '../utils/money';
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Utensils,
  Car,
  Gamepad2,
  Receipt,
  ShoppingBag,
  HeartPulse,
  Zap,
  Sparkles as SparklesIcon,
  CircleDot,
  Coins,
  Hourglass,
  Coffee,
  Pizza,
  Plane,
} from 'lucide-react';

const ICON_MAP = {
  Utensils,
  Car,
  Gamepad2,
  Receipt,
  ShoppingBag,
  HeartPulse,
  Zap,
  Sparkles: SparklesIcon,
  CircleDot,
};

export function Onboarding() {
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettings();

  const [step, setStep] = useState(1);
  const [currency, setCurrency] = useState(settings.baseCurrency || 'INR');
  const [incomeMode, setIncomeMode] = useState('monthly');
  const [monthlyIncome, setMonthlyIncome] = useState(settings.monthlyIncome || 150000);
  const [hourlyWageInput, setHourlyWageInput] = useState(settings.hourlyWage || 937.5);
  const [discretionaryBudget, setDiscretionaryBudget] = useState(settings.monthlyBudget || 45000);
  const [selectedCategories, setSelectedCategories] = useState(() => CATEGORIES.map(c => c.id));

  const calculatedHourly = incomeMode === 'hourly' ? Number(hourlyWageInput) : Number(monthlyIncome) / 160;
  const calculatedDailySafe = Math.round(Number(discretionaryBudget) / 30);

  const toggleCategory = (id) => {
    if (selectedCategories.includes(id)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(prev => prev.filter(c => c !== id));
      }
    } else {
      setSelectedCategories(prev => [...prev, id]);
    }
  };

  const handleFinish = async () => {
    await updateSettings({
      baseCurrency: currency,
      incomeType: incomeMode,
      monthlyIncome: Number(monthlyIncome),
      hourlyWage: calculatedHourly,
      monthlyBudget: Number(discretionaryBudget),
      onboarded: true,
    });
    navigate('/');
  };

  const stepsList = ['1. Setup', '2. Earnings', '3. Budget', '4. Finish'];

  return (
    <div className="min-h-screen bg-[#F6F8FB] dark:bg-[#090D16] flex flex-col justify-between p-4 md:p-10">
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between py-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm">
            ₹
          </div>
          <span className="font-black text-slate-900 dark:text-white">Kharcha</span>
        </div>

        <div className="flex items-center gap-3">
          {stepsList.map((st, idx) => (
            <div
              key={st}
              className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${
                step === idx + 1
                  ? 'bg-blue-600 text-white shadow-sm'
                  : step > idx + 1
                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                  : 'text-slate-400'
              }`}
            >
              {st}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleFinish}
          className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          Skip to Dashboard
        </button>
      </header>

      <main className="max-w-5xl w-full mx-auto my-auto py-6">
        {step === 1 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                STEP 01 OF 04 • LOCALIZATION
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Which currency do you think in?
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                We calibrate native formatting, lakh & crore numbering, and automated exchange tracking to match how you naturally perceive value.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div
                onClick={() => setCurrency('INR')}
                className={`p-6 rounded-[28px] glass-card cursor-pointer border-2 transition-all ${
                  currency === 'INR'
                    ? 'border-blue-600 bg-blue-50/20 dark:bg-blue-950/20 shadow-glow-blue'
                    : 'border-transparent hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-2xl">
                    ₹
                  </div>
                  {currency === 'INR' && (
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Indian Rupee</h3>
                <p className="text-xs text-slate-400 mt-1">Lakhs & Crores grouping (₹1,25,000.00)</p>
                <div className="mt-4 p-3 rounded-2xl bg-white/60 dark:bg-slate-800/60 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Simulated Ledger Display</span>
                  <div className="flex justify-between items-center mt-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Blue Tokai Coffee</span>
                    <strong className="text-rose-500">-₹280.00</strong>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setCurrency('USD')}
                className={`p-6 rounded-[28px] glass-card cursor-pointer border-2 transition-all ${
                  currency === 'USD'
                    ? 'border-blue-600 bg-blue-50/20 dark:bg-blue-950/20 shadow-glow-blue'
                    : 'border-transparent hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-2xl">
                    $
                  </div>
                  {currency === 'USD' && (
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">US Dollar</h3>
                <p className="text-xs text-slate-400 mt-1">Standard Western grouping ($10,000.00)</p>
                <div className="mt-4 p-3 rounded-2xl bg-white/60 dark:bg-slate-800/60 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Simulated Ledger Display</span>
                  <div className="flex justify-between items-center mt-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Whole Foods Market</span>
                    <strong className="text-rose-500">-$42.80</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button size="lg" onClick={() => setStep(2)} icon={ArrowRight}>
                Continue to Earnings
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                STEP 02 OF 04 • INCOME VELOCITY
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                What do you earn?
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Ground your purchases in the currency of your actual life-time. We use this to show what things cost in hours and minutes of your life.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-4xl mx-auto items-start">
              <Card className="md:col-span-7 space-y-6">
                <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
                  <button
                    type="button"
                    onClick={() => setIncomeMode('monthly')}
                    className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${
                      incomeMode === 'monthly'
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-slate-500'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setIncomeMode('hourly')}
                    className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${
                      incomeMode === 'hourly'
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-slate-500'
                    }`}
                  >
                    Hourly
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {incomeMode === 'monthly' ? 'Net Take-Home Salary (Monthly)' : 'Hourly Compensation Rate'}
                  </label>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-400">
                      {currency === 'INR' ? '₹' : '$'}
                    </span>
                    <input
                      type="number"
                      value={incomeMode === 'monthly' ? monthlyIncome : hourlyWageInput}
                      onChange={(e) =>
                        incomeMode === 'monthly'
                          ? setMonthlyIncome(e.target.value)
                          : setHourlyWageInput(e.target.value)
                      }
                      className="text-4xl font-black w-full bg-transparent text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {[75000, 150000, 250000, 500000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setMonthlyIncome(amt)}
                      className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300"
                    >
                      {formatMoney(amt, currency, 0)}
                    </button>
                  ))}
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Standard 160 hrs / month baseline (40 hrs / week productive work).</span>
                </div>
              </Card>

              <Card className="md:col-span-5 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-transparent border-purple-500/20 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400">
                    <Hourglass className="w-4 h-4" />
                    <span>The Life Cost Lens</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400">
                    Live Metric
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-md">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Your Time Value</span>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                    1hr ≈ {formatMoney(Math.round(calculatedHourly), currency, 0)}
                  </p>
                  <p className="text-xs text-slate-400">≈ {formatMoney((calculatedHourly / 60).toFixed(2), currency, 2)} / minute</p>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Real-World Equivalents</span>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between p-2 rounded-xl bg-white/40 dark:bg-slate-800/40">
                      <span>Masala Chai (₹40)</span>
                      <strong>{(40 / (calculatedHourly / 60)).toFixed(1)} mins</strong>
                    </div>
                    <div className="flex justify-between p-2 rounded-xl bg-white/40 dark:bg-slate-800/40">
                      <span>Artisan Pizza Dinner (₹650)</span>
                      <strong>{(650 / (calculatedHourly / 60)).toFixed(1)} mins</strong>
                    </div>
                    <div className="flex justify-between p-2 rounded-xl bg-white/40 dark:bg-slate-800/40">
                      <span>AirPods Max (₹59,900)</span>
                      <strong>{(59900 / calculatedHourly).toFixed(1)} hrs</strong>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="flex justify-between max-w-4xl mx-auto pt-4">
              <Button variant="ghost" onClick={() => setStep(1)} icon={ArrowLeft}>
                Back
              </Button>
              <Button size="lg" onClick={() => setStep(3)} icon={ArrowRight}>
                Continue to Budget
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                STEP 03 OF 04 • BUDGET ARCHITECTURE
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Set your monthly spending target
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                A mindful boundary for your everyday kharcha, keeping your long-term wealth compounding on autopilot.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-4xl mx-auto items-start">
              <Card className="md:col-span-7 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Discretionary Spending Cap
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-black text-slate-400">{currency === 'INR' ? '₹' : '$'}</span>
                    <input
                      type="number"
                      value={discretionaryBudget}
                      onChange={(e) => setDiscretionaryBudget(e.target.value)}
                      className="text-4xl font-black w-full bg-transparent text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[35000, 45000, 60000, 75000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDiscretionaryBudget(amt)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        Number(discretionaryBudget) === amt
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {formatMoney(amt, currency, 0)}
                    </button>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Take-Home Distribution</span>
                  <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex">
                    <div style={{ width: '40%' }} className="bg-slate-400" title="Fixed Bills" />
                    <div style={{ width: '30%' }} className="bg-blue-600" title="Kharcha Target" />
                    <div style={{ width: '30%' }} className="bg-emerald-500" title="Simple Wealth" />
                  </div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-400 pt-1">
                    <span>Fixed Bills (40%)</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">Kharcha (30%)</span>
                    <span className="text-emerald-500 font-bold">Wealth (30%)</span>
                  </div>
                </div>
              </Card>

              <Card className="md:col-span-5 space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Daily Safe-To-Spend Cap</span>
                  <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                    {formatMoney(calculatedDailySafe, currency, 0)}
                    <span className="text-xs text-slate-400 font-normal"> / calendar day</span>
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                    Spend within this daily compass to finish every month with pristine peace of mind.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Lifestyle Breakdown</span>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Daily Food & Coffee</span>
                      <strong>{formatMoney(Math.round(discretionaryBudget * 0.3 / 30), currency, 0)} / day</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Weekend Socials</span>
                      <strong>{formatMoney(Math.round(discretionaryBudget * 0.3 / 4), currency, 0)} / wk</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Impulse Buffer</span>
                      <strong>{formatMoney(Math.round(discretionaryBudget * 0.2), currency, 0)} / mo</strong>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="flex justify-between max-w-4xl mx-auto pt-4">
              <Button variant="ghost" onClick={() => setStep(2)} icon={ArrowLeft}>
                Back
              </Button>
              <Button size="lg" onClick={() => setStep(4)} icon={ArrowRight}>
                Continue to Categories
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                STEP 04 OF 04 • PERSONALIZATION
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Pick your categories
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Select the spending habits you want to track effortlessly. Kharcha automatically maps your SMS and UPI transactions into these buckets.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {CATEGORIES.map((cat) => {
                const Icon = ICON_MAP[cat.icon] || CircleDot;
                const isSelected = selectedCategories.includes(cat.id);
                return (
                  <div
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`p-4 rounded-2xl glass-card cursor-pointer border-2 transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/20 dark:bg-blue-950/20 shadow-sm'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: cat.bgColor, color: cat.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{cat.name}</h4>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{cat.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 rounded-2xl glass-card max-w-4xl mx-auto flex items-center gap-3 border border-blue-200/40 dark:border-blue-800/40">
              <Sparkles className="w-5 h-5 text-blue-500 shrink-0" />
              <p className="text-xs text-slate-600 dark:text-slate-300">
                <strong>Instant Smart Auto-Tag:</strong> Kharcha uses intelligent keyword matching to auto-categorize incoming transactions without manual friction.
              </p>
            </div>

            <div className="flex justify-between max-w-4xl mx-auto pt-4">
              <Button variant="ghost" onClick={() => setStep(3)} icon={ArrowLeft}>
                Back
              </Button>
              <Button size="lg" onClick={handleFinish} icon={ArrowRight}>
                Finish setup & enter Kharcha
              </Button>
            </div>
          </div>
        )}
      </main>

      <footer className="text-center text-xs text-slate-400 py-4">
        Bank-grade 256-bit encryption • Your financial telemetry remains client-side and strictly private.
      </footer>
    </div>
  );
}
