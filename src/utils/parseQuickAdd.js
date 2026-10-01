import { detectCategory } from './categories';

export function parseQuickAdd(input = '', defaultCurrency = 'INR') {
  if (!input || !input.trim()) {
    return {
      title: '',
      amount: '',
      currency: defaultCurrency,
      category: 'Food & Dining',
      isValid: false,
    };
  }

  const raw = input.trim();
  let currency = defaultCurrency;
  let amountStr = '';
  let title = raw;

  const usdMatch = raw.match(/\$\s*(\d+(?:\.\d+)?)/);
  const inrMatch = raw.match(/(?:₹|rs\.?|inr)\s*(\d+(?:\.\d+)?)/i);
  const trailingNumberMatch = raw.match(/(\d+(?:\.\d+)?)\s*$/);
  const generalNumberMatch = raw.match(/\b(\d+(?:\.\d+)?)\b/);

  if (usdMatch) {
    currency = 'USD';
    amountStr = usdMatch[1];
    title = raw.replace(usdMatch[0], '').trim();
  } else if (inrMatch) {
    currency = 'INR';
    amountStr = inrMatch[1];
    title = raw.replace(inrMatch[0], '').trim();
  } else if (trailingNumberMatch) {
    amountStr = trailingNumberMatch[1];
    title = raw.slice(0, raw.lastIndexOf(amountStr)).trim();
  } else if (generalNumberMatch) {
    amountStr = generalNumberMatch[1];
    title = raw.replace(generalNumberMatch[0], '').trim();
  }

  title = title.replace(/\s+/g, ' ').trim();
  if (!title && raw) {
    title = 'Quick Expense';
  }

  const suggestedCategory = detectCategory(`${title} ${raw}`);

  return {
    title,
    amount: amountStr ? parseFloat(amountStr) : '',
    currency,
    category: suggestedCategory,
    isValid: Boolean(amountStr && parseFloat(amountStr) > 0 && title),
  };
}
