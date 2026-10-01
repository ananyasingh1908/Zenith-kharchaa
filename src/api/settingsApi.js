import { request, isRealBackend } from './client';
import { mockStore } from './mockStore';
import { convertAmount } from '../utils/money';

export async function getSettings() {
  if (isRealBackend) {
    return request('/settings');
  }

  await new Promise(r => setTimeout(r, 80));
  return { settings: mockStore.getSettings() };
}

export async function updateSettings(newSettings) {
  if (isRealBackend) {
    return request('/settings', {
      method: 'PUT',
      body: JSON.stringify(newSettings),
    });
  }

  await new Promise(r => setTimeout(r, 100));
  const current = mockStore.getSettings();
  const updated = { ...current, ...newSettings };

  if (newSettings.baseCurrency || newSettings.usdRate) {
    const rate = updated.usdRate || 83;
    const base = updated.baseCurrency || 'INR';

    const expenses = mockStore.getExpenses().map(e => ({
      ...e,
      amountBase: convertAmount(e.amount, e.currency, base, rate),
    }));
    mockStore.setExpenses(expenses);

    const vault = mockStore.getVault().map(v => ({
      ...v,
      priceBase: convertAmount(v.price, v.currency, base, rate),
    }));
    mockStore.setVault(vault);
  }

  mockStore.setSettings(updated);
  return { settings: updated };
}
