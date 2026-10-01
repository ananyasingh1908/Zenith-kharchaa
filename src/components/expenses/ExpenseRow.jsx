import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { formatMoney } from '../../utils/money';
import { formatTimeCost } from '../../utils/timeCost';
import { getCategoryById } from '../../utils/categories';
import { useSettings } from '../../hooks/useSettings';
import {
  Utensils,
  Car,
  Gamepad2,
  Receipt,
  ShoppingBag,
  HeartPulse,
  Zap,
  Sparkles,
  CircleDot,
  Edit2,
  Trash2,
  Smile,
  Meh,
  Frown,
} from 'lucide-react';

const ICON_MAP = {
  Utensils,
  Car,
  Gamepad2,
  Receipt,
  ShoppingBag,
  HeartPulse,
  Zap,
  Sparkles,
  CircleDot,
};

export function ExpenseRow({ expense, onEdit, onDelete }) {
  const { settings, hourlyWage } = useSettings();
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const deleteOpacity = useTransform(x, [-100, -20, 0], [1, 0.5, 0]);
  const editOpacity = useTransform(x, [0, 20, 100], [0, 0.5, 1]);

  const cat = getCategoryById(expense.category);
  const IconComponent = ICON_MAP[cat.icon] || CircleDot;
  const baseCurrency = settings.baseCurrency || 'INR';

  const moodIcons = {
    worth: <Smile className="w-3 h-3 text-emerald-500" />,
    meh: <Meh className="w-3 h-3 text-amber-500" />,
    regret: <Frown className="w-3 h-3 text-rose-500" />,
  };

  const handleDragEnd = (_, info) => {
    if (info.offset.x < -80 && onDelete) {
      onDelete(expense);
    } else if (info.offset.x > 80 && onEdit) {
      onEdit(expense);
    }
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        style={{ opacity: editOpacity }}
        className="absolute inset-y-0 left-0 w-20 bg-blue-500 flex items-center justify-center text-white rounded-2xl z-0"
      >
        <Edit2 className="w-5 h-5" />
      </motion.div>

      <motion.div
        style={{ opacity: deleteOpacity }}
        className="absolute inset-y-0 right-0 w-20 bg-rose-500 flex items-center justify-center text-white rounded-2xl z-0"
      >
        <Trash2 className="w-5 h-5" />
      </motion.div>

      <motion.div
        style={{ x }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.4}
        onDragEnd={handleDragEnd}
        className="relative z-10 flex items-center justify-between p-3.5 bg-white/70 dark:bg-slate-900/70 hover:bg-white/90 dark:hover:bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-100 dark:border-slate-800/80 transition-colors select-none"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: cat.bgColor, color: cat.color }}
          >
            <IconComponent className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{expense.title}</p>
              {expense.mood && moodIcons[expense.mood]}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-slate-400 font-medium">{cat.name}</span>
              {expense.note && (
                <>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="text-xs text-slate-400 truncate max-w-[140px]">{expense.note}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {formatMoney(expense.amount, expense.currency || baseCurrency, 0)}
            </p>
            <p className="text-[11px] font-semibold text-slate-400">
              {formatTimeCost(expense.amountBase || expense.amount, hourlyWage)}
            </p>
          </div>

          <div className="hidden md:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => onEdit && onEdit(expense)}
              className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
              aria-label="Edit expense"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete && onDelete(expense)}
              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
              aria-label="Delete expense"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
