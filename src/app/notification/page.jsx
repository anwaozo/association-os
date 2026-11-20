'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Header from '@/app/components/Header';
import AdminRoute from '@/app/components/AdminRoute';
import { useApiClient } from '@/lib/apiClient';
import { timeAgo } from '@/lib/time';
import { UserPlus, Users, CalendarPlus, CalendarCheck, Layers, Target, Heart, Mail, Search } from 'lucide-react';

// Activity types from the API, with how each one looks and where it links.
const TYPES = {
   member_joined: { label: 'New people', icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-100', href: () => '/contact' },
   members_imported: { label: 'New people', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100', href: () => '/contact' },
   event_created: { label: 'Events', icon: CalendarPlus, color: 'text-purple-600', bg: 'bg-purple-100', href: (m) => (m?.slug ? `/event/${m.slug}` : '/event') },
   event_rsvp: { label: 'Events', icon: CalendarCheck, color: 'text-purple-600', bg: 'bg-purple-100', href: () => '/event' },
   membership_changed: { label: 'Memberships', icon: Layers, color: 'text-teal-600', bg: 'bg-teal-100', href: () => '/contact' },
   campaign_created: { label: 'Fundraising', icon: Target, color: 'text-red-600', bg: 'bg-red-100', href: () => '/campaign' },
   donation: { label: 'Fundraising', icon: Heart, color: 'text-red-600', bg: 'bg-red-100', href: () => '/fundraising' },
   message_sent: { label: 'Messages', icon: Mail, color: 'text-orange-600', bg: 'bg-orange-100', href: (m) => (m?.messageId ? `/message/${m.messageId}` : '/message') },
};

const FILTERS = [
   { id: '', label: 'All activity' },
   { id: 'member_joined,members_imported', label: 'New people' },
   { id: 'event_created,event_rsvp', label: 'Events' },
   { id: 'membership_changed', label: 'Memberships' },
   { id: 'donation,campaign_created', label: 'Fundraising' },
   { id: 'message_sent', label: 'Messages' },
];

function NotificationsPageInner() {
   const api = useApiClient();
   const [items, setItems] = useState([]);
   const [nextBefore, setNextBefore] = useState(null);
   const [filter, setFilter] = useState('');
   const [search, setSearch] = useState('');
   const [loading, setLoading] = useState(true);

   const load = useCallback(async (before = null) => {
      setLoading(true);
      try {
         const params = new URLSearchParams();
         if (filter) params.set('type', filter);
         if (before) params.set('before', before);
         const res = await api.get(`/notifications?${params}`);
         setItems((prev) => (before ? [...prev, ...res.data.items] : res.data.items));
         setNextBefore(res.data.nextBefore);
      } catch {
         // toast shown by the API client
      } finally {
         setLoading(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [filter]);

   useEffect(() => { load(); }, [load]);

   // Opening this page marks everything as read (the bold "new" styling stays until reload).
   useEffect(() => {
      api.post('/notifications/seen', {}, { silent: true })
         .then(() => window.dispatchEvent(new Event('aos:notifications-seen')))
         .catch(() => {});
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const q = search.trim().toLowerCase();
   const shown = q ? items.filter((i) => `${i.title} ${i.detail || ''}`.toLowerCase().includes(q)) : items;

   return (
      <>
         <Header title="Notifications" subTitle="Everything happening in your organization, newest first" />

         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center mb-6">
               <div className="relative w-full md:w-1/2">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                     type="text"
                     placeholder="Search activity..."
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     className="w-full pl-9 pr-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg outline-none focus:ring-2 focus:ring-[var(--brand)]/30"
                  />
               </div>
               <div className="flex flex-wrap gap-2">
                  {FILTERS.map((f) => (
                     <button
                        key={f.label}
                        onClick={() => setFilter(f.id)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${filter === f.id ? 'bg-[var(--brand)] text-white border-[var(--brand)]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                     >
                        {f.label}
                     </button>
                  ))}
               </div>
            </div>

            <div className="divide-y divide-gray-100">
               {shown.map((n) => {
                  const t = TYPES[n.type] || TYPES.message_sent;
                  const Icon = t.icon;
                  return (
                     <Link key={n.id} href={t.href(n.meta)} className="flex items-start gap-4 py-4 px-2 -mx-2 rounded-lg hover:bg-gray-50 transition">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${t.bg} ${t.color}`}>
                           <Icon size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className={`text-gray-900 ${n.unread ? 'font-semibold' : 'font-medium'}`}>
                              {n.title}
                              {n.unread && <span className="ml-2 align-middle inline-block w-2 h-2 rounded-full bg-[var(--brand)]" aria-label="new" />}
                           </p>
                           {n.detail && <p className="text-sm text-gray-500 truncate">{n.detail}</p>}
                           <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded ${t.bg} ${t.color}`}>{t.label}</span>
                        </div>
                        <span className="text-sm text-gray-500 shrink-0" title={new Date(n.createdAt).toLocaleString()}>{timeAgo(n.createdAt)}</span>
                     </Link>
                  );
               })}
            </div>

            {!loading && shown.length === 0 && (
               <div className="text-center py-12 text-gray-500">
                  {items.length === 0
                     ? 'No activity yet. New members, RSVPs, donations and sent messages will show up here.'
                     : 'No activity matches your search.'}
               </div>
            )}
            {loading && <p className="text-center py-6 text-gray-500">Loading…</p>}
            {!loading && nextBefore && !q && (
               <div className="text-center pt-4">
                  <button onClick={() => load(nextBefore)} className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50">Load older activity</button>
               </div>
            )}
         </div>
      </>
   );
}

// The admin check runs before the page mounts, so members never trigger its API calls.
export default function NotificationsPage() {
   return (
      <AdminRoute>
         <NotificationsPageInner />
      </AdminRoute>
   );
}
