'use client';
import { useState } from 'react';
import Currency from '@/app/components/Currency';
import { Search, Download, Plus, Trash2, RotateCcw } from 'lucide-react';
import { downloadCsv, isoDay } from '@/lib/csv';

const METHOD_LABEL = { stripe: 'Online', cash: 'Cash', check: 'Check', other: 'Other' };
const STATUS_STYLE = {
   succeeded: 'bg-green-100 text-green-700',
   refunded: 'bg-gray-200 text-gray-700',
   pending: 'bg-amber-100 text-amber-800',
   failed: 'bg-red-100 text-red-700',
};

export default function DonationsTable({ data, campaigns = [], onRecord, onDelete, onRefund, refundingId }) {
   const [searchTerm, setSearchTerm] = useState('');
   const [campaignId, setCampaignId] = useState('');
   const [method, setMethod] = useState('');

   const q = searchTerm.toLowerCase();
   const filtered = data.filter((d) => {
      const text = `${d.donorName || ''} ${d.donorEmail || ''} ${d.campaign?.name || ''} ${(d.amountCents / 100).toFixed(2)}`.toLowerCase();
      return text.includes(q)
         && (!campaignId || String(d.campaignId) === campaignId)
         && (!method || (method === 'offline' ? d.method !== 'stripe' : d.method === method));
   });

   const exportCsv = () => downloadCsv(`donations-${isoDay(new Date())}.csv`, [
      { header: 'Date', value: (d) => isoDay(d.paidAt || d.createdAt) },
      { header: 'Donor', value: (d) => d.donorName },
      { header: 'Email', value: (d) => d.donorEmail },
      { header: 'Anonymous', value: (d) => (d.isAnonymous ? 'Yes' : 'No') },
      { header: 'Amount', value: (d) => (d.amountCents / 100).toFixed(2) },
      { header: 'Method', value: (d) => METHOD_LABEL[d.method] || d.method },
      { header: 'Status', value: (d) => d.status },
      { header: 'Campaign', value: (d) => d.campaign?.name || '' },
      { header: 'Note', value: (d) => d.note },
   ], filtered);

   return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mt-8">
         <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-900">Donations</h2>
            <div className="flex gap-2">
               <button onClick={exportCsv} disabled={!filtered.length} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm disabled:opacity-50">
                  <Download className="w-4 h-4" /> Export CSV
               </button>
               <button onClick={onRecord} className="flex items-center gap-2 px-4 py-2 bg-[var(--brand)] text-white rounded-lg font-medium text-sm">
                  <Plus className="w-4 h-4" /> Record a gift
               </button>
            </div>
         </div>

         <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="relative flex-1">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
               <input
                  type="text"
                  placeholder="Search by name, email, campaign, amount"
                  className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-lg py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]/30"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
            <select value={campaignId} onChange={(e) => setCampaignId(e.target.value)} className="bg-gray-50 border border-gray-300 rounded-lg py-2 px-3 text-sm">
               <option value="">All campaigns</option>
               {campaigns.map((c) => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
            </select>
            <select value={method} onChange={(e) => setMethod(e.target.value)} className="bg-gray-50 border border-gray-300 rounded-lg py-2 px-3 text-sm">
               <option value="">All methods</option>
               <option value="stripe">Online</option>
               <option value="offline">Offline (cash, check, other)</option>
            </select>
         </div>

         <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
               <thead>
                  <tr className="bg-gray-50">
                     {['Donor', 'Amount', 'Method', 'Date', 'Campaign', ''].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                     ))}
                  </tr>
               </thead>
               <tbody className="bg-white divide-y divide-gray-100">
                  {filtered.map((d) => (
                     <tr key={d.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">
                           <div className="font-medium text-gray-900">{d.donorName || 'Unknown donor'}{d.isAnonymous && <span className="ml-2 text-xs text-gray-500">(asked to be anonymous)</span>}</div>
                           <div className="text-gray-500">{d.donorEmail}</div>
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900 whitespace-nowrap">
                           <Currency amount={d.amountCents / 100} />
                           {d.status !== 'succeeded' && <span className={`ml-2 px-2 py-0.5 text-xs rounded-full capitalize ${STATUS_STYLE[d.status]}`}>{d.status}</span>}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{METHOD_LABEL[d.method] || d.method}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{new Date(d.paidAt || d.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{d.campaign?.name || 'General'}</td>
                        <td className="px-4 py-3 text-right">
                           {d.method !== 'stripe' && (
                              <button onClick={() => onDelete(d)} aria-label="Delete gift" title="Delete this recorded gift" className="p-1.5 text-gray-400 hover:text-red-600 rounded"><Trash2 size={16} /></button>
                           )}
                           {d.method === 'stripe' && d.status === 'succeeded' && onRefund && (
                              <button
                                 onClick={() => onRefund(d)}
                                 disabled={refundingId === d.id}
                                 title="Refund this online gift through Stripe"
                                 className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-red-50 hover:text-red-700 hover:border-red-300 disabled:opacity-50 whitespace-nowrap"
                              >
                                 <RotateCcw size={12} /> {refundingId === d.id ? 'Refunding…' : 'Refund'}
                              </button>
                           )}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         {filtered.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">
               {data.length ? 'No donations match your filters.' : 'No donations yet. Online gifts appear here automatically, and you can record cash or check gifts with “Record a gift”.'}
            </div>
         )}
      </div>
   );
}
