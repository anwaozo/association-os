'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminRoute from '@/app/components/AdminRoute';
import { useApiClient } from '@/lib/apiClient';
import { downloadCsv, fileSafe } from '@/lib/csv';
import { STATUS, displaySubject } from '@/app/message/DeliveryLog';
import { useAuth } from '@/context/AuthContext';
import { Mail, ChevronRight, Download, Users } from 'lucide-react';

const RECIPIENT_STATUS = {
   pending: 'text-gray-700 bg-gray-100',
   sent: 'text-blue-700 bg-blue-100',
   delivered: 'text-green-700 bg-green-100',
   bounced: 'text-red-700 bg-red-100',
   failed: 'text-red-700 bg-red-100',
};
const fmt = (d) => (d ? new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '');

function MessageDetailPageInner() {
   const { id } = useParams();
   const api = useApiClient();
   const router = useRouter();
   const [m, setM] = useState(null);
   const { state } = useAuth();
   const subject = m ? displaySubject(m.subject, state?.organization?.name) : '';

   useEffect(() => {
      api.get(`/messages/${id}`).then((r) => {
         if (['draft', 'ready'].includes(r.data.status)) router.replace(`/message/add?edit=${id}`);
         else setM(r.data);
      }).catch(() => {});
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [id]);

   const exportCsv = () => downloadCsv(`${fileSafe(m.subject)}-recipients.csv`, [
      { header: 'Name', value: (r) => r.name },
      { header: 'Email', value: (r) => r.email },
      { header: 'Status', value: (r) => r.status },
      { header: 'Sent', value: (r) => r.sentAt },
      { header: 'Delivered', value: (r) => r.deliveredAt },
      { header: 'Opened', value: (r) => r.openedAt },
      { header: 'Clicked', value: (r) => r.clickedAt },
      { header: 'Error', value: (r) => r.error },
   ], m.recipients);

   return (
      <>
         {!m ? <p className="text-gray-500">Loading…</p> : (
            <div className="space-y-6">
               <nav className="flex items-center space-x-2 text-sm font-medium">
                  <button onClick={() => router.push('/message')} className="flex items-center hover:text-[var(--brand)]"><Mail className="w-5 h-4 mr-1" /> Messages</button>
                  <ChevronRight size={16} />
                  <span className="text-gray-900 truncate max-w-md">{subject}</span>
               </nav>

               <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                     <h1 className="text-2xl font-bold text-gray-900">{subject}</h1>
                     <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                        <Users size={14} /> {m.audienceLabel} · Sent {fmt(m.sentAt)}
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${(STATUS[m.status] || STATUS.sent).cls}`}>{(STATUS[m.status] || STATUS.sent).label}</span>
                     </p>
                  </div>
                  <button onClick={exportCsv} className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 self-start"><Download size={16} /> Export CSV</button>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[['Sent', m.stats.sent], ['Delivered', m.stats.delivered], ['Opened', m.stats.opened], ['Clicked', m.stats.clicked], ['Failed', m.stats.failed]].map(([label, v]) => (
                     <div key={label} className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                        <p className={`text-2xl font-bold ${label === 'Failed' && v > 0 ? 'text-red-600' : 'text-gray-900'}`}>{v}</p>
                        <p className="text-sm text-gray-500">{label}</p>
                     </div>
                  ))}
               </div>

               <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="font-semibold text-gray-900 mb-3">Message</h2>
                  <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{m.body}</div>
               </div>

               <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
                  <table className="min-w-full text-sm">
                     <thead className="bg-gray-50 text-left text-gray-600">
                        <tr>
                           <th className="px-4 py-3 font-medium">Recipient</th>
                           <th className="px-4 py-3 font-medium">Status</th>
                           <th className="px-4 py-3 font-medium">Opened</th>
                           <th className="px-4 py-3 font-medium">Clicked</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                        {m.recipients.map((r) => (
                           <tr key={r.id}>
                              <td className="px-4 py-3"><div className="font-medium text-gray-900">{r.name || r.email}</div><div className="text-gray-500">{r.email}</div></td>
                              <td className="px-4 py-3">
                                 <span className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${RECIPIENT_STATUS[r.status] || RECIPIENT_STATUS.pending}`}>{r.status}</span>
                                 {r.error && <div className="text-xs text-red-600 mt-1">{r.error}</div>}
                              </td>
                              <td className="px-4 py-3 text-gray-600">{fmt(r.openedAt) || '—'}</td>
                              <td className="px-4 py-3 text-gray-600">{fmt(r.clickedAt) || '—'}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         )}
      </>
   );
}

// The admin check runs before the page mounts, so members never trigger its API calls.
export default function MessageDetailPage() {
   return (
      <AdminRoute>
         <MessageDetailPageInner />
      </AdminRoute>
   );
}
