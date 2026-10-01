import { getDaysInMonth, getDaysElapsedInMonth, getDaysRemainingInMonth, getPreviousMonthKey } from './dates';

export function calculateSummary({ expenses = [], allExpenses = [], monthKey, budget = 45000, hourlyWage = 500 }) {
  const currentMonthExpenses = expenses.filter(e => {
    const eMonth = e.date ? e.date.substring(0, 7) : '';
    return eMonth === monthKey;
  });

  const prevMonthKey = getPreviousMonthKey(monthKey);
  const prevMonthExpenses = allExpenses.filter(e => {
    const eMonth = e.date ? e.date.substring(0, 7) : '';
    return eMonth === prevMonthKey;
  });

  const totalSpent = currentMonthExpenses.reduce((sum, e) => sum + (Number(e.amountBase) || 0), 0);
  const prevTotalSpent = prevMonthExpenses.reduce((sum, e) => sum + (Number(e.amountBase) || 0), 0);

  let changePercent = 0;
  if (prevTotalSpent > 0) {
    changePercent = Math.round(((totalSpent - prevTotalSpent) / prevTotalSpent) * 100);
  }

  const daysInMonth = getDaysInMonth(monthKey);
  const daysElapsed = Math.max(1, getDaysElapsedInMonth(monthKey));
  const daysRemaining = Math.max(1, getDaysRemainingInMonth(monthKey));

  const todayStr = new Date().toISOString().split('T')[0];
  const spentToday = currentMonthExpenses
    .filter(e => e.date && e.date.startsWith(todayStr))
    .reduce((sum, e) => sum + (Number(e.amountBase) || 0), 0);

  const safeToday = Math.max(0, (budget - totalSpent) / daysRemaining);
  const dailyAverageSoFar = totalSpent / daysElapsed;
  const projectedMonthTotal = Math.round(dailyAverageSoFar * daysInMonth);

  let velocityStatus = 'green';
  let runOutDay = null;

  if (projectedMonthTotal > budget) {
    velocityStatus = 'red';
    if (dailyAverageSoFar > 0) {
      const daysUntilExhausted = Math.floor(budget / dailyAverageSoFar);
      runOutDay = Math.min(daysInMonth, Math.max(1, daysUntilExhausted));
    }
  } else if (spentToday > safeToday && spentToday <= safeToday * 1.3) {
    velocityStatus = 'yellow';
  } else if (spentToday > safeToday * 1.3) {
    velocityStatus = 'red';
  }

  const categoryTotals = {};
  currentMonthExpenses.forEach(e => {
    const cat = e.category || 'Other & Cash';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + (Number(e.amountBase) || 0);
  });

  let maxCategorySpend = 0;
  Object.values(categoryTotals).forEach(val => {
    if (val > maxCategorySpend) maxCategorySpend = val;
  });

  const categoryBreakdown = Object.entries(categoryTotals)
    .map(([category, amount]) => {
      const percentage = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0;
      const isBiggest = amount > 0 && amount === maxCategorySpend;
      return {
        category,
        amount,
        percentage,
        isBiggest,
      };
    })
    .sort((a, b) => b.amount - a.amount);

  const prevCategoryTotals = {};
  prevMonthExpenses.forEach(e => {
    const cat = e.category || 'Other & Cash';
    prevCategoryTotals[cat] = (prevCategoryTotals[cat] || 0) + (Number(e.amountBase) || 0);
  });

  const fractionElapsed = daysElapsed / daysInMonth;
  const spikeAlerts = [];

  Object.entries(categoryTotals).forEach(([category, currentSpend]) => {
    const pastAverage = prevCategoryTotals[category] || 0;
    if (pastAverage > 0) {
      const fractionSpent = currentSpend / pastAverage;
      if (fractionSpent > fractionElapsed + 0.25) {
        spikeAlerts.push({
          category,
          currentSpend,
          pastAverage,
          fractionPercent: Math.round(fractionSpent * 100),
          daysElapsed,
          message: `${Math.round(fractionSpent * 100)}% of your average ${category} spend is gone in ${daysElapsed} days.`,
        });
      }
    }
  });

  const moodCounts = { worth: 0, meh: 0, regret: 0 };
  const moodAmounts = { worth: 0, meh: 0, regret: 0 };
  currentMonthExpenses.forEach(e => {
    const mood = e.mood || 'worth';
    moodCounts[mood] = (moodCounts[mood] || 0) + 1;
    moodAmounts[mood] = (moodAmounts[mood] || 0) + (Number(e.amountBase) || 0);
  });

  const dailyMap = {};
  for (let d = 1; d <= daysInMonth; d++) {
    const dayStr = `${monthKey}-${String(d).padStart(2, '0')}`;
    dailyMap[dayStr] = 0;
  }
  currentMonthExpenses.forEach(e => {
    const d = e.date ? e.date.substring(0, 10) : '';
    if (dailyMap[d] !== undefined) {
      dailyMap[d] += Number(e.amountBase) || 0;
    }
  });

  let peakDay = null;
  let peakAmount = 0;
  const dailyTrend = Object.entries(dailyMap).map(([date, amount]) => {
    if (amount > peakAmount) {
      peakAmount = amount;
      peakDay = date;
    }
    return {
      date,
      dayNumber: parseInt(date.split('-')[2], 10),
      amount,
    };
  });

  const sortedByAmount = [...currentMonthExpenses].sort((a, b) => (Number(b.amountBase) || 0) - (Number(a.amountBase) || 0));
  const topExpenses = sortedByAmount.slice(0, 5);

  const regretExpenses = currentMonthExpenses.filter(e => e.mood === 'regret');
  const biggestRegret = regretExpenses.sort((a, b) => (Number(b.amountBase) || 0) - (Number(a.amountBase) || 0))[0] || null;

  return {
    totalSpent,
    prevTotalSpent,
    changePercent,
    spentToday,
    safeToday: Math.round(safeToday),
    projectedMonthTotal,
    velocityStatus,
    runOutDay,
    daysElapsed,
    daysRemaining,
    daysInMonth,
    categoryBreakdown,
    spikeAlerts,
    moodCounts,
    moodAmounts,
    dailyTrend,
    peakDay,
    peakAmount,
    topExpenses,
    biggestRegret,
    count: currentMonthExpenses.length,
    totalHours: (totalSpent / (Number(hourlyWage) || 500)).toFixed(1),
  };
}
