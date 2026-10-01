import { request, isRealBackend } from './client';
import { mockStore } from './mockStore';
import { calculateSummary } from '../utils/summary';
import { convertAmount } from '../utils/money';
import { getHourlyWage } from '../utils/timeCost';

export async function getExpenses({ month, category, q, sort = 'newest' } = {}) {
  if (isRealBackend) {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (category) params.append('category', category);
    if (q) params.append('q', q);
    if (sort) params.append('sort', sort);
    return request(`/expenses?${params.toString()}`);
  }

  await new Promise(r => setTimeout(r, 150));
  let list = mockStore.getExpenses();

  if (month) {
    list = list.filter(e => e.date && e.date.substring(0, 7) === month);
  }

  if (category && category !== 'all') {
    list = list.filter(e => e.category === category);
  }

  if (q) {
    const query = q.toLowerCase();
    list = list.filter(e => (
      (e.title && e.title.toLowerCase().includes(query)) ||
      (e.category && e.category.toLowerCase().includes(query)) ||
      (e.note && e.note.toLowerCase().includes(query))
    ));
  }

  if (sort === 'highest') {
    list.sort((a, b) => (b.amountBase || b.amount) - (a.amountBase || a.amount));
  } else {
    list.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
  }

  return { expenses: list };
}

export async function getSummary(monthKey) {
  if (isRealBackend) {
    try {
      return await request(`/summary?month=${monthKey}`);
    } catch {
      void 0;
    }
  }

  await new Promise(r => setTimeout(r, 100));
  const allExpenses = mockStore.getExpenses();
  const settings = mockStore.getSettings();
  const budgets = mockStore.getBudgets();
  const hourlyWage = getHourlyWage(settings);

  return calculateSummary({
    expenses: allExpenses,
    allExpenses,
    monthKey,
    budget: budgets.monthlyBudget || 45000,
    hourlyWage,
  });
}

export async function createExpense(data) {
  const settings = mockStore.getSettings();
  const usdRate = settings.usdRate || 83;
  const baseCurrency = settings.baseCurrency || 'INR';

  const amount = Number(data.amount) || 0;
  const currency = data.currency || baseCurrency;
  const amountBase = convertAmount(amount, currency, baseCurrency, usdRate);

  const newExpense = {
    id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    title: data.title || 'Untitled Expense',
    amount,
    currency,
    amountBase,
    category: data.category || 'Other & Cash',
    date: data.date || new Date().toISOString(),
    mood: data.mood || 'worth',
    note: data.note || '',
    createdAt: new Date().toISOString(),
  };

  if (isRealBackend) {
    return request('/expenses', {
      method: 'POST',
      body: JSON.stringify(newExpense),
    });
  }

  await new Promise(r => setTimeout(r, 120));
  const expenses = mockStore.getExpenses();
  mockStore.setExpenses([newExpense, ...expenses]);
  return { expense: newExpense };
}

export async function updateExpense(id, data) {
  const settings = mockStore.getSettings();
  const usdRate = settings.usdRate || 83;
  const baseCurrency = settings.baseCurrency || 'INR';

  if (isRealBackend) {
    return request(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  await new Promise(r => setTimeout(r, 120));
  const expenses = mockStore.getExpenses();
  const index = expenses.findIndex(e => e.id === id);
  if (index === -1) throw new Error('Expense not found');

  const amount = data.amount !== undefined ? Number(data.amount) : expenses[index].amount;
  const currency = data.currency || expenses[index].currency;
  const amountBase = convertAmount(amount, currency, baseCurrency, usdRate);

  const updated = {
    ...expenses[index],
    ...data,
    amount,
    currency,
    amountBase,
  };

  expenses[index] = updated;
  mockStore.setExpenses(expenses);
  return { expense: updated };
}

export async function deleteExpense(id) {
  if (isRealBackend) {
    return request(`/expenses/${id}`, {
      method: 'DELETE',
    });
  }

  await new Promise(r => setTimeout(r, 100));
  const expenses = mockStore.getExpenses();
  const filtered = expenses.filter(e => e.id !== id);
  mockStore.setExpenses(filtered);
  return { success: true };
}
