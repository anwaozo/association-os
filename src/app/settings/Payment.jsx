'use client';
import { useEffect, useState } from 'react';
import { useApiClient } from '@/lib/apiClient';
import { CheckCircle2, AlertCircle, ExternalLink, CreditCard } from 'lucide-react';

// Stripe Connect (Express). The organization links its own Stripe account;
// online donations are paid out to it directly.
export default function Payment() {
   const api = useApiClient();
   const [status, setStatus] = useState(null);
   const [busy, setBusy] = useState(false);

   useEffect(() => {
      api.get('/payments/status').then((r) => setStatus(r.data)).catch(() => {});
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const go = async (path) => {
      setBusy(true);
      try {
         const r = await api.post(path);
         window.location.href = r.data.url;
      } catch {
         setBusy(false);
      }
   };

   if (!status) return <p className="text-gray-500 mt-6">Loading…</p>;

   return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mt-6 max-w-3xl space-y-6">
         <div>
            <h2 className="text-2xl font-semibold">Online payments</h2>
            <p className="text-gray-600 mt-1">Connect a Stripe account so members and supporters can donate by card. Money is paid out straight to your organization’s bank account.</p>
         </div>

         {!status.stripeConfigured ? (
            <div className="flex gap-3 items-start p-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 text-sm">
               <AlertCircle size={18} className="shrink-0 mt-0.5" />
               <p>Online payments aren’t switched on for this platform yet. You can still record cash and check gifts under Fundraising.</p>
            </div>
         ) : status.chargesEnabled ? (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg border border-green-300 bg-green-50">
               <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-600 shrink-0" />
                  <div>
                     <p className="font-semibold text-green-800">Connected to Stripe</p>
                     <p className="text-sm text-green-700">You’re accepting online donations.</p>
                  </div>
               </div>
               <button onClick={() => go('/payments/dashboard')} disabled={busy} className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-green-400 text-green-800 rounded-lg bg-white hover:bg-green-100 disabled:opacity-60">
                  Open Stripe dashboard <ExternalLink size={14} />
               </button>
            </div>
         ) : (
            <div className="p-4 rounded-lg border border-indigo-200 bg-indigo-50 space-y-3">
               <div className="flex items-start gap-3">
                  <CreditCard className="text-indigo-600 shrink-0" />
                  <div>
                     <p className="font-semibold text-indigo-900">{status.connected ? 'Finish setting up Stripe' : 'Connect Stripe'}</p>
                     <p className="text-sm text-indigo-800">
                        {status.connected
                           ? 'Stripe still needs a few details (like your bank account) before you can accept donations.'
                           : 'Takes about 5 minutes. Stripe will ask for your organization’s details and the bank account to pay out to.'}
                     </p>
                  </div>
               </div>
               <button onClick={() => go('/payments/connect')} disabled={busy} className="px-5 py-2.5 text-sm font-medium text-white bg-[var(--brand)] rounded-lg disabled:opacity-60">
                  {busy ? 'Opening Stripe…' : status.connected ? 'Continue setup' : 'Connect with Stripe'}
               </button>
            </div>
         )}

         {status.stripeConfigured && (
            <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
               <li>Stripe charges its standard card processing fee on each donation.</li>
               {status.platformFeePercent > 0 && <li>A {status.platformFeePercent}% platform fee also applies to online donations.</li>}
               <li>Refunds are handled in your Stripe dashboard and show up here automatically.</li>
            </ul>
         )}
      </div>
   );
}
