import { useState, useEffect, useCallback } from 'react';
import { getSummary } from '../api/expensesApi';

export function useSummary(monthKey) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = useCallback(async () => {
    if (!monthKey) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getSummary(monthKey);
      setSummary(res);
    } catch (err) {
      setError(err.message || 'Failed to calculate summary');
    } finally {
      setLoading(false);
    }
  }, [monthKey]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return {
    summary,
    loading,
    error,
    refresh: fetchSummary,
  };
}
