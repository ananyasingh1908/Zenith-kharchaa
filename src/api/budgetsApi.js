import { request, isRealBackend } from './client';
import { mockStore } from './mockStore';

export async function getBudgets(month) {
  if (isRealBackend) {
    return request(month ? `/budgets?month=${month}` : '/budgets');
  }

  await new Promise(r => setTimeout(r, 100));
  return { budgets: mockStore.getBudgets() };
}

export async function updateBudgets(data) {
  if (isRealBackend) {
    return request('/budgets', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  await new Promise(r => setTimeout(r, 120));
  const current = mockStore.getBudgets();
  const updated = {
    monthlyBudget: data.monthlyBudget !== undefined ? Number(data.monthlyBudget) : current.monthlyBudget,
    categories: {
      ...current.categories,
      ...(data.categories || {}),
    },
  };
  mockStore.setBudgets(updated);

  const settings = mockStore.getSettings();
  mockStore.setSettings({
    ...settings,
    monthlyBudget: updated.monthlyBudget,
  });

  return { budgets: updated };
}
