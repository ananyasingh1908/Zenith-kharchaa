import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { VaultCard } from '../components/vault/VaultCard';
import { VaultAddModal } from '../components/vault/VaultAddModal';
import { EmptyState } from '../components/ui/EmptyState';
import { CardSkeleton } from '../components/ui/Skeleton';
import { useVault } from '../hooks/useVault';
import { useSettings } from '../hooks/useSettings';
import { useToast } from '../context/ToastContext';
import { formatMoney } from '../utils/money';
import { Shield, Plus, HeartHandshake, Hourglass, CheckCircle2 } from 'lucide-react';

export function Vault() {
  const { items, loading, addItem, buyItem, releaseItem } = useVault();
  const { settings } = useSettings();
  const { showToast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [tab, setTab] = useState('active');

  const baseCurrency = settings.baseCurrency || 'INR';

  const savedByPatience = items
    .filter(i => i.status === 'released')
    .reduce((sum, i) => sum + (Number(i.priceBase) || Number(i.price) || 0), 0);

  const activeWaiting = items
    .filter(i => i.status === 'locked' || i.status === 'ready')
    .reduce((sum, i) => sum + (Number(i.priceBase) || Number(i.price) || 0), 0);

  const readyCount = items.filter(i => {
    const isPast = new Date(i.unlockAt).getTime() <= Date.now();
    return (i.status === 'ready' || (i.status === 'locked' && isPast));
  }).length;

  const filteredItems = items.filter(item => {
    if (tab === 'active') return item.status === 'locked' || item.status === 'ready';
    if (tab === 'released') return item.status === 'released';
    if (tab === 'bought') return item.status === 'bought';
    return true;
  });

  const handleBuy = async (id) => {
    await buyItem(id);
    showToast({ message: 'Item purchased & recorded as mindful expense', type: 'success' });
    window.dispatchEvent(new CustomEvent('kharcha_data_updated'));
  };

  const handleRelease = async (id) => {
    await releaseItem(id);
    showToast({ message: 'Saved by patience! Impulse avoided.', type: 'success' });
  };

  if (loading && items.length === 0) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent border-emerald-500/20">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <HeartHandshake className="w-4 h-4" />
            <span>Saved by Patience</span>
          </div>
          <p className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1">
            {formatMoney(savedByPatience, baseCurrency, 0)}
          </p>
          <span className="text-xs text-slate-400">Total impulses successfully avoided</span>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent border-blue-500/20">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold">
            <Hourglass className="w-4 h-4" />
            <span>Active Cooldown Value</span>
          </div>
          <p className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1">
            {formatMoney(activeWaiting, baseCurrency, 0)}
          </p>
          <span className="text-xs text-slate-400">Undergoing mindful deliberation</span>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent border-purple-500/20">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Ready for Decision</span>
          </div>
          <p className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1">
            {readyCount} items
          </p>
          <span className="text-xs text-slate-400">Cooling-off timer completed</span>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
          <button
            type="button"
            onClick={() => setTab('active')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              tab === 'active'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500'
            }`}
          >
            In Cooldown ({items.filter(i => i.status === 'locked' || i.status === 'ready').length})
          </button>
          <button
            type="button"
            onClick={() => setTab('released')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              tab === 'released'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500'
            }`}
          >
            Saved ({items.filter(i => i.status === 'released').length})
          </button>
          <button
            type="button"
            onClick={() => setTab('bought')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              tab === 'bought'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500'
            }`}
          >
            Purchased ({items.filter(i => i.status === 'bought').length})
          </button>
        </div>

        <Button onClick={() => setIsAddOpen(true)} icon={Plus}>
          Park in Vault
        </Button>
      </div>

      {filteredItems.length === 0 ? (
        <EmptyState
          icon={Shield}
          title="Vault is empty"
          description="Park your desired non-essential purchases here to delay instant gratification."
          actionText="Add Wish to Vault"
          onAction={() => setIsAddOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map(item => (
            <VaultCard
              key={item.id}
              item={item}
              onBuy={handleBuy}
              onRelease={handleRelease}
            />
          ))}
        </div>
      )}

      <VaultAddModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={addItem}
      />
    </div>
  );
}
