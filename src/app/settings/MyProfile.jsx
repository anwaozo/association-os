'use client';
import { useState, useEffect } from 'react';
import InputField from '@/app/components/forms/InputField';
import { useApiClient } from '@/lib/apiClient';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/app/components/toast/ToastContext';

const ROLE_LABEL = { 1: 'Admin', 2: 'Member', 3: 'Contact' };

export default function MyProfile() {
   const api = useApiClient();
   const { state, setUser } = useAuth();
   const { showToast } = useToast();
   const [me, setMe] = useState(null);
   const [form, setForm] = useState({ name: '', phone: '' });
   const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirm: '' });

   useEffect(() => {
      api.get('/users/me').then((res) => {
         setMe(res.data);
         setForm({ name: res.data.name || '', phone: res.data.phone || '' });
      }).catch(() => {});
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const saveProfile = async (e) => {
      e.preventDefault();
      try {
         const res = await api.put('/users/me', form);
         setMe({ ...me, ...res.data });
         setUser({ ...state.user, name: res.data.name });
         showToast('Profile saved', 'success');
      } catch {
         // Error toast shown by the API client
      }
   };

   const savePassword = async (e) => {
      e.preventDefault();
      if (pw.newPassword !== pw.confirm) return showToast('New passwords do not match', 'error');
      try {
         await api.put('/users/me', { currentPassword: pw.currentPassword, newPassword: pw.newPassword });
         setPw({ currentPassword: '', newPassword: '', confirm: '' });
         showToast('Password changed', 'success');
      } catch {
         // Error toast shown by the API client
      }
   };

   return (
      <div className="space-y-6 mt-6 max-w-3xl">
         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-1">
               <h3 className="text-xl font-bold text-gray-900">{me?.name || state?.user?.name}</h3>
               <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  {ROLE_LABEL[me?.role] || ''}
               </span>
            </div>
            <p className="text-gray-600">{me?.email}</p>
            <p className="text-sm text-gray-500">{me?.organization?.name}</p>
         </div>

         <form onSubmit={saveProfile} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            <h4 className="font-semibold text-gray-900">Profile</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <InputField label="Full name" name="name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
               <InputField label="Phone" name="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
               <InputField label="Email" name="email" type="email" value={me?.email || ''} readOnly info="Ask an admin to change your email." />
            </div>
            <div className="flex justify-end">
               <button type="submit" className="px-5 py-2.5 rounded-lg text-white bg-[var(--brand)] hover:opacity-90 text-sm font-medium">Save profile</button>
            </div>
         </form>

         <form onSubmit={savePassword} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            <h4 className="font-semibold text-gray-900">Change password</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <InputField label="Current password" name="currentPassword" type="password" autoComplete="current-password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} required />
               <InputField label="New password" name="newPassword" type="password" autoComplete="new-password" minLength={8} value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} required />
               <InputField label="Confirm new password" name="confirm" type="password" autoComplete="new-password" minLength={8} value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} required />
            </div>
            <div className="flex justify-end">
               <button type="submit" className="px-5 py-2.5 rounded-lg text-white bg-[var(--brand)] hover:opacity-90 text-sm font-medium">Change password</button>
            </div>
         </form>
      </div>
   );
}
