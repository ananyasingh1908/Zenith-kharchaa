import { useState, useEffect, useCallback } from 'react';
import { getVaultItems, createVaultItem, buyVaultItem, releaseVaultItem } from '../api/vaultApi';

export function useVault() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getVaultItems();
      setItems(res.items || []);
    } catch (err) {
      setError(err.message || 'Failed to load vault items');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addItem = useCallback(async (data) => {
    const res = await createVaultItem(data);
    setItems(prev => [res.item, ...prev]);
    return res.item;
  }, []);

  const buyItem = useCallback(async (id) => {
    await buyVaultItem(id);
    setItems(prev => prev.map(i => (i.id === id ? { ...i, status: 'bought' } : i)));
  }, []);

  const releaseItem = useCallback(async (id) => {
    await releaseVaultItem(id);
    setItems(prev => prev.map(i => (i.id === id ? { ...i, status: 'released' } : i)));
  }, []);

  return {
    items,
    loading,
    error,
    refresh: fetchItems,
    addItem,
    buyItem,
    releaseItem,
  };
}
