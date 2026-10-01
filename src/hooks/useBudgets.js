import { useState, useEffect, useCallback } from 'react';
import { getBudgets, updateBudgets } from '../api/budgetsApi';

export function useBudgets(month) {
  const [budgets, setBudgets] = useState({ monthlyBudget: 45000, categories: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBudgets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getBudgets(month);
      if (res.budgets) setBudgets(res.budgets);
    } catch (err) {
      setError(err.message || 'Failed to load budgets');
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const saveBudgets = useCallback(async (data) => {
    const res = await updateBudgets(data);
    setBudgets(res.budgets);
    return res.budgets;
  }, []);

  return {
    budgets,
    loading,
    error,
    refresh: fetchBudgets,
    saveBudgets,
  };
}
