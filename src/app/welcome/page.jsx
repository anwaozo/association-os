'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import OrgBadge from '@/app/components/OrgBadge';
import { useApiClient } from '@/lib/apiClient';
import { useAuth } from '@/context/AuthContext';

const field = 'block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand)] sm:text-sm';
const STEPS = ['Your brand', 'First membership tier', 'All set'];

// First-run setup for a new organization's admin.
function Welcome() {
   const api = useApiClient();
   const router = useRouter();
   const { state, setOrganization } = useAuth();
   const [step, setStep] = useState(0);
   const [brand, setBrand] = useState({ name: '', tagline: '', logoUrl: '', primaryColor: '#1F3864' });
   const [tier, setTier] = useState({ name: '', price: '', billing_cadence: 'Annual', benefits: '' });
   const [error, setError] = useState('');
   const [busy, setBusy] = useState(false);

   useEffect(() => {
      const o = state.organization;
      if (o) setBrand((b) => ({ ...b, name: o.name || '', tagline: o.tagline || '', logoUrl: o.logoUrl || '', primaryColor: o.primaryColor || '#1F3864' }));
   }, [state.organization]);

   useEffect(() => {
      if (state.user && state.user.role !== 1) router.replace('/dashboard');
   }, [state.user, router]);

   useEffect(() => {
      if (/^#[0-9a-fA-F]{6}$/.test(brand.primaryColor)) document.documentElement.style.setProperty('--brand', brand.primaryColor);
   }, [brand.primaryColor]);

   const run = async (fn) => {
      setError('');
      setBusy(true);
      try { await fn(); } catch (err) { setError(err?.response?.data?.message || 'Something went wrong. Try again.'); }
      setBusy(false);
   };

   const saveBrand = (e) => {
      e.preventDefault();
      run(async () => {
         const res = await api.put('/organizations/current', brand, { silent: true });
         setOrganization({ ...state.organization, ...res.data });
         setStep(1);
      });
   };

   const saveTier = (e) => {
      e.preventDefault();
      run(async () => {
         await api.post('/memberships', {
            name: tier.name,
            price: tier.price,
            billing_cadence: tier.billing_cadence,
            benefits: tier.benefits.split(',').map((b) => b.trim()).filter(Boolean),
         }, { silent: true });
         setStep(2);
      });
   };

   const finish = () => run(async () => {
      const res = await api.post('/organizations/current/onboarding-complete', {}, { silent: true });
      setOrganization({ ...state.organization, ...res.data });
      router.replace('/dashboard');
   });

   return (
      <div className="min-h-screen bg-gray-100">
         <div className="max-w-2xl mx-auto py-12 px-4">
            <div className="flex items-center gap-3 mb-8">
               <OrgBadge org={{ ...state.organization, ...brand }} size={44} />
               <div>
                  <h1 className="text-2xl font-bold text-gray-900">Welcome, {(state.user?.name || '').split(' ')[0] || 'there'}</h1>
                  <p className="text-gray-600">Let&apos;s get {brand.name || 'your organization'} ready. This takes about two minutes.</p>
               </div>
            </div>

            <ol className="flex items-center gap-2 mb-6 text-sm">
               {STEPS.map((label, i) => (
                  <li key={label} className="flex items-center gap-2">
                     <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${i < step ? 'bg-green-600 text-white' : i === step ? 'bg-[var(--brand)] text-white' : 'bg-gray-200 text-gray-600'}`}>
                        {i < step ? <Check size={14} /> : i + 1}
                     </span>
                     <span className={i === step ? 'font-medium text-gray-900' : 'text-gray-500'}>{label}</span>
                     {i < STEPS.length - 1 && <span className="w-6 h-px bg-gray-300 mx-1" />}
                  </li>
               ))}
            </ol>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
               {step === 0 && (
                  <form onSubmit={saveBrand} className="space-y-5">
                     <h2 className="text-lg font-semibold">How your organization looks</h2>
                     <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Organization name</label>
                        <input id="name" value={brand.name} onChange={(e) => setBrand({ ...brand, name: e.target.value })} required className={field} />
                     </div>
                     <div>
                        <label htmlFor="tagline" className="block text-sm font-medium text-gray-700 mb-1">Tagline <span className="text-gray-400">(optional)</span></label>
                        <input id="tagline" value={brand.tagline} onChange={(e) => setBrand({ ...brand, tagline: e.target.value })} className={field} />
                     </div>
                     <div>
                        <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700 mb-1">Logo URL <span className="text-gray-400">(optional)</span></label>
                        <input id="logoUrl" type="url" value={brand.logoUrl} onChange={(e) => setBrand({ ...brand, logoUrl: e.target.value })} placeholder="https://..." className={field} />
                        <p className="text-xs text-gray-500 mt-1">Leave blank to use your initials.</p>
                     </div>
                     <div>
                        <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">Brand color</label>
                        <div className="flex items-center gap-3">
                           <input id="color" type="color" value={brand.primaryColor} onChange={(e) => setBrand({ ...brand, primaryColor: e.target.value })} className="h-11 w-14 rounded border border-gray-200" />
                           <input aria-label="Brand color hex" value={brand.primaryColor} onChange={(e) => setBrand({ ...brand, primaryColor: e.target.value })} pattern="#[0-9a-fA-F]{6}" className={field} />
                        </div>
                     </div>
                     {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
                     <div className="flex justify-end">
                        <button type="submit" disabled={busy} className="px-5 py-2.5 rounded-lg text-white bg-[var(--brand)] hover:opacity-90 disabled:opacity-60 text-sm font-medium">Save and continue</button>
                     </div>
                  </form>
               )}

               {step === 1 && (
                  <form onSubmit={saveTier} className="space-y-5">
                     <h2 className="text-lg font-semibold">Add your first membership tier</h2>
                     <p className="text-sm text-gray-600">Members pick a tier when they join. You can add more later under Membership Tiers.</p>
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div className="sm:col-span-1">
                           <label htmlFor="tname" className="block text-sm font-medium text-gray-700 mb-1">Tier name</label>
                           <input id="tname" value={tier.name} onChange={(e) => setTier({ ...tier, name: e.target.value })} required placeholder="Small Business" className={field} />
                        </div>
                        <div>
                           <label htmlFor="tprice" className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                           <input id="tprice" type="number" min="0" step="0.01" value={tier.price} onChange={(e) => setTier({ ...tier, price: e.target.value })} required className={field} />
                        </div>
                        <div>
                           <label htmlFor="tcad" className="block text-sm font-medium text-gray-700 mb-1">Billed</label>
                           <select id="tcad" value={tier.billing_cadence} onChange={(e) => setTier({ ...tier, billing_cadence: e.target.value })} className={field}>
                              <option value="Annual">Yearly</option>
                              <option value="Monthly">Monthly</option>
                           </select>
                        </div>
                     </div>
                     <div>
                        <label htmlFor="tben" className="block text-sm font-medium text-gray-700 mb-1">Benefits <span className="text-gray-400">(comma separated)</span></label>
                        <input id="tben" value={tier.benefits} onChange={(e) => setTier({ ...tier, benefits: e.target.value })} placeholder="Directory listing, Monthly mixers" className={field} />
                     </div>
                     {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
                     <div className="flex justify-between">
                        <button type="button" onClick={() => setStep(2)} className="px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100">Skip for now</button>
                        <button type="submit" disabled={busy} className="px-5 py-2.5 rounded-lg text-white bg-[var(--brand)] hover:opacity-90 disabled:opacity-60 text-sm font-medium">Add tier and continue</button>
                     </div>
                  </form>
               )}

               {step === 2 && (
                  <div className="text-center space-y-4">
                     <div className="mx-auto w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center"><Check /></div>
                     <h2 className="text-lg font-semibold">You&apos;re all set</h2>
                     <p className="text-sm text-gray-600">Next, add your members under Contacts &amp; Members (one at a time or by CSV import) and create your first event.</p>
                     {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
                     <button onClick={finish} disabled={busy} className="px-5 py-2.5 rounded-lg text-white bg-[var(--brand)] hover:opacity-90 disabled:opacity-60 text-sm font-medium">Go to my dashboard</button>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}

export default function WelcomePage() {
   return <ProtectedRoute><Welcome /></ProtectedRoute>;
}
