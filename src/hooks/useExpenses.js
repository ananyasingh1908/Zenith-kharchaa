import { useState, useEffect, useCallback } from 'react';
import { getExpenses, createExpense, updateExpense, deleteExpense } from '../api/expensesApi';

export function useExpenses({ month, category, q, sort } = {}) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getExpenses({ month, category, q, sort });
      setExpenses(res.expenses || []);
    } catch (err) {
      setError(err.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }, [month, category, q, sort]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const addExpense = useCallback(async (data) => {
    const res = await createExpense(data);
    setExpenses(prev => [res.expense, ...prev]);
    return res.expense;
  }, []);

  const editExpense = useCallback(async (id, data) => {
    const res = await updateExpense(id, data);
    setExpenses(prev => prev.map(e => (e.id === id ? res.expense : e)));
    return res.expense;
  }, []);

  const removeExpense = useCallback(async (id) => {
    await deleteExpense(id);
    setExpenses(prev => prev.filter(e => e.id !== id));
  }, []);

  return {
    expenses,
    loading,
    error,
    refresh: fetchExpenses,
    addExpense,
    editExpense,
    removeExpense,
  };
}
