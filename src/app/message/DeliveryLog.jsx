'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Search, Clock, Users, Send, Pencil } from 'lucide-react';
import { timeAgo } from '@/lib/time';
import { useApiClient } from '@/lib/apiClient';
import { useToast } from '@/app/components/toast/ToastContext';
import { useAuth } from '@/context/AuthContext';

// Subjects are stored with merge fields; show the organization name in lists.
export const displaySubject = (subject, orgName) => String(subject || '').replace(/\{\{\s*organization\s*\}\}/gi, orgName || 'your organization');

export const STATUS = {
   draft: { label: 'Draft', cls: 'text-gray-700 bg-gray-100' },
   ready: { label: 'Ready to send', cls: 'text-amber-800 bg-amber-100' },
   sending: { label: 'Sending…', cls: 'text-blue-700 bg-blue-100' },
   sent: { label: 'Sent', cls: 'text-green-700 bg-green-100' },
   partial: { label: 'Partly sent', cls: 'text-orange-700 bg-orange-100' },
   failed: { label: 'Failed', cls: 'text-red-700 bg-red-100' },
};

const FILTERS = [
   { id: 'all', label: 'All' },
   { id: 'sent', label: 'Sent' },
   { id: 'unsent', label: 'Drafts & ready' },
];

export default function DeliveryLog({ messages, emailEnabled, onChange }) {
   const api = useApiClient();
   const { showToast } = useToast();
   const { state } = useAuth();
   const orgName = state?.organization?.name;
   const [searchTerm, setSearchTerm] = useState('');
   const [filter, setFilter] = useState('all');
   const [busy, setBusy] = useState(null);

   const q = searchTerm.toLowerCase();
   const filtered = messages.filter((m) => {
      const matches = `${m.subject} ${m.audienceLabel}`.toLowerCase().includes(q);
      const unsent = ['draft', 'ready'].includes(m.status);
      return matches && (filter === 'all' || (filter === 'unsent' ? unsent : !unsent));
   });

   const send = async (m) => {
      if (!window.confirm(`Send "${displaySubject(m.subject, orgName)}" to ${m.audienceLabel} (${m.recipientCount} ${m.recipientCount === 1 ? 'person' : 'people'})?`)) return;
      setBusy(m.id);
      try {
         const res = await api.post(`/messages/${m.id}/send`);
         if (res.status === 202) showToast('Email isn’t connected yet. The message stays ready to send.', 'info');
         else showToast(`Sent to ${res.data.sentCount} ${res.data.sentCount === 1 ? 'person' : 'people'}`, 'success');
         onChange();
      } catch {
         // toast shown by the API client
      } finally {
         setBusy(null);
      }
   };

   return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
         <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Delivery Log</h2>
            <p className="text-sm text-gray-600">Sent messages with delivery and engagement, plus drafts waiting to go out</p>
         </div>

         <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
               <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by subject or audience"
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]/30"
               />
            </div>
            <div className="flex gap-2">
               {FILTERS.map((f) => (
                  <button key={f.id} onClick={() => setFilter(f.id)} className={`px-3 py-1.5 rounded-full text-sm font-medium border ${filter === f.id ? 'bg-[var(--brand)] text-white border-[var(--brand)]' : 'bg-white text-gray-700 border-gray-300'}`}>
                     {f.label}
                  </button>
               ))}
            </div>
         </div>

         <div className="divide-y divide-gray-100">
            {filtered.map((m) => {
               const st = STATUS[m.status] || STATUS.draft;
               const unsent = ['draft', 'ready'].includes(m.status);
               const s = m.stats || {};
               return (
                  <div key={m.id} className="p-4">
                     <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="min-w-0">
                           <Link href={unsent ? `/message/add?edit=${m.id}` : `/message/${m.id}`} className="text-base font-semibold text-gray-900 hover:text-[var(--brand)]">{displaySubject(m.subject, orgName)}</Link>
                           <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mt-1">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"><Users size={12} /> {m.audienceLabel}</span>
                              <Clock size={14} />
                              <span>{timeAgo(m.sentAt || m.createdAt)}</span>
                           </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                           <span className={`px-2 py-1 text-xs font-medium rounded-full ${st.cls}`}>{st.label}</span>
                           {unsent && (
                              <>
                                 <Link href={`/message/add?edit=${m.id}`} className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50"><Pencil size={14} /> Edit</Link>
                                 <button
                                    onClick={() => send(m)}
                                    disabled={busy === m.id || !emailEnabled}
                                    title={emailEnabled ? 'Send now' : 'Email sending is not connected yet'}
                                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-[var(--brand)] rounded-lg disabled:opacity-50"
                                 >
                                    <Send size={14} /> {busy === m.id ? 'Sending…' : 'Send'}
                                 </button>
                              </>
                           )}
                        </div>
                     </div>

                     {unsent ? (
                        <p className="text-sm text-gray-500">{m.recipientCount} {m.recipientCount === 1 ? 'recipient' : 'recipients'} when sent</p>
                     ) : (
                        <div className="grid grid-cols-5 gap-4 text-center">
                           {[['Sent', s.sent], ['Delivered', s.delivered], ['Opened', s.opened], ['Clicked', s.clicked], ['Failed', s.failed]].map(([label, value]) => (
                              <div key={label}>
                                 <p className="text-xl font-bold text-gray-900">{value ?? 0}</p>
                                 <p className={`text-sm font-medium ${label === 'Failed' && value > 0 ? 'text-red-500' : 'text-gray-500'}`}>{label}</p>
                              </div>
                           ))}
                        </div>
                     )}
                  </div>
               );
            })}
            {filtered.length === 0 && (
               <p className="px-6 py-10 text-center text-gray-500">
                  {messages.length === 0 ? 'No messages yet. Use Compose Message to send your first email.' : 'No messages match your filters.'}
               </p>
            )}
         </div>
      </div>
   );
}
