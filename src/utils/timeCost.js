export function getHourlyWage(settings = {}) {
  const mode = settings.incomeType || 'monthly';
  if (mode === 'hourly') {
    return Math.max(1, Number(settings.hourlyWage) || 500);
  }
  const monthly = Number(settings.monthlyIncome) || 80000;
  return Math.max(1, monthly / 160);
}

export function formatTimeCost(amount = 0, hourlyWage = 500) {
  const wage = Math.max(1, Number(hourlyWage) || 500);
  const totalHours = Number(amount) / wage;

  if (totalHours < 0.01) {
    return '0m';
  }

  if (totalHours < 1) {
    const mins = Math.max(1, Math.round(totalHours * 60));
    return `${mins}m`;
  }

  return `${totalHours.toFixed(1)}h`;
}

export function getTimeCostVerbose(amount = 0, hourlyWage = 500) {
  const wage = Math.max(1, Number(hourlyWage) || 500);
  const totalHours = Number(amount) / wage;

  if (totalHours < 1) {
    const mins = Math.max(1, Math.round(totalHours * 60));
    return `${mins} mins of work`;
  }

  return `${totalHours.toFixed(1)} hrs of work`;
}
