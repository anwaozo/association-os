'use client';
import { Suspense, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Currency from '@/app/components/Currency';
import DonateForm from '@/app/fundraising/DonateForm';
import { CheckCircle2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Public campaign page: no login. Anyone with the link can donate.
function PublicGive() {
   const { org, slug } = useParams();
   const params = useSearchParams();
   const [data, setData] = useState(null);
   const [error, setError] = useState('');
   const [busy, setBusy] = useState(false);
   const success = params.get('status') === 'success';

   useEffect(() => {
      axios.get(`${API_URL}/public/${encodeURIComponent(org)}/campaigns/${encodeURIComponent(slug)}`)
         .then((r) => {
            setData(r.data);
            if (r.data.organization?.primaryColor) document.documentElement.style.setProperty('--brand', r.data.organization.primaryColor);
            document.title = `${r.data.campaign.name} | ${r.data.organization.name}`;
         })
         .catch((e) => setError(e?.response?.status === 404 ? 'This campaign could not be found. It may have ended or be private.' : 'Something went wrong loading this page.'));
   }, [org, slug]);

   const donate = async (form) => {
      setBusy(true);
      setError('');
      try {
         const r = await axios.post(`${API_URL}/public/${encodeURIComponent(org)}/campaigns/${encodeURIComponent(slug)}/checkout`, form);
         window.location.href = r.data.url;
      } catch (e) {
         setError(e?.response?.data?.message || 'Could not start checkout. Please try again.');
         setBusy(false);
      }
   };

   if (!data) {
      return <div className="min-h-screen flex items-center justify-center p-6 text-gray-600">{error || 'Loading…'}</div>;
   }

   const { organization: o, campaign: c, raisedCents, donationCount, acceptingDonations } = data;
   const raised = raisedCents / 100;
   const pct = c.goal ? Math.min(100, Math.round((raised / c.goal) * 100)) : 0;

   return (
      <div className="min-h-screen bg-gray-50">
         <header className="text-white" style={{ background: 'var(--brand)' }}>
            <div className="max-w-3xl mx-auto px-6 py-6 flex items-center gap-3">
               {o.logoUrl && <img src={o.logoUrl} alt="" className="w-10 h-10 rounded bg-white object-contain" />}
               <div>
                  <p className="font-semibold">{o.name}</p>
                  {o.tagline && <p className="text-sm opacity-80">{o.tagline}</p>}
               </div>
            </div>
         </header>

         <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">
            {success ? (
               <div className="bg-white rounded-xl border border-gray-200 p-8 text-center space-y-3">
                  <CheckCircle2 size={48} className="mx-auto text-green-600" />
                  <h1 className="text-2xl font-bold text-gray-900">Thank you!</h1>
                  <p className="text-gray-700 whitespace-pre-line">{c.thank_you || `Your gift to ${c.name} makes a difference.`}</p>
                  <p className="text-sm text-gray-500">A receipt is on its way to your email.</p>
               </div>
            ) : (
               <>
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                     <h1 className="text-2xl font-bold text-gray-900">{c.name}</h1>
                     {c.description && <p className="text-gray-700 mt-3 whitespace-pre-line">{c.description}</p>}
                     {c.goal > 0 && (
                        <div className="mt-5">
                           <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-[var(--brand)]" style={{ width: `${pct}%` }} />
                           </div>
                           <p className="text-sm text-gray-600 mt-2">
                              <b className="text-gray-900"><Currency amount={raised} /></b> raised of <Currency amount={c.goal} /> goal · {donationCount} {donationCount === 1 ? 'gift' : 'gifts'}
                           </p>
                        </div>
                     )}
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                     {acceptingDonations ? (
                        <DonateForm campaign={c} askDonor busy={busy} onSubmit={donate} />
                     ) : (
                        <p className="text-gray-600 text-center py-6">Online donations for this campaign aren’t open yet. Please check back soon.</p>
                     )}
                     {error && <p className="text-sm text-red-600 mt-3 text-center">{error}</p>}
                  </div>
               </>
            )}
            <p className="text-xs text-gray-400 text-center">Powered by AssociationOS</p>
         </main>
      </div>
   );
}

export default function PublicGivePage() {
   return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-600">Loading…</div>}>
         <PublicGive />
      </Suspense>
   );
}
