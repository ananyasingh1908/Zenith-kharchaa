export function formatMoney(amount, currency = 'INR', decimals = 0) {
  const num = Number(amount) || 0;
  const isINR = currency === 'INR';
  return new Intl.NumberFormat(isINR ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency: isINR ? 'INR' : 'USD',
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(num);
}

export function formatCompactNumber(amount, currency = 'INR') {
  const num = Number(amount) || 0;
  const isINR = currency === 'INR';
  return new Intl.NumberFormat(isINR ? 'en-IN' : 'en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(num);
}

export function convertAmount(amount, fromCurrency, toCurrency, usdRate = 83) {
  const num = Number(amount) || 0;
  const rate = Number(usdRate) || 83;
  if (fromCurrency === toCurrency) return num;
  if (fromCurrency === 'USD' && toCurrency === 'INR') {
    return Math.round(num * rate * 100) / 100;
  }
  if (fromCurrency === 'INR' && toCurrency === 'USD') {
    return Math.round((num / rate) * 100) / 100;
  }
  return num;
}
