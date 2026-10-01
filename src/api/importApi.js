import { request, isRealBackend } from './client';
import { parseCSV } from '../utils/csv';

export async function uploadStatement(file) {
  if (isRealBackend) {
    const formData = new FormData();
    formData.append('file', file);
    return request('/import', {
      method: 'POST',
      body: formData,
      headers: {},
    });
  }

  await new Promise(r => setTimeout(r, 300));

  if (file.name.endsWith('.csv') || file.type.includes('csv') || file.type.includes('text')) {
    const text = await file.text();
    const rows = parseCSV(text);
    return { rows };
  }

  if (file.name.endsWith('.pdf') || file.type.includes('pdf')) {
    return {
      rows: [],
      message: 'PDF parsing is powered by the Kharcha REST backend. In standalone demo mode, please upload a .CSV bank statement to auto-import.',
      isPdfFallback: true,
    };
  }

  const text = await file.text();
  const rows = parseCSV(text);
  return { rows };
}
