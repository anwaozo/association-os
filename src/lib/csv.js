// Turn rows into a CSV file and download it in the browser.
// columns: [{ header: 'Name', value: (row) => row.name }, ...]
const cell = (v) => {
   if (v === null || v === undefined) return '';
   let s = String(v);
   // Stop spreadsheet apps from running values as formulas.
   if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
   return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function downloadCsv(filename, columns, rows) {
   const lines = [
      columns.map((c) => cell(c.header)).join(','),
      ...rows.map((r) => columns.map((c) => cell(c.value(r))).join(',')),
   ];
   const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
   const url = URL.createObjectURL(blob);
   const a = document.createElement('a');
   a.href = url;
   a.download = filename;
   document.body.appendChild(a);
   a.click();
   a.remove();
   setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const fileSafe = (s) => String(s || 'export').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'export';

export const isoDay = (d) => {
   if (!d) return '';
   const t = new Date(d);
   return Number.isNaN(t.getTime()) ? '' : t.toISOString().slice(0, 10);
};
