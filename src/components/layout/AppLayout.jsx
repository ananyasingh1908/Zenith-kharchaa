import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { ExpenseSheet } from '../expenses/ExpenseSheet';
import { VaultAddModal } from '../vault/VaultAddModal';
import { getCurrentMonthKey } from '../../utils/dates';
import { createExpense, updateExpense, deleteExpense } from '../../api/expensesApi';
import { createVaultItem } from '../../api/vaultApi';
import { useToast } from '../../context/ToastContext';

export function AppLayout({ currentMonth, onMonthChange }) {
  const location = useLocation();
  const { showToast } = useToast();

  const [isExpenseSheetOpen, setIsExpenseSheetOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);
  const [vaultDraft, setVaultDraft] = useState(null);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return '';
      case '/expenses':
        return 'Expense Ledger';
      case '/vault':
        return 'Mindful Vault';
      case '/insights':
        return 'Financial Insights';
      case '/budgets':
        return 'Budget Caps';
      case '/import':
        return 'Statement Import';
      case '/settings':
        return 'Preferences';
      default:
        return '';
    }
  };

  const showMonthPicker = ['/', '/expenses', '/insights', '/budgets'].includes(location.pathname);

  const handleOpenAddExpense = () => {
    setEditingExpense(null);
    setIsExpenseSheetOpen(true);
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setIsExpenseSheetOpen(true);
  };

  const handleSaveExpense = async (data) => {
    if (data.id) {
      await updateExpense(data.id, data);
      showToast({ message: 'Expense updated successfully', type: 'success' });
    } else {
      await createExpense(data);
      showToast({ message: 'Expense recorded', type: 'success' });
    }
    window.dispatchEvent(new CustomEvent('kharcha_data_updated'));
  };

  const handleDeleteExpense = async (expense) => {
    await deleteExpense(expense.id);
    window.dispatchEvent(new CustomEvent('kharcha_data_updated'));

    showToast({
      message: `Deleted "${expense.title}"`,
      type: 'info',
      actionText: 'Undo',
      duration: 5000,
      onAction: async () => {
        await createExpense(expense);
        window.dispatchEvent(new CustomEvent('kharcha_data_updated'));
      },
    });
  };

  const handleMoveToVault = (draft) => {
    setVaultDraft(draft);
    setIsVaultModalOpen(true);
  };

  const handleAddVault = async (data) => {
    await createVaultItem(data);
    showToast({ message: 'Parked in Vault for cooldown', type: 'success' });
    window.dispatchEvent(new CustomEvent('kharcha_data_updated'));
  };

  return (
    <div className="flex min-h-screen bg-[#F6F8FB] dark:bg-[#090D16] text-slate-900 dark:text-slate-100">
      <Sidebar onOpenAddExpense={handleOpenAddExpense} />

      <div className="flex-1 flex flex-col min-w-0 pb-24 md:pb-8">
        <Header
          currentMonth={currentMonth}
          onMonthChange={onMonthChange}
          title={getPageTitle()}
          showMonthPicker={showMonthPicker}
        />

        <main className="flex-1 px-4 md:px-8 py-6 max-w-7xl w-full mx-auto">
          <Outlet
            context={{
              currentMonth,
              onOpenAddExpense: handleOpenAddExpense,
              onEditExpense: handleEditExpense,
              onDeleteExpense: handleDeleteExpense,
            }}
          />
        </main>
      </div>

      <BottomNav onOpenAddExpense={handleOpenAddExpense} />

      <ExpenseSheet
        isOpen={isExpenseSheetOpen}
        onClose={() => setIsExpenseSheetOpen(false)}
        initialExpense={editingExpense}
        onSave={handleSaveExpense}
        onDelete={handleDeleteExpense}
        onMoveToVault={handleMoveToVault}
      />

      <VaultAddModal
        isOpen={isVaultModalOpen}
        onClose={() => setIsVaultModalOpen(false)}
        onAdd={handleAddVault}
        initialDraft={vaultDraft}
      />
    </div>
  );
}
