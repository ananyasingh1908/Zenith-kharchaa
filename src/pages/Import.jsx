import React, { useState, useRef } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { uploadStatement } from '../api/importApi';
import { createExpense } from '../api/expensesApi';
import { CATEGORIES } from '../utils/categories';
import { formatMoney } from '../utils/money';
import { useToast } from '../context/ToastContext';
import { useSettings } from '../hooks/useSettings';
import { UploadCloud, FileSpreadsheet, Check, AlertCircle, FileText } from 'lucide-react';

export function Import() {
  const { settings } = useSettings();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);

  const [dragActive, setDragActive] = useState(false);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fallbackMessage, setFallbackMessage] = useState('');
  const [importing, setImporting] = useState(false);

  const baseCurrency = settings.baseCurrency || 'INR';

  const handleFile = async (file) => {
    if (!file) return;
    setLoading(true);
    setFallbackMessage('');

    try {
      const res = await uploadStatement(file);
      if (res.isPdfFallback) {
        setFallbackMessage(res.message);
        setRows([]);
      } else {
        setRows(res.rows || []);
        showToast({
          message: `Parsed ${res.rows?.length || 0} transactions from ${file.name}`,
          type: 'success',
        });
      }
    } catch (err) {
      showToast({ message: err.message || 'Failed to parse file', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const toggleRow = (id) => {
    setRows(prev => prev.map(r => (r.id === id ? { ...r, selected: !r.selected } : r)));
  };

  const toggleAll = () => {
    const allSelected = rows.every(r => r.selected);
    setRows(prev => prev.map(r => ({ ...r, selected: !allSelected })));
  };

  const changeCategory = (id, newCat) => {
    setRows(prev => prev.map(r => (r.id === id ? { ...r, category: newCat } : r)));
  };

  const handleImportSelected = async () => {
    const selected = rows.filter(r => r.selected);
    if (selected.length === 0) return;

    setImporting(true);
    try {
      for (const row of selected) {
        await createExpense({
          title: row.title,
          amount: row.amount,
          currency: row.currency || baseCurrency,
          category: row.category,
          date: new Date(row.date).toISOString(),
          mood: row.mood || 'worth',
          note: row.note || 'Imported statement entry',
        });
      }

      showToast({
        message: `Imported ${selected.length} transactions into Kharcha`,
        type: 'success',
      });
      setRows([]);
      window.dispatchEvent(new CustomEvent('kharcha_data_updated'));
    } catch (err) {
      showToast({ message: 'Error importing transactions', type: 'error' });
    } finally {
      setImporting(false);
    }
  };

  const selectedCount = rows.filter(r => r.selected).length;
  const selectedSum = rows.filter(r => r.selected).reduce((sum, r) => sum + (r.amount || 0), 0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card className="p-8 text-center space-y-4">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-10 rounded-[28px] border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center ${
            dragActive
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
              : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 bg-slate-50/50 dark:bg-slate-800/30'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv, .pdf, text/csv, application/pdf"
            onChange={(e) => handleFile(e.target.files?.[0])}
            className="hidden"
          />

          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Drop your bank statement here
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Supports HDFC, ICICI, SBI, Axis, Chase, or custom bank .CSV files. Auto-detects columns and tags categories.
          </p>

          <Button size="sm" variant="secondary" className="mt-4" disabled={loading}>
            {loading ? 'Analyzing statement...' : 'Browse files'}
          </Button>
        </div>

        {fallbackMessage && (
          <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs text-slate-700 dark:text-slate-300 text-left flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">PDF Statement Notice:</strong> {fallbackMessage}
            </div>
          </div>
        )}
      </Card>

      {rows.length > 0 && (
        <Card className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Parsed Transactions</h3>
              <p className="text-xs text-slate-400">Review auto-tagged categories before importing.</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleAll}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                {rows.every(r => r.selected) ? 'Deselect All' : 'Select All'}
              </button>

              <Button
                size="sm"
                disabled={selectedCount === 0 || importing}
                onClick={handleImportSelected}
                icon={Check}
              >
                {importing ? 'Importing...' : `Import ${selectedCount} (${formatMoney(selectedSum, baseCurrency, 0)})`}
              </Button>
            </div>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto no-scrollbar">
            {rows.map(row => (
              <div
                key={row.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  row.selected
                    ? 'bg-white/80 dark:bg-slate-800/80 border-blue-500/40'
                    : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <input
                    type="checkbox"
                    checked={row.selected}
                    onChange={() => toggleRow(row.id)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{row.title}</p>
                    <p className="text-[11px] text-slate-400">{row.date}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <select
                    value={row.category}
                    onChange={(e) => changeCategory(row.id, e.target.value)}
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-none focus:ring-1 focus:ring-blue-500"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <span className="text-sm font-black text-slate-900 dark:text-white min-w-[70px] text-right">
                    {formatMoney(row.amount, baseCurrency, 0)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
