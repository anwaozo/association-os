'use client';
import { Fragment, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { PublicShell } from '@/app/header';
import OrgBadge from '@/app/components/OrgBadge';
import { useApiClient } from '@/lib/apiClient';
import { useAuth } from '@/context/AuthContext';

const field = 'block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand)] sm:text-sm';

// The admin of a newly approved organization opens their invite link here,
// sets a password, and lands in the welcome setup.
export default function InvitePage() {
   const { token } = useParams();
   const router = useRouter();
   const api = useApiClient();
   const { setTokens, setUser, setOrganization, logout, state } = useAuth();
   const [invite, setInvite] = useState(null);
   const [problem, setProblem] = useState('');
   const [form, setForm] = useState({ name: '', phone: '', password: '', confirm: '' });
   const [show, setShow] = useState(false);
   const [error, setError] = useState('');
   const [saving, setSaving] = useState(false);

   useEffect(() => {
      api.get(`/onboarding/invites/${encodeURIComponent(token)}`, { silent: true })
         .then((res) => {
            setInvite(res.data);
            setForm((f) => ({ ...f, name: res.data.name || '', phone: res.data.phone || '' }));
            if (res.data.organization?.primaryColor) {
               document.documentElement.style.setProperty('--brand', res.data.organization.primaryColor);
            }
         })
         .catch((err) => setProblem(err?.response?.data?.message || 'This invite link is not valid.'));
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [token]);

   const submit = async (e) => {
      e.preventDefault();
      setError('');
      if (form.password !== form.confirm) return setError('Passwords do not match.');
      setSaving(true);
      try {
         // Someone else may be logged in on this browser; start clean.
         if (state.isAuthenticated) logout();
         const res = await api.post(`/onboarding/invites/${encodeURIComponent(token)}/accept`, {
            name: form.name, phone: form.phone, password: form.password,
         }, { silent: true });
         setTokens(res.data.accessToken, res.data.refreshToken);
         setUser(res.data.user);
         setOrganization(res.data.organization);
         router.push('/welcome');
      } catch (err) {
         setError(err?.response?.data?.message || 'Could not finish setup. Try again.');
         setSaving(false);
      }
   };

   const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

   return (
      <PublicShell>
         <div>
            <div className="max-w-md mx-auto py-14 px-4">
               {problem ? (
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E4E4EF] text-center">
                     <h1 className="text-xl font-bold text-gray-900 mb-2">Invite link unavailable</h1>
                     <p className="text-gray-600 mb-6">{problem}</p>
                     <Link href="/login" className="text-sm font-medium text-[#6460FF] hover:underline">Go to login</Link>
                  </div>
               ) : !invite ? (
                  <p className="text-center text-gray-500">Checking your invite...</p>
               ) : (
                  <>
                     <div className="flex justify-center mb-4"><OrgBadge org={invite.organization} size={56} /></div>
                     <h1 className="text-3xl font-bold text-[#0F1215] text-center">Set up {invite.organization.name}</h1>
                     <p className="text-gray-600 text-center mt-2 mb-8">
                        You&apos;re the admin. Create your password to get started.
                     </p>
                     <form onSubmit={submit} className="bg-white p-8 rounded-2xl shadow-sm border border-[#E4E4EF] space-y-5">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Email (your login)</label>
                           <input value={invite.email} readOnly className={`${field} bg-gray-50 text-gray-600`} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                           <div>
                              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your name</label>
                              <input id="name" name="name" value={form.name} onChange={set} required autoComplete="name" className={field} />
                           </div>
                           <div>
                              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                              <input id="phone" name="phone" type="tel" value={form.phone} onChange={set} required autoComplete="tel" className={field} />
                           </div>
                        </div>
                        <div>
                           <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                           <div className="relative">
                              <input id="password" name="password" type={show ? 'text' : 'password'} minLength={8} value={form.password} onChange={set} required autoComplete="new-password" className={`${field} pr-10`} placeholder="At least 8 characters" />
                              <button type="button" aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow(!show)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                                 {show ? <EyeOff size={20} /> : <Eye size={20} />}
                              </button>
                           </div>
                        </div>
                        <div>
                           <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
                           <input id="confirm" name="confirm" type={show ? 'text' : 'password'} minLength={8} value={form.confirm} onChange={set} required autoComplete="new-password" className={field} />
                        </div>
                        {error && <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
                        <button type="submit" disabled={saving} className="w-full py-3 px-4 text-base font-medium rounded-full text-white bg-[#1A1B1F] hover:bg-black disabled:opacity-60">
                           {saving ? 'Creating your account...' : 'Create account'}
                        </button>
                        <p className="text-xs text-gray-500 text-center">
                           This link works once and expires {new Date(invite.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.
                        </p>
                     </form>
                  </>
               )}
            </div>
         </div>
      </PublicShell>
   );
}
