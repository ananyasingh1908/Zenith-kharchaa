import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { ExpenseList } from '../components/expenses/ExpenseList';
import { RowSkeleton } from '../components/ui/Skeleton';
import { useExpenses } from '../hooks/useExpenses';

export function Expenses() {
  const { currentMonth, onOpenAddExpense, onEditExpense, onDeleteExpense } = useOutletContext();
  const { expenses, loading } = useExpenses({ month: currentMonth });

  if (loading && expenses.length === 0) {
    return (
      <div className="space-y-3">
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ExpenseList
        expenses={expenses}
        onEdit={onEditExpense}
        onDelete={onDeleteExpense}
        onAddNew={onOpenAddExpense}
      />
    </div>
  );
}
