'use client';
import { useState, useEffect } from 'react';
import InputField from '@/app/components/forms/InputField';
import OrgBadge from '@/app/components/OrgBadge';
import { useApiClient } from '@/lib/apiClient';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/app/components/toast/ToastContext';

// Org admins set their organization's name, tagline, logo and brand color.
export default function OrganizationSettings() {
   const api = useApiClient();
   const { state, setOrganization } = useAuth();
   const { showToast } = useToast();
   const [form, setForm] = useState({ name: '', tagline: '', logoUrl: '', primaryColor: '#1F3864' });
   const [saving, setSaving] = useState(false);

   useEffect(() => {
      const o = state?.organization;
      if (o) setForm({ name: o.name || '', tagline: o.tagline || '', logoUrl: o.logoUrl || '', primaryColor: o.primaryColor || '#1F3864' });
   }, [state?.organization]);

   const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

   const save = async (e) => {
      e.preventDefault();
      setSaving(true);
      try {
         const res = await api.put('/organizations/current', form);
         setOrganization(res.data);
         showToast('Organization updated', 'success');
      } catch {
         // Error toast shown by the API client
      }
      setSaving(false);
   };

   return (
      <form onSubmit={save} className="space-y-6 mt-6 max-w-3xl">
         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center gap-4">
            <OrgBadge org={form} size={64} />
            <div>
               <h3 className="text-xl font-bold text-gray-900">{form.name || 'Your organization'}</h3>
               <p className="text-gray-600">{form.tagline}</p>
               {state?.organization?.slug && (
                  <p className="text-xs text-gray-500 mt-1">Branded login page: /login?org={state.organization.slug}</p>
               )}
            </div>
         </div>

         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Organization name" name="name" type="text" value={form.name} onChange={onChange} required />
            <InputField label="Tagline" name="tagline" type="text" value={form.tagline} onChange={onChange} placeholder="Connecting local businesses since 1987" />
            <InputField label="Logo URL" name="logoUrl" type="url" value={form.logoUrl} onChange={onChange} placeholder="https://..." info="A square PNG or SVG works best. Leave blank to use your initials." />
            <label className="block">
               <span className="text-gray-700 font-medium mb-1 block">Brand color</span>
               <div className="flex items-center gap-3">
                  <input type="color" name="primaryColor" value={form.primaryColor} onChange={onChange} className="h-12 w-16 rounded border border-gray-200 bg-white" />
                  <input type="text" name="primaryColor" value={form.primaryColor} onChange={onChange} pattern="#[0-9a-fA-F]{6}" className="w-full p-3 border rounded-lg bg-gray-50 border-gray-200" />
               </div>
               <small className="text-gray-500">Used for buttons, highlights and the sidebar.</small>
            </label>
         </div>

         <div className="flex justify-end">
            <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-lg text-white bg-[var(--brand)] hover:opacity-90 disabled:opacity-60 text-sm font-medium">
               {saving ? 'Saving...' : 'Save changes'}
            </button>
         </div>
      </form>
   );
}
