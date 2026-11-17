'use client';
import { useApiClient } from "@/lib/apiClient";
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import Header from '@/app/header';
import OrgBadge from '@/app/components/OrgBadge';
import { PRODUCT_NAME } from '@/lib/features';

export default function LoginPage() {
   const router = useRouter();
   const api = useApiClient();
   const { state, setTokens, setUser, setOrganization } = useAuth();
   const [form, setForm] = useState({ email: '', password: '' });
   const [error, setError] = useState('');
   const [showPassword, setShowPassword] = useState(false);
   const [loading, setLoading] = useState(false);
   // Optional per-organization login page: /login?org=<slug>
   const [org, setOrg] = useState(null);

   useEffect(() => {
      if (!state.isLoading && state.isAuthenticated) router.replace('/dashboard');
   }, [state.isLoading, state.isAuthenticated, router]);

   useEffect(() => {
      const slug = new URLSearchParams(window.location.search).get('org');
      if (!slug) return;
      api.get(`/organizations/public/${encodeURIComponent(slug)}`, { silent: true })
         .then((res) => {
            setOrg(res.data);
            if (res.data?.primaryColor) document.documentElement.style.setProperty('--brand', res.data.primaryColor);
         })
         .catch(() => {});
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');
      try {
         const res = await api.post("/auth/login", form, { silent: true });
         setTokens(res.data.accessToken, res.data.refreshToken);
         setUser(res.data.user);
         setOrganization(res.data.organization);
         router.push("/dashboard");
      } catch (err) {
         setError(err?.response?.data?.message || 'Could not log in. Try again.');
         setLoading(false);
      }
   };

   return (
      <Fragment>
         <Header />
         <div className="pt-20 min-h-screen bg-gray-100">
            <div className="flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
               <div className="max-w-md w-full space-y-5 text-center">
                  {org && (
                     <div className="flex justify-center"><OrgBadge org={org} size={56} /></div>
                  )}
                  <h1 className="text-2xl font-bold text-gray-900">
                     {org ? `Welcome back to ${org.name}` : `Log in to ${PRODUCT_NAME}`}
                  </h1>
                  <p className="text-md text-gray-600 mb-8">
                     Members and staff use the same login. You&apos;ll land in your organization&apos;s workspace.
                  </p>

                  <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 text-left">
                     <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                           <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                           <input
                              id="email"
                              name="email"
                              type="email"
                              autoComplete="username"
                              value={form.email}
                              onChange={(e) => setForm({ ...form, email: e.target.value })}
                              required
                              className="block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand)] sm:text-sm"
                              placeholder="you@organization.org"
                           />
                        </div>

                        <div>
                           <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                           <div className="relative">
                              <input
                                 id="password"
                                 name="password"
                                 type={showPassword ? 'text' : 'password'}
                                 autoComplete="current-password"
                                 value={form.password}
                                 onChange={(e) => setForm({ ...form, password: e.target.value })}
                                 required
                                 className="block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand)] sm:text-sm pr-10"
                                 placeholder="Your password"
                              />
                              <button
                                 type="button"
                                 aria-label={showPassword ? 'Hide password' : 'Show password'}
                                 onClick={() => setShowPassword(!showPassword)}
                                 className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                              >
                                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                              </button>
                           </div>
                        </div>

                        {error && (
                           <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
                        )}

                        <button
                           type="submit"
                           disabled={loading}
                           className="w-full flex justify-center py-2.5 px-4 text-base font-medium rounded-lg text-white bg-[var(--brand)] hover:opacity-90 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--brand)]"
                        >
                           {loading ? (
                              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                           ) : 'Log in'}
                        </button>
                     </form>
                     <p className="text-sm text-gray-600 text-center mt-6">
                        New organization? <a href="/signup" className="font-medium text-[var(--brand)] hover:underline">Register here</a>
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </Fragment>
   );
}
