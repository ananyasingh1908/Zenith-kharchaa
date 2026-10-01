import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ShieldCheck, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const { login, signup, tryDemo } = useAuth();

  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        await signup({ name, email, password });
        navigate('/onboarding');
      } else {
        await login({ email, password });
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    try {
      await tryDemo();
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] dark:bg-[#090D16] flex flex-col justify-between p-4 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <header className="flex items-center justify-between max-w-6xl w-full mx-auto relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <span className="text-xl font-black">₹</span>
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Kharcha</span>
        </div>

        <button
          type="button"
          onClick={handleDemo}
          className="px-4 py-2 text-xs font-bold rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors"
        >
          Try Demo Mode
        </button>
      </header>

      <main className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto py-8 relative z-10">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Intelligent Expense Intelligence</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Know where your <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-400 bg-clip-text text-transparent">
              money goes.
            </span>
          </h1>

          <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-xl">
            Track effortlessly. Spend mindfully. Turn everyday kharcha into long-term financial clarity with our Apple-inspired mindful velocity lens.
          </p>

          <div className="p-5 rounded-[28px] glass-card border border-white/60 dark:border-white/10 shadow-glass max-w-md space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span className="uppercase tracking-wider">Today's Pulse</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                Healthy Pace
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-black text-slate-900 dark:text-white">₹830</span>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Remaining safe allowance today</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Day 1 of 31</span>
                <div className="w-20 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-1.5 overflow-hidden">
                  <div className="w-1/4 h-full bg-blue-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <Card className="p-8 shadow-2xl border border-white/60 dark:border-white/10">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/30">
                <span className="text-2xl font-black">₹</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {mode === 'login' ? 'Welcome back' : 'Start with Kharcha'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {mode === 'login' ? 'Log in to enter your mindful expense ledger' : 'Create your mindful spending profile'}
              </p>
            </div>

            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  mode === 'login'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  mode === 'signup'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Sign Up
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ananya Singh"
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ananya@kharcha.app"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-2"
                icon={ArrowRight}
              >
                {loading ? 'Authenticating...' : mode === 'login' ? 'Continue' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center space-y-3">
              <button
                type="button"
                onClick={handleDemo}
                className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
              >
                Instant Try Demo Mode →
              </button>
              <p className="text-[11px] text-slate-400">
                Zero spam. Bank-grade client-side encryption.
              </p>
            </div>
          </Card>
        </div>
      </main>

      <footer className="max-w-6xl w-full mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 py-4 border-t border-slate-200/50 dark:border-slate-800/50">
        <span>© 2026 Kharcha App. Apple-inspired financial autonomy.</span>
        <div className="flex items-center gap-4 mt-2 md:mt-0">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Security Whitepaper</span>
        </div>
      </footer>
    </div>
  );
}
