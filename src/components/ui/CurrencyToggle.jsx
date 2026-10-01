import React from 'react';
import { useSettings } from '../../hooks/useSettings';
import { formatMoney, convertAmount } from '../../utils/money';

export function CurrencyToggle({
  amount = 0,
  currency = 'INR',
  onChangeCurrency,
  showConvertedPreview = true,
  className = '',
}) {
  const { settings } = useSettings();
  const rate = settings.usdRate || 83;
  const targetCurrency = currency === 'INR' ? 'USD' : 'INR';
  const convertedValue = convertAmount(amount || 0, currency, targetCurrency, rate);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
        <button
          type="button"
          onClick={() => onChangeCurrency('INR')}
          className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
            currency === 'INR'
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          ₹ INR
        </button>
        <button
          type="button"
          onClick={() => onChangeCurrency('USD')}
          className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
            currency === 'USD'
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          $ USD
        </button>
      </div>

      {showConvertedPreview && amount > 0 && (
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          ≈ {formatMoney(convertedValue, targetCurrency, 2)}
          <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-1.5">
            (@ ₹{rate}/$)
          </span>
        </p>
      )}
    </div>
  );
}
