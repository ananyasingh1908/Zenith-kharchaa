export function getCurrentMonthKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function getPreviousMonthKey(monthKey) {
  const [year, month] = monthKey.split('-').map(Number);
  const date = new Date(year, month - 2, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function getNextMonthKey(monthKey) {
  const [year, month] = monthKey.split('-').map(Number);
  const date = new Date(year, month, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function formatMonthDisplay(monthKey) {
  if (!monthKey) return '';
  const [year, month] = monthKey.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function formatDateLabel(dateStr) {
  if (!dateStr) return '';
  const target = new Date(dateStr);
  const now = new Date();
  const isToday = target.toDateString() === now.toDateString();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = target.toDateString() === yesterday.toDateString();

  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';

  return target.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function formatFullDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function getDaysInMonth(monthKey) {
  const [year, month] = monthKey.split('-').map(Number);
  return new Date(year, month, 0).getDate();
}

export function getDaysElapsedInMonth(monthKey) {
  const currentKey = getCurrentMonthKey();
  const totalDays = getDaysInMonth(monthKey);
  if (monthKey < currentKey) return totalDays;
  if (monthKey > currentKey) return 0;
  return new Date().getDate();
}

export function getDaysRemainingInMonth(monthKey) {
  const totalDays = getDaysInMonth(monthKey);
  const elapsed = getDaysElapsedInMonth(monthKey);
  return Math.max(1, totalDays - elapsed + 1);
}

export function groupByDate(items) {
  const groups = {};
  items.forEach(item => {
    const d = item.date ? item.date.split('T')[0] : '';
    if (!groups[d]) groups[d] = [];
    groups[d].push(item);
  });
  return Object.keys(groups)
    .sort((a, b) => new Date(b) - new Date(a))
    .map(date => ({
      date,
      label: formatDateLabel(date),
      items: groups[date],
    }));
}
