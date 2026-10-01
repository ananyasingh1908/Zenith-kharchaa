import { request, isRealBackend } from './client';
import { mockStore } from './mockStore';
import { convertAmount } from '../utils/money';
import { createExpense } from './expensesApi';

export async function getVaultItems() {
  if (isRealBackend) {
    return request('/vault');
  }

  await new Promise(r => setTimeout(r, 120));
  const items = mockStore.getVault();
  const now = Date.now();

  const refreshed = items.map(item => {
    if (item.status === 'locked' && new Date(item.unlockAt).getTime() <= now) {
      return { ...item, status: 'ready' };
    }
    return item;
  });

  mockStore.setVault(refreshed);
  return { items: refreshed };
}

export async function createVaultItem(data) {
  const settings = mockStore.getSettings();
  const usdRate = settings.usdRate || 83;
  const baseCurrency = settings.baseCurrency || 'INR';

  const price = Number(data.price) || 0;
  const currency = data.currency || baseCurrency;
  const priceBase = convertAmount(price, currency, baseCurrency, usdRate);

  const durationDays = Number(data.durationDays) || 7;
  const now = Date.now();
  const unlockAt = new Date(now + durationDays * 86400000).toISOString();

  const newItem = {
    id: `vault-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    name: data.name || 'Untitled Wish',
    price,
    currency,
    priceBase,
    durationDays,
    createdAt: new Date().toISOString(),
    unlockAt,
    status: 'locked',
  };

  if (isRealBackend) {
    return request('/vault', {
      method: 'POST',
      body: JSON.stringify(newItem),
    });
  }

  await new Promise(r => setTimeout(r, 120));
  const items = mockStore.getVault();
  mockStore.setVault([newItem, ...items]);
  return { item: newItem };
}

export async function buyVaultItem(id) {
  if (isRealBackend) {
    return request(`/vault/${id}/buy`, {
      method: 'POST',
    });
  }

  await new Promise(r => setTimeout(r, 150));
  const items = mockStore.getVault();
  const item = items.find(i => i.id === id);
  if (!item) throw new Error('Vault item not found');

  await createExpense({
    title: item.name,
    amount: item.price,
    currency: item.currency,
    category: 'Shopping',
    mood: 'worth',
    note: 'Purchased after mindful vault cooldown',
    date: new Date().toISOString(),
  });

  const updated = items.map(i => (i.id === id ? { ...i, status: 'bought', boughtAt: new Date().toISOString() } : i));
  mockStore.setVault(updated);
  return { success: true, item: { ...item, status: 'bought' } };
}

export async function releaseVaultItem(id) {
  if (isRealBackend) {
    return request(`/vault/${id}/release`, {
      method: 'POST',
    });
  }

  await new Promise(r => setTimeout(r, 120));
  const items = mockStore.getVault();
  const item = items.find(i => i.id === id);
  if (!item) throw new Error('Vault item not found');

  const updated = items.map(i => (i.id === id ? { ...i, status: 'released', releasedAt: new Date().toISOString() } : i));
  mockStore.setVault(updated);
  return { success: true, item: { ...item, status: 'released' } };
}
