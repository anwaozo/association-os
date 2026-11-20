'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Mail, Pencil, Trash2, X } from 'lucide-react';
import InputField from '@/app/components/forms/InputField';
import { useApiClient } from '@/lib/apiClient';
import { useToast } from '@/app/components/toast/ToastContext';

export const MERGE_HELP = 'You can use {{first_name}}, {{name}}, {{email}} and {{organization}}. They are filled in for each person.';

function TemplateModal({ template, onClose, onSaved }) {
   const api = useApiClient();
   const { showToast } = useToast();
   const [form, setForm] = useState({ name: template?.name || '', subject: template?.subject || '', body: template?.body || '' });
   const [saving, setSaving] = useState(false);

   const save = async (e) => {
      e.preventDefault();
      setSaving(true);
      try {
         if (template?.id) await api.put(`/messages/templates/${template.id}`, form);
         else await api.post('/messages/templates', form);
         showToast('Template saved', 'success');
         onSaved();
      } catch {
         // toast shown by the API client
      } finally {
         setSaving(false);
      }
   };

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" onClick={onClose}>
         <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
               <h3 className="text-lg font-semibold">{template?.id ? 'Edit template' : 'New template'}</h3>
               <button type="button" onClick={onClose} aria-label="Close" className="p-1 rounded-full hover:bg-gray-100"><X size={18} /></button>
            </div>
            <InputField label="Template name" name="name" type="text" maxLength={100} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <InputField label="Subject" name="subject" type="text" maxLength={200} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            <InputField label="Message" name="body" type="textarea" rows={10} required value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} info={MERGE_HELP} />
            <div className="flex justify-end gap-3">
               <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
               <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-[var(--brand)] rounded-lg disabled:opacity-60">{saving ? 'Saving…' : 'Save template'}</button>
            </div>
         </form>
      </div>
   );
}

export default function MessageList({ templates, onChange }) {
   const api = useApiClient();
   const { showToast } = useToast();
   const [searchTerm, setSearchTerm] = useState('');
   const [editing, setEditing] = useState(null); // null | {} (new) | template

   const q = searchTerm.toLowerCase();
   const filtered = templates.filter((t) => `${t.name} ${t.subject}`.toLowerCase().includes(q));

   const remove = async (t) => {
      if (!window.confirm(`Delete the "${t.name}" template? Messages already sent are not affected.`)) return;
      try {
         await api.delete(`/messages/templates/${t.id}`);
         showToast('Template deleted', 'success');
         onChange();
      } catch {
         // toast shown by the API client
      }
   };

   return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
         <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200">
            <div>
               <h2 className="text-lg font-semibold text-gray-900 mb-1">Message Templates</h2>
               <p className="text-sm text-gray-600">Reusable starting points for common emails</p>
            </div>
            <button onClick={() => setEditing({})} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50">
               <Plus size={18} /> New Template
            </button>
         </div>

         <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="relative">
               <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search templates"
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--brand)]/30"
               />
            </div>
         </div>

         <div className="divide-y divide-gray-100">
            {filtered.map((t) => (
               <div key={t.id} className="flex items-center justify-between p-4 gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                     <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 shrink-0"><Mail size={20} /></div>
                     <div className="min-w-0">
                        <h4 className="text-sm font-medium text-gray-900">{t.name}</h4>
                        <p className="text-sm text-gray-500 truncate">{t.subject || 'No subject'}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                     <button onClick={() => setEditing(t)} className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"><Pencil size={14} /> Edit</button>
                     <button onClick={() => remove(t)} aria-label={`Delete ${t.name}`} className="p-2 text-gray-500 border border-gray-300 rounded-lg hover:bg-red-50 hover:text-red-600"><Trash2 size={14} /></button>
                     <Link href={`/message/add?template=${t.id}`} className="px-3 py-1.5 text-sm font-medium text-white bg-[var(--brand)] rounded-lg">Use</Link>
                  </div>
               </div>
            ))}
            {filtered.length === 0 && <p className="px-6 py-10 text-center text-gray-500">No templates match your search.</p>}
         </div>

         {editing && <TemplateModal template={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); onChange(); }} />}
      </div>
   );
}
