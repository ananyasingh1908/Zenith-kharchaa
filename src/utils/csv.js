import { detectCategory } from './categories';

export function parseCSV(text = '') {
  const lines = text.split(/\r\n|\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];

  const headerLine = lines[0];
  const headers = parseCSVRow(headerLine).map(h => h.toLowerCase().trim());

  let dateIdx = headers.findIndex(h => h.includes('date') || h.includes('txn date') || h.includes('time'));
  let descIdx = headers.findIndex(h => h.includes('desc') || h.includes('narration') || h.includes('detail') || h.includes('particular') || h.includes('title') || h.includes('remark'));
  let amountIdx = headers.findIndex(h => h.includes('debit') || h.includes('amount') || h.includes('spent') || h.includes('cost') || h.includes('price') || h.includes('withdrawal'));

  if (dateIdx === -1) dateIdx = 0;
  if (descIdx === -1) descIdx = Math.min(1, headers.length - 1);
  if (amountIdx === -1) amountIdx = Math.min(2, headers.length - 1);

  const results = [];

  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVRow(lines[i]);
    if (!row || row.length === 0) continue;

    const rawDate = row[dateIdx] || new Date().toISOString().split('T')[0];
    const rawDesc = row[descIdx] || 'Imported Expense';
    const rawAmountStr = (row[amountIdx] || '0').replace(/[^0-9.-]+/g, '');
    const amount = Math.abs(parseFloat(rawAmountStr)) || 0;

    if (amount > 0) {
      let formattedDate = rawDate;
      const parsedDate = new Date(rawDate);
      if (!isNaN(parsedDate.getTime())) {
        formattedDate = parsedDate.toISOString().split('T')[0];
      } else {
        const parts = rawDate.split(/[-/.]/);
        if (parts.length === 3) {
          if (parts[2].length === 4) {
            formattedDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
          } else if (parts[0].length === 4) {
            formattedDate = `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
          }
        }
      }

      const category = detectCategory(rawDesc);

      results.push({
        id: `import-${Date.now()}-${i}`,
        title: rawDesc,
        amount,
        currency: 'INR',
        amountBase: amount,
        category,
        date: formattedDate,
        mood: 'worth',
        note: 'Imported from bank statement',
        selected: true,
      });
    }
  }

  return results;
}

function parseCSVRow(rowStr) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < rowStr.length; i++) {
    const char = rowStr[i];
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export function exportExpensesToCSV(expenses = [], filename = 'kharcha_expenses.csv') {
  const headers = ['ID', 'Date', 'Title', 'Amount', 'Currency', 'AmountBase', 'Category', 'Mood', 'Note'];
  const rows = expenses.map(e => [
    `"${e.id || ''}"`,
    `"${e.date || ''}"`,
    `"${(e.title || '').replace(/"/g, '""')}"`,
    e.amount || 0,
    `"${e.currency || 'INR'}"`,
    e.amountBase || e.amount || 0,
    `"${e.category || 'Other & Cash'}"`,
    `"${e.mood || 'worth'}"`,
    `"${(e.note || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
