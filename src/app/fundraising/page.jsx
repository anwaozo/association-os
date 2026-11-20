'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/app/components/Header';
import AdminRoute from '@/app/components/AdminRoute';
import Currency from '@/app/components/Currency';
import DonationsTable from '@/app/fundraising/Donation';
import PerformanceChart from '@/app/fundraising/PerformanceChart';
import RecordGiftModal from '@/app/fundraising/RecordGiftModal';
import { useApiClient } from '@/lib/apiClient';
import { useToast } from '@/app/components/toast/ToastContext';
import { ArrowRight, CreditCard, Target } from 'lucide-react';

function Tile({ title, children, sub }) {
   return (
      <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-200">
         <p className="text-sm font-medium text-gray-500">{title}</p>
         <p className="text-2xl font-bold text-gray-900 mt-1">{children}</p>
         {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
      </div>
   );
}

function FundraisingPageInner() {
   const api = useApiClient();
   const { showToast } = useToast();
   const [summary, setSummary] = useState(null);
   const [donations, setDonations] = useState([]);
   const [campaigns, setCampaigns] = useState([]);
   const [people, setPeople] = useState([]);
   const [stripe, setStripe] = useState(null);
   const [recording, setRecording] = useState(false);

   const load = useCallback(async () => {
      try {
         const [s, d, c] = await Promise.all([api.get('/donations/summary'), api.get('/donations'), api.get('/campaign')]);
         setSummary(s.data);
         setDonations(d.data);
         setCampaigns(c.data);
      } catch {
         // toast shown by the API client
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   useEffect(() => {
      load();
      api.get('/payments/status', { silent: true }).then((r) => setStripe(r.data)).catch(() => {});
      api.get('/contacts', { silent: true }).then((r) => setPeople(r.data || [])).catch(() => {});
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const remove = async (d) => {
      if (!window.confirm(`Delete this ${(d.amountCents / 100).toFixed(2)} USD gift from ${d.donorName || 'unknown donor'}?`)) return;
      try {
         await api.delete(`/donations/${d.id}`);
         showToast('Gift deleted', 'success');
         load();
      } catch {
         // toast shown by the API client
      }
   };

   const now = new Date();
   const activeCampaigns = campaigns.filter((c) => !c.date || new Date(c.date) >= new Date(now.getFullYear(), now.getMonth(), now.getDate()));

   return (
      <>
         <Header title="Fundraising" subTitle="Donations, campaigns and online giving" />

         {stripe && stripe.stripeConfigured && !stripe.chargesEnabled && (
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-900">
               <div className="flex gap-3 items-start">
                  <CreditCard size={20} className="shrink-0 mt-0.5" />
                  <p className="text-sm">
                     {stripe.connected
                        ? 'Finish setting up Stripe to start accepting online donations.'
                        : 'Connect a Stripe account to accept online donations. Money goes straight to your organization’s bank account.'}
                  </p>
               </div>
               <Link href="/settings?tab=payments" className="px-4 py-2 text-sm font-medium text-white bg-[var(--brand)] rounded-lg self-start md:self-auto whitespace-nowrap">
                  {stripe.connected ? 'Finish setup' : 'Connect Stripe'}
               </Link>
            </div>
         )}

         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Tile title="Total raised" sub="All time"><Currency amount={(summary?.totalRaisedCents || 0) / 100} /></Tile>
            <Tile title="This month"><Currency amount={(summary?.thisMonthCents || 0) / 100} /></Tile>
            <Tile title="Donors" sub={`${summary?.donationCount || 0} gifts`}>{summary?.donorCount || 0}</Tile>
            <Tile title="Average gift"><Currency amount={(summary?.averageCents || 0) / 100} /></Tile>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            <div className="lg:col-span-2">
               <PerformanceChart monthly={summary?.monthly || []} />
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Active campaigns</h3>
                  <Link href="/campaign" className="flex items-center text-sm font-medium text-[var(--brand)]">Manage <ArrowRight size={14} className="ml-1" /></Link>
               </div>
               {activeCampaigns.length === 0 && (
                  <div className="text-sm text-gray-500 py-6 text-center">
                     <Target className="mx-auto mb-2 text-gray-300" />
                     No active campaigns. <Link href="/campaign" className="text-[var(--brand)] font-medium">Create one</Link>
                  </div>
               )}
               <div className="space-y-5">
                  {activeCampaigns.slice(0, 4).map((c) => {
                     const raised = (c.raisedCents || 0) / 100;
                     const pct = c.goal ? Math.min(100, Math.round((raised / c.goal) * 100)) : 0;
                     return (
                        <div key={c.id}>
                           <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium text-gray-900 truncate pr-2">{c.name}</span>
                              <span className="text-gray-500">{pct}%</span>
                           </div>
                           <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full rounded-full bg-[var(--brand)]" style={{ width: `${pct}%` }} />
                           </div>
                           <p className="text-xs text-gray-500 mt-1"><Currency amount={raised} /> of <Currency amount={c.goal || 0} /></p>
                        </div>
                     );
                  })}
               </div>
            </div>
         </div>

         <DonationsTable data={donations} campaigns={campaigns} onRecord={() => setRecording(true)} onDelete={remove} />

         {recording && (
            <RecordGiftModal campaigns={campaigns} people={people} onClose={() => setRecording(false)} onSaved={() => { setRecording(false); load(); }} />
         )}
      </>
   );
}

// The admin check runs before the page mounts, so members never trigger its API calls.
export default function FundraisingPage() {
   return (
      <AdminRoute>
         <FundraisingPageInner />
      </AdminRoute>
   );
}
