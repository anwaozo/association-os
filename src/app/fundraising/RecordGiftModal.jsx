'use client';
import { useState } from 'react';
import { X } from 'lucide-react';
import InputField from '@/app/components/forms/InputField';
import { useApiClient } from '@/lib/apiClient';
import { useToast } from '@/app/components/toast/ToastContext';
import { isoDay } from '@/lib/csv';

// Record a gift that didn't come through Stripe (cash, check, outside platform).
export default function RecordGiftModal({ campaigns, people, onClose, onSaved }) {
   const api = useApiClient();
   const { showToast } = useToast();
   const [form, setForm] = useState({ amount: '', method: 'check', campaignId: '', userId: '', donorName: '', donorEmail: '', date: isoDay(new Date()), note: '', isAnonymous: false });
   const [saving, setSaving] = useState(false);
   const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

   const save = async (e) => {
      e.preventDefault();
      setSaving(true);
      try {
         await api.post('/donations', {
            ...form,
            campaignId: form.campaignId || null,
            userId: form.userId || null,
            date: form.date ? `${form.date}T12:00:00` : null,
         });
         showToast('Gift recorded', 'success');
         onSaved();
      } catch {
         // toast shown by the API client
      } finally {
         setSaving(false);
      }
   };

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" onClick={onClose}>
         <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl shadow-2xl w-full max-w-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
               <div>
                  <h3 className="text-lg font-semibold">Record a gift</h3>
                  <p className="text-sm text-gray-500">For cash, checks, or gifts received outside AssociationOS.</p>
               </div>
               <button type="button" onClick={onClose} aria-label="Close" className="p-1 rounded-full hover:bg-gray-100"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <InputField label="Amount (USD)" name="amount" type="number" min="1" step="0.01" required value={form.amount} onChange={set('amount')} />
               <InputField label="Received by" name="method" type="select" required value={form.method} values={[{ id: 'check', value: 'Check' }, { id: 'cash', value: 'Cash' }, { id: 'other', value: 'Other' }]} onChange={set('method')} />
               <InputField label="Campaign" name="campaignId" type="select" value={form.campaignId} values={campaigns.map((c) => ({ id: String(c.id), value: c.name }))} onChange={set('campaignId')} info="Leave empty for a general gift." />
               <InputField label="Date received" name="date" type="date" value={form.date} onChange={set('date')} />
            </div>
            <InputField label="Donor (member or contact)" name="userId" type="select" value={form.userId} values={people.map((p) => ({ id: String(p.id), value: p.name ? `${p.name} (${p.email})` : p.email }))} onChange={set('userId')} info="Or type a name below for someone who isn't in your contacts." />
            {!form.userId && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="Donor name" name="donorName" type="text" required value={form.donorName} onChange={set('donorName')} />
                  <InputField label="Donor email (optional)" name="donorEmail" type="email" value={form.donorEmail} onChange={set('donorEmail')} />
               </div>
            )}
            <InputField label="Note (optional)" name="note" type="text" maxLength={500} placeholder="e.g. Check #1042" value={form.note} onChange={set('note')} />
            <label className="flex items-center gap-2 text-sm text-gray-700">
               <input type="checkbox" checked={form.isAnonymous} onChange={set('isAnonymous')} /> Donor asked to stay anonymous
            </label>
            <div className="flex justify-end gap-3 pt-2">
               <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
               <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-[var(--brand)] rounded-lg disabled:opacity-60">{saving ? 'Saving…' : 'Record gift'}</button>
            </div>
         </form>
      </div>
   );
}
