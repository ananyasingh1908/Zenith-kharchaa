import { getCurrentMonthKey, getPreviousMonthKey } from '../utils/dates';

const STORAGE_KEYS = {
  USER: 'kharcha_user',
  TOKEN: 'kharcha_token',
  SETTINGS: 'kharcha_settings',
  EXPENSES: 'kharcha_expenses',
  VAULT: 'kharcha_vault',
  BUDGETS: 'kharcha_budgets',
};

export function getInitialExpenses() {
  const curMonth = getCurrentMonthKey();
  const prevMonth = getPreviousMonthKey(curMonth);
  const now = new Date();
  const curYear = now.getFullYear();
  const curMonthNum = String(now.getMonth() + 1).padStart(2, '0');
  const prevDate = new Date(curYear, now.getMonth() - 1, 1);
  const prevYear = prevDate.getFullYear();
  const prevMonthNum = String(prevDate.getMonth() + 1).padStart(2, '0');

  return [
    {
      id: 'exp-1',
      title: 'Morning Masala Chai & Maska Bun',
      amount: 40,
      currency: 'INR',
      amountBase: 40,
      category: 'Micro-spends',
      date: `${curYear}-${curMonthNum}-01T08:30:00.000Z`,
      mood: 'worth',
      note: 'Tapri near office',
      createdAt: `${curYear}-${curMonthNum}-01T08:30:00.000Z`,
    },
    {
      id: 'exp-2',
      title: 'Uber to Cyber City Office',
      amount: 380,
      currency: 'INR',
      amountBase: 380,
      category: 'Travel & Commute',
      date: `${curYear}-${curMonthNum}-01T09:45:00.000Z`,
      mood: 'worth',
      note: 'Morning rush hour cab',
      createdAt: `${curYear}-${curMonthNum}-01T09:45:00.000Z`,
    },
    {
      id: 'exp-3',
      title: 'Zomato Gourmet Lunch Bowl',
      amount: 450,
      currency: 'INR',
      amountBase: 450,
      category: 'Food & Dining',
      date: `${curYear}-${curMonthNum}-01T13:15:00.000Z`,
      mood: 'worth',
      note: 'Healthy salad & sourdough',
      createdAt: `${curYear}-${curMonthNum}-01T13:15:00.000Z`,
    },
    {
      id: 'exp-4',
      title: 'Afternoon Iced Americano',
      amount: 280,
      currency: 'INR',
      amountBase: 280,
      category: 'Food & Dining',
      date: `${curYear}-${curMonthNum}-01T16:00:00.000Z`,
      mood: 'worth',
      note: 'Blue Tokai Cafe',
      createdAt: `${curYear}-${curMonthNum}-01T16:00:00.000Z`,
    },
    {
      id: 'exp-5',
      title: 'Metro Smart Card Recharge',
      amount: 500,
      currency: 'INR',
      amountBase: 500,
      category: 'Travel & Commute',
      date: `${curYear}-${curMonthNum}-01T18:40:00.000Z`,
      mood: 'worth',
      note: 'DMRC Auto top-up',
      createdAt: `${curYear}-${curMonthNum}-01T18:40:00.000Z`,
    },
    {
      id: 'exp-6',
      title: 'House Rent for October',
      amount: 18000,
      currency: 'INR',
      amountBase: 18000,
      category: 'Bills & Utilities',
      date: `${curYear}-${curMonthNum}-01T10:00:00.000Z`,
      mood: 'worth',
      note: 'Monthly 1BHK rent transfer',
      createdAt: `${curYear}-${curMonthNum}-01T10:00:00.000Z`,
    },
    {
      id: 'exp-7',
      title: 'Airtel Fiber Broadband',
      amount: 1179,
      currency: 'INR',
      amountBase: 1179,
      category: 'Bills & Utilities',
      date: `${curYear}-${curMonthNum}-01T11:20:00.000Z`,
      mood: 'worth',
      note: '200 Mbps unlimited plan',
      createdAt: `${curYear}-${curMonthNum}-01T11:20:00.000Z`,
    },
    {
      id: 'exp-8',
      title: 'Blinkit Instant Groceries',
      amount: 890,
      currency: 'INR',
      amountBase: 890,
      category: 'Food & Dining',
      date: `${curYear}-${curMonthNum}-01T19:10:00.000Z`,
      mood: 'worth',
      note: 'Milk, eggs, fruits, oats',
      createdAt: `${curYear}-${curMonthNum}-01T19:10:00.000Z`,
    },
    {
      id: 'exp-9',
      title: 'ChatGPT Plus Subscription',
      amount: 20,
      currency: 'USD',
      amountBase: 1660,
      category: 'Subscriptions',
      date: `${curYear}-${curMonthNum}-01T07:00:00.000Z`,
      mood: 'worth',
      note: 'AI workflow tools',
      createdAt: `${curYear}-${curMonthNum}-01T07:00:00.000Z`,
    },
    {
      id: 'exp-10',
      title: 'Zepto Midnight Snacks',
      amount: 340,
      currency: 'INR',
      amountBase: 340,
      category: 'Micro-spends',
      date: `${curYear}-${curMonthNum}-01T23:30:00.000Z`,
      mood: 'regret',
      note: 'Late night ice cream craving',
      createdAt: `${curYear}-${curMonthNum}-01T23:30:00.000Z`,
    },
    {
      id: 'exp-11',
      title: 'House Rent for September',
      amount: 18000,
      currency: 'INR',
      amountBase: 18000,
      category: 'Bills & Utilities',
      date: `${prevYear}-${prevMonthNum}-01T10:00:00.000Z`,
      mood: 'worth',
      note: 'Rent payment',
      createdAt: `${prevYear}-${prevMonthNum}-01T10:00:00.000Z`,
    },
    {
      id: 'exp-12',
      title: 'Cult.fit Gym Annual Membership',
      amount: 12500,
      currency: 'INR',
      amountBase: 12500,
      category: 'Health & Fitness',
      date: `${prevYear}-${prevMonthNum}-04T12:00:00.000Z`,
      mood: 'worth',
      note: 'Elite pass renewal',
      createdAt: `${prevYear}-${prevMonthNum}-04T12:00:00.000Z`,
    },
    {
      id: 'exp-13',
      title: 'Swiggy Weekend Biryani Feast',
      amount: 1150,
      currency: 'INR',
      amountBase: 1150,
      category: 'Food & Dining',
      date: `${prevYear}-${prevMonthNum}-06T20:30:00.000Z`,
      mood: 'worth',
      note: 'Dinner with friends',
      createdAt: `${prevYear}-${prevMonthNum}-06T20:30:00.000Z`,
    },
    {
      id: 'exp-14',
      title: 'Amazon Wireless Noise Canceling Earbuds',
      amount: 4999,
      currency: 'INR',
      amountBase: 4999,
      category: 'Shopping',
      date: `${prevYear}-${prevMonthNum}-08T15:00:00.000Z`,
      mood: 'worth',
      note: 'Great for commute & focus',
      createdAt: `${prevYear}-${prevMonthNum}-08T15:00:00.000Z`,
    },
    {
      id: 'exp-15',
      title: 'Uber to Aerocity Dinner',
      amount: 520,
      currency: 'INR',
      amountBase: 520,
      category: 'Travel & Commute',
      date: `${prevYear}-${prevMonthNum}-10T19:45:00.000Z`,
      mood: 'meh',
      note: 'Heavy traffic surge price',
      createdAt: `${prevYear}-${prevMonthNum}-10T19:45:00.000Z`,
    },
    {
      id: 'exp-16',
      title: 'PVR IMAX Movie Tickets & Popcorn',
      amount: 1450,
      currency: 'INR',
      amountBase: 1450,
      category: 'Fun & Events',
      date: `${prevYear}-${prevMonthNum}-12T18:00:00.000Z`,
      mood: 'worth',
      note: 'Weekend sci-fi release',
      createdAt: `${prevYear}-${prevMonthNum}-12T18:00:00.000Z`,
    },
    {
      id: 'exp-17',
      title: 'Impulsive Zara Bomber Jacket',
      amount: 5990,
      currency: 'INR',
      amountBase: 5990,
      category: 'Shopping',
      date: `${prevYear}-${prevMonthNum}-15T16:30:00.000Z`,
      mood: 'regret',
      note: 'Wore only once, total impulse',
      createdAt: `${prevYear}-${prevMonthNum}-15T16:30:00.000Z`,
    },
    {
      id: 'exp-18',
      title: 'Netflix Premium 4K Family',
      amount: 649,
      currency: 'INR',
      amountBase: 649,
      category: 'Subscriptions',
      date: `${prevYear}-${prevMonthNum}-17T09:00:00.000Z`,
      mood: 'worth',
      note: 'Monthly entertainment',
      createdAt: `${prevYear}-${prevMonthNum}-17T09:00:00.000Z`,
    },
    {
      id: 'exp-19',
      title: 'Spotify Premium Duo Plan',
      amount: 149,
      currency: 'INR',
      amountBase: 149,
      category: 'Subscriptions',
      date: `${prevYear}-${prevMonthNum}-18T09:00:00.000Z`,
      mood: 'worth',
      note: 'Daily music & podcasts',
      createdAt: `${prevYear}-${prevMonthNum}-18T09:00:00.000Z`,
    },
    {
      id: 'exp-20',
      title: 'Electricity & Utility Bill',
      amount: 2450,
      currency: 'INR',
      amountBase: 2450,
      category: 'Bills & Utilities',
      date: `${prevYear}-${prevMonthNum}-20T11:00:00.000Z`,
      mood: 'worth',
      note: 'AC electricity bill',
      createdAt: `${prevYear}-${prevMonthNum}-20T11:00:00.000Z`,
    },
    {
      id: 'exp-21',
      title: 'Apollo Pharmacy Multivitamins & Protein',
      amount: 1850,
      currency: 'INR',
      amountBase: 1850,
      category: 'Health & Fitness',
      date: `${prevYear}-${prevMonthNum}-22T14:15:00.000Z`,
      mood: 'worth',
      note: 'Daily wellness & whey',
      createdAt: `${prevYear}-${prevMonthNum}-22T14:15:00.000Z`,
    },
    {
      id: 'exp-22',
      title: 'Myntra Casual T-shirts & Socks',
      amount: 1699,
      currency: 'INR',
      amountBase: 1699,
      category: 'Shopping',
      date: `${prevYear}-${prevMonthNum}-24T17:20:00.000Z`,
      mood: 'worth',
      note: 'Everyday cotton wear',
      createdAt: `${prevYear}-${prevMonthNum}-24T17:20:00.000Z`,
    },
    {
      id: 'exp-23',
      title: 'Tapri Chai & Samosa Team Treats',
      amount: 120,
      currency: 'INR',
      amountBase: 120,
      category: 'Micro-spends',
      date: `${prevYear}-${prevMonthNum}-26T17:00:00.000Z`,
      mood: 'worth',
      note: 'Evening office break',
      createdAt: `${prevYear}-${prevMonthNum}-26T17:00:00.000Z`,
    },
    {
      id: 'exp-24',
      title: 'Petrol Fill-up Tank',
      amount: 2200,
      currency: 'INR',
      amountBase: 2200,
      category: 'Travel & Commute',
      date: `${prevYear}-${prevMonthNum}-27T08:15:00.000Z`,
      mood: 'worth',
      note: 'Shell V-Power fuel',
      createdAt: `${prevYear}-${prevMonthNum}-27T08:15:00.000Z`,
    },
    {
      id: 'exp-25',
      title: 'GitHub Copilot Pro Subscription',
      amount: 10,
      currency: 'USD',
      amountBase: 830,
      category: 'Subscriptions',
      date: `${prevYear}-${prevMonthNum}-28T06:30:00.000Z`,
      mood: 'worth',
      note: 'Coding productivity boost',
      createdAt: `${prevYear}-${prevMonthNum}-28T06:30:00.000Z`,
    },
    {
      id: 'exp-26',
      title: 'Quick Vending Machine Red Bull',
      amount: 125,
      currency: 'INR',
      amountBase: 125,
      category: 'Micro-spends',
      date: `${prevYear}-${prevMonthNum}-29T15:45:00.000Z`,
      mood: 'meh',
      note: 'Overpriced beverage',
      createdAt: `${prevYear}-${prevMonthNum}-29T15:45:00.000Z`,
    },
    {
      id: 'exp-27',
      title: 'Nature Basket Organic Groceries',
      amount: 2450,
      currency: 'INR',
      amountBase: 2450,
      category: 'Food & Dining',
      date: `${prevYear}-${prevMonthNum}-30T18:00:00.000Z`,
      mood: 'worth',
      note: 'Weekly essentials & veggies',
      createdAt: `${prevYear}-${prevMonthNum}-30T18:00:00.000Z`,
    },
  ];
}

export function getInitialVault() {
  const now = Date.now();
  return [
    {
      id: 'vault-1',
      name: 'Sony WH-1000XM5 Headphones',
      price: 29990,
      currency: 'INR',
      priceBase: 29990,
      durationDays: 7,
      createdAt: new Date(now - 8 * 86400000).toISOString(),
      unlockAt: new Date(now - 1 * 86400000).toISOString(),
      status: 'ready',
    },
    {
      id: 'vault-2',
      name: 'Mechanical Keychron Q1 Pro',
      price: 18500,
      currency: 'INR',
      priceBase: 18500,
      durationDays: 7,
      createdAt: new Date(now - 3 * 86400000).toISOString(),
      unlockAt: new Date(now + 4 * 86400000).toISOString(),
      status: 'locked',
    },
    {
      id: 'vault-3',
      name: 'Leather Messenger Work Bag',
      price: 6499,
      currency: 'INR',
      priceBase: 6499,
      durationDays: 2,
      createdAt: new Date(now - 1 * 86400000).toISOString(),
      unlockAt: new Date(now + 1 * 86400000).toISOString(),
      status: 'locked',
    },
    {
      id: 'vault-4',
      name: 'Designer Sneakers',
      price: 8999,
      currency: 'INR',
      priceBase: 8999,
      durationDays: 2,
      createdAt: new Date(now - 5 * 86400000).toISOString(),
      unlockAt: new Date(now - 3 * 86400000).toISOString(),
      status: 'released',
      releasedAt: new Date(now - 2 * 86400000).toISOString(),
    },
  ];
}

export function getInitialBudgets() {
  return {
    monthlyBudget: 45000,
    categories: {
      'Food & Dining': 12000,
      'Travel & Commute': 6000,
      'Bills & Utilities': 20000,
      'Shopping': 6000,
      'Fun & Events': 4000,
      'Health & Fitness': 3000,
      'Micro-spends': 2000,
      'Subscriptions': 2000,
      'Other & Cash': 1000,
    },
  };
}

export function getInitialSettings() {
  return {
    baseCurrency: 'INR',
    usdRate: 83,
    incomeType: 'monthly',
    monthlyIncome: 150000,
    hourlyWage: 937.5,
    monthlyBudget: 45000,
    appearance: 'light',
    onboarded: true,
  };
}

export function getInitialUser() {
  return {
    id: 'user-1',
    name: 'Ananya',
    email: 'ananya@kharcha.app',
    avatarUrl: '',
    role: 'Mindful Spender',
  };
}

export const mockStore = {
  getUser() {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : getInitialUser();
  },
  setUser(user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },
  getToken() {
    return localStorage.getItem(STORAGE_KEYS.TOKEN) || 'mock-token-xyz';
  },
  setToken(token) {
    if (token) localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    else localStorage.removeItem(STORAGE_KEYS.TOKEN);
  },
  getSettings() {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? JSON.parse(raw) : getInitialSettings();
  },
  setSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },
  getExpenses() {
    const raw = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    if (!raw) {
      const init = getInitialExpenses();
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(init));
      return init;
    }
    return JSON.parse(raw);
  },
  setExpenses(expenses) {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  },
  getVault() {
    const raw = localStorage.getItem(STORAGE_KEYS.VAULT);
    if (!raw) {
      const init = getInitialVault();
      localStorage.setItem(STORAGE_KEYS.VAULT, JSON.stringify(init));
      return init;
    }
    return JSON.parse(raw);
  },
  setVault(items) {
    localStorage.setItem(STORAGE_KEYS.VAULT, JSON.stringify(items));
  },
  getBudgets() {
    const raw = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    if (!raw) {
      const init = getInitialBudgets();
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(init));
      return init;
    }
    return JSON.parse(raw);
  },
  setBudgets(budgets) {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  },
  clearAll() {
    localStorage.removeItem(STORAGE_KEYS.EXPENSES);
    localStorage.removeItem(STORAGE_KEYS.VAULT);
    localStorage.removeItem(STORAGE_KEYS.BUDGETS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  },
};
