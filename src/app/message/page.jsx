'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Header from '@/app/components/Header';
import AdminRoute from '@/app/components/AdminRoute';
import MessageList from '@/app/message/MessageList';
import DeliveryLog from '@/app/message/DeliveryLog';
import { useApiClient } from '@/lib/apiClient';
import { ListOrdered, FileText, Plus, Info } from 'lucide-react';

function MessagePageInner() {
   const api = useApiClient();
   const [activeTab, setActiveTab] = useState('log');
   const [templates, setTemplates] = useState([]);
   const [messages, setMessages] = useState([]);
   const [emailEnabled, setEmailEnabled] = useState(true);
   const [loading, setLoading] = useState(true);

   const load = useCallback(async () => {
      setLoading(true);
      try {
         const [t, m, c] = await Promise.all([
            api.get('/messages/templates'),
            api.get('/messages'),
            api.get('/messages/config', { silent: true }),
         ]);
         setTemplates(t.data);
         setMessages(m.data);
         setEmailEnabled(Boolean(c.data?.emailEnabled));
      } catch {
         // toast shown by the API client
      } finally {
         setLoading(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   useEffect(() => { load(); }, [load]);

   const tabs = [
      { id: 'log', label: 'Sent & Drafts', icon: FileText },
      { id: 'templates', label: 'Templates', icon: ListOrdered },
   ];

   return (
      <>
         <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <Header title="Messages" subTitle="Email your members, track delivery, and manage reusable templates" />
            <Link href="/message/add" className="flex items-center gap-2 px-4 py-2 bg-[var(--brand)] text-white rounded-lg font-medium shadow-sm self-start">
               <Plus size={18} /> Compose Message
            </Link>
         </div>

         {!emailEnabled && (
            <div className="mb-6 flex gap-3 items-start p-4 rounded-lg border border-amber-200 bg-amber-50 text-amber-900 text-sm">
               <Info size={18} className="shrink-0 mt-0.5" />
               <p>
                  Email sending isn’t switched on yet. You can write messages and choose who gets them. Pressing <b>Send</b> saves them as <b>Ready to send</b>, and you can send them with one click once email is connected.
               </p>
            </div>
         )}

         <div className="flex items-center gap-8 border-b border-gray-200 mb-8">
            {tabs.map((tab) => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-3 text-sm font-semibold flex items-center space-x-2 transition-colors ${activeTab === tab.id ? 'text-[var(--brand)] border-b-2 border-[var(--brand)]' : 'text-gray-500 hover:text-gray-700'}`}
               >
                  <tab.icon size={16} /><span>{tab.label}</span>
               </button>
            ))}
         </div>

         {loading ? (
            <p className="text-gray-500">Loading…</p>
         ) : activeTab === 'templates' ? (
            <MessageList templates={templates} onChange={load} />
         ) : (
            <DeliveryLog messages={messages} emailEnabled={emailEnabled} onChange={load} />
         )}
      </>
   );
}

// The admin check runs before the page mounts, so members never trigger its API calls.
export default function MessagePage() {
   return (
      <AdminRoute>
         <MessagePageInner />
      </AdminRoute>
   );
}
