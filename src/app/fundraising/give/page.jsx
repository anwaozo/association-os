'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import Currency from '@/app/components/Currency';
import DonateForm from '@/app/fundraising/DonateForm';
import { useApiClient } from '@/lib/apiClient';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle2, HeartHandshake } from 'lucide-react';

function Give() {
   const api = useApiClient();
   const params = useSearchParams();
   const router = useRouter();
   const { state } = useAuth();
   const [campaigns, setCampaigns] = useState([]);
   const [selected, setSelected] = useState(params.get('campaign') || '');
   const [mine, setMine] = useState([]);
   const [busy, setBusy] = useState(false);
   const [loaded, setLoaded] = useState(false);
   const [accepting, setAccepting] = useState(true);
   const success = params.get('status') === 'success';

   useEffect(() => {
      Promise.all([api.get('/campaign'), api.get('/donations/mine'), api.get('/donations/availability', { silent: true })])
         .then(([c, m, a]) => {
            setAccepting(Boolean(a.data?.acceptingDonations));
            const today = new Date(); today.setHours(0, 0, 0, 0);
            setCampaigns(c.data.filter((x) => !x.date || new Date(x.date) >= today));
            setMine(m.data);
         })
         .catch(() => {})
         .finally(() => setLoaded(true));
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const campaign = campaigns.find((c) => String(c.id) === selected) || null;

   const donate = async ({ amount, isAnonymous, note }) => {
      setBusy(true);
      try {
         const res = await api.post('/donations/checkout', { amount, isAnonymous, note, campaignId: campaign?.id ?? null });
         window.location.href = res.data.url;
      } catch {
         setBusy(false);
      }
   };

   return (
      <>
         <Header title="Give" subTitle={`Support ${state?.organization?.name || 'your organization'}`} />

         {success && (
            <div className="mb-6 flex gap-3 items-start p-4 rounded-lg border border-green-200 bg-green-50 text-green-900">
               <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
               <div className="text-sm">
                  <p className="font-semibold">Thank you for your gift!</p>
                  <p>Stripe will email your receipt. It can take a minute to appear in your history below.</p>
               </div>
               <button onClick={() => router.replace('/fundraising/give')} className="ml-auto text-sm underline">Dismiss</button>
            </div>
         )}

         <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-6 space-y-6">
               <label className="block">
                  <span className="text-sm font-medium text-gray-700">What would you like to support?</span>
                  <select value={selected} onChange={(e) => setSelected(e.target.value)} className="mt-1 w-full p-3 border border-gray-300 rounded-lg bg-white">
                     <option value="">General donation</option>
                     {campaigns.map((c) => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
                  </select>
               </label>

               {campaign && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                     {campaign.description && <p className="text-sm text-gray-700 mb-3 whitespace-pre-line">{campaign.description}</p>}
                     {campaign.goal > 0 && (
                        <>
                           <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-[var(--brand)]" style={{ width: `${Math.min(100, Math.round((campaign.raisedCents / 100 / campaign.goal) * 100))}%` }} />
                           </div>
                           <p className="text-xs text-gray-600 mt-1"><Currency amount={campaign.raisedCents / 100} /> raised of <Currency amount={campaign.goal} /></p>
                        </>
                     )}
                  </div>
               )}

               {loaded && (accepting
                  ? <DonateForm key={selected} campaign={campaign} busy={busy} onSubmit={donate} />
                  : <p className="text-gray-600 text-center py-6">Online giving isn’t open yet. Please check back soon, or contact {state?.organization?.name || 'the organization'} to give another way.</p>)}
            </div>

            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 h-fit">
               <h3 className="font-semibold text-gray-900 mb-4">Your giving history</h3>
               {mine.length === 0 ? (
                  <div className="text-sm text-gray-500 text-center py-6">
                     <HeartHandshake className="mx-auto mb-2 text-gray-300" />
                     Your donations will be listed here.
                  </div>
               ) : (
                  <ul className="divide-y divide-gray-100">
                     {mine.map((d) => (
                        <li key={d.id} className="py-3 flex justify-between text-sm">
                           <div>
                              <p className="font-medium text-gray-900">{d.campaign?.name || 'General donation'}</p>
                              <p className="text-gray-500">{new Date(d.paidAt || d.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}{d.status === 'refunded' ? ' · Refunded' : ''}</p>
                           </div>
                           <span className="font-semibold text-gray-900"><Currency amount={d.amountCents / 100} /></span>
                        </li>
                     ))}
                  </ul>
               )}
            </div>
         </div>
      </>
   );
}

export default function GivePage() {
   return (
      <ProtectedRoute>
         <Suspense fallback={<p className="text-gray-500">Loading…</p>}>
            <Give />
         </Suspense>
      </ProtectedRoute>
   );
}
