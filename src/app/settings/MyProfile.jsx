'use client';
import { useState, useEffect } from 'react';
import InputField from '@/app/components/forms/InputField';
import TagInput from '@/app/components/forms/TagInput';
import ToggleSwitch from '@/app/components/forms/ToggleSwitch';
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
   const emptyDir = { title: '', company: '', location: '', website: '', linkedin: '', about: '', tags: [], showInDirectory: true };
   const [dir, setDir] = useState(emptyDir);
   const [dirKey, setDirKey] = useState(0);

   useEffect(() => {
      api.get('/users/me').then((res) => {
         setMe(res.data);
         setForm({ name: res.data.name || '', phone: res.data.phone || '' });
         setDir({
            title: res.data.title || '', company: res.data.company || '', location: res.data.location || '',
            website: res.data.website || '', linkedin: res.data.linkedin || '', about: res.data.about || '',
            tags: res.data.tags || [], showInDirectory: res.data.showInDirectory !== false,
         });
         setDirKey((k) => k + 1);
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

   const saveDirectory = async (e) => {
      e.preventDefault();
      try {
         const res = await api.put('/users/me', dir);
         setMe({ ...me, ...res.data });
         setDir((d) => ({ ...d, website: res.data.website || '', linkedin: res.data.linkedin || '', tags: res.data.tags || [] }));
         showToast('Directory profile saved', 'success');
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

         <form onSubmit={saveDirectory} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            <div>
               <h4 className="font-semibold text-gray-900">Directory profile</h4>
               <p className="text-sm text-gray-500">What other members of {me?.organization?.name || 'your organization'} see about you in the directory.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <InputField label="Job title" name="title" type="text" maxLength={120} placeholder="e.g. Owner" value={dir.title} onChange={(e) => setDir({ ...dir, title: e.target.value })} />
               <InputField label="Company" name="company" type="text" maxLength={120} placeholder="e.g. Bayou Bakes" value={dir.company} onChange={(e) => setDir({ ...dir, company: e.target.value })} />
               <InputField label="Location" name="location" type="text" maxLength={120} placeholder="e.g. Houston, TX" value={dir.location} onChange={(e) => setDir({ ...dir, location: e.target.value })} />
               <InputField label="Website" name="website" type="text" maxLength={300} placeholder="e.g. yourcompany.com" value={dir.website} onChange={(e) => setDir({ ...dir, website: e.target.value })} />
               <InputField label="LinkedIn" name="linkedin" type="text" maxLength={300} placeholder="e.g. linkedin.com/in/yourname" value={dir.linkedin} onChange={(e) => setDir({ ...dir, linkedin: e.target.value })} />
            </div>
            <InputField label="About" name="about" type="textarea" maxLength={2000} placeholder="A few sentences about you and your business" value={dir.about} onChange={(e) => setDir({ ...dir, about: e.target.value })} />
            <div>
               <span className="text-gray-700 font-medium mb-1 block">Areas of expertise</span>
               <TagInput key={dirKey} name="tags" max={10} placeholder="Type one and press Enter (up to 10)" initial={dir.tags} onChange={(tags) => setDir((d) => ({ ...d, tags }))} />
            </div>
            <ToggleSwitch
               label="Show me in the member directory"
               description="Turn off to hide your profile from other members. Admins can still see you."
               enabled={dir.showInDirectory}
               setEnabled={(v) => setDir({ ...dir, showInDirectory: v })}
            />
            <div className="flex justify-end">
               <button type="submit" className="px-5 py-2.5 rounded-lg text-white bg-[var(--brand)] hover:opacity-90 text-sm font-medium">Save directory profile</button>
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
