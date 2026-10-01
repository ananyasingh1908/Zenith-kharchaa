import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { SettingsProvider, useSettingsContext } from './context/SettingsContext';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { Login } from './pages/Login';
import { Onboarding } from './pages/Onboarding';
import { Home } from './pages/Home';
import { Expenses } from './pages/Expenses';
import { Vault } from './pages/Vault';
import { Insights } from './pages/Insights';
import { Budgets } from './pages/Budgets';
import { Import } from './pages/Import';
import { Settings } from './pages/Settings';
import { getCurrentMonthKey } from './utils/dates';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuthContext();
  const { settings } = useSettingsContext();

  if (loading) {
    return <div className="min-h-screen bg-[#F6F8FB] dark:bg-[#090D16]" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (settings && settings.onboarded === false && window.location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}

function AppRoutes() {
  const [currentMonth, setCurrentMonth] = useState(() => getCurrentMonthKey());

  useEffect(() => {
    const handleUpdate = () => {
      setCurrentMonth(prev => prev);
    };
    window.addEventListener('kharcha_data_updated', handleUpdate);
    return () => window.removeEventListener('kharcha_data_updated', handleUpdate);
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout currentMonth={currentMonth} onMonthChange={setCurrentMonth} />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="vault" element={<Vault />} />
        <Route path="insights" element={<Insights />} />
        <Route path="budgets" element={<Budgets />} />
        <Route path="import" element={<Import />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <SettingsProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </SettingsProvider>
    </ToastProvider>
  );
}
