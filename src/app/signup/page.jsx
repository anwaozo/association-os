'use client';
import { Fragment, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { PublicShell } from '@/app/header';
import { useApiClient } from '@/lib/apiClient';
import { PRODUCT_NAME } from '@/lib/features';

const field = 'block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F3864] sm:text-sm';

// Public application form. The organization stays "pending" until a
// platform admin approves it and sends the admin an invite link.
export default function SignupPage() {
   const api = useApiClient();
   const [form, setForm] = useState({ organizationName: '', tagline: '', contactName: '', contactEmail: '', contactPhone: '', website: '' });
   const [error, setError] = useState('');
   const [loading, setLoading] = useState(false);
   const [done, setDone] = useState(false);

   const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

   const submit = async (e) => {
      e.preventDefault();
      setError('');
      setLoading(true);
      try {
         await api.post('/onboarding/signup', form, { silent: true });
         setDone(true);
      } catch (err) {
         setError(err?.response?.data?.message || 'Something went wrong. Try again.');
      }
      setLoading(false);
   };

   return (
      <PublicShell>
         <div>
            <div className="max-w-lg mx-auto py-14 px-4">
               {done ? (
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E4E4EF] text-center">
                     <CheckCircle2 className="mx-auto text-green-600 mb-4" size={48} />
                     <h1 className="text-2xl font-bold text-gray-900 mb-2">Application received</h1>
                     <p className="text-gray-600 mb-6">
                        Thanks! We&apos;ll review your organization and send a private link to {form.contactEmail} so you can set up your account.
                     </p>
                     <Link href="/" className="text-sm font-medium text-[#6460FF] hover:underline">Back to home</Link>
                  </div>
               ) : (
                  <>
                     <h1 className="text-3xl font-bold text-[#0F1215] text-center md:text-4xl">Register your organization</h1>
                     <p className="text-gray-600 text-center mt-2 mb-8">
                        Tell us about your chamber, association or nonprofit. We&apos;ll review it and send you a link to get started on {PRODUCT_NAME}.
                     </p>
                     <form onSubmit={submit} className="bg-white p-8 rounded-2xl shadow-sm border border-[#E4E4EF] space-y-5">
                        <div>
                           <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-1">Organization name</label>
                           <input id="organizationName" name="organizationName" value={form.organizationName} onChange={set} required maxLength={120} className={field} placeholder="Greater Houston Business Chamber" />
                        </div>
                        <div>
                           <label htmlFor="tagline" className="block text-sm font-medium text-gray-700 mb-1">Short description <span className="text-gray-400">(optional)</span></label>
                           <input id="tagline" name="tagline" value={form.tagline} onChange={set} maxLength={200} className={field} placeholder="Connecting local businesses since 1987" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                           <div>
                              <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">Your name</label>
                              <input id="contactName" name="contactName" value={form.contactName} onChange={set} required maxLength={120} autoComplete="name" className={field} />
                           </div>
                           <div>
                              <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                              <input id="contactPhone" name="contactPhone" type="tel" value={form.contactPhone} onChange={set} required maxLength={40} autoComplete="tel" className={field} />
                           </div>
                        </div>
                        <div>
                           <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">Work email</label>
                           <input id="contactEmail" name="contactEmail" type="email" value={form.contactEmail} onChange={set} required autoComplete="email" className={field} placeholder="you@organization.org" />
                           <p className="text-xs text-gray-500 mt-1">This becomes your login as the organization&apos;s admin.</p>
                        </div>
                        {/* Honeypot for bots; hidden from people and screen readers */}
                        <input type="text" name="website" value={form.website} onChange={set} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

                        {error && <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}

                        <button type="submit" disabled={loading} className="w-full py-3 px-4 text-base font-medium rounded-full text-white bg-[#1A1B1F] hover:bg-black disabled:opacity-60">
                           {loading ? 'Submitting...' : 'Submit application'}
                        </button>
                        <p className="text-sm text-gray-600 text-center">
                           Already have an account? <Link href="/login" className="font-medium text-[#6460FF] hover:underline">Log in</Link>
                        </p>
                     </form>
                  </>
               )}
            </div>
         </div>
      </PublicShell>
   );
}
