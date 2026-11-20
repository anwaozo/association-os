'use client';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import InputField from '@/app/components/forms/InputField';
import MultiSelect from '@/app/components/forms/MultiSelect';
import AdminRoute from '@/app/components/AdminRoute';
import { useApiClient } from '@/lib/apiClient';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/app/components/toast/ToastContext';
import { MERGE_HELP } from '@/app/message/MessageList';
import { Mail, ChevronRight, Users, Info } from 'lucide-react';

const AUDIENCES = [
   { id: 'all_members', value: 'All members' },
   { id: 'members_and_contacts', value: 'All members and contacts' },
   { id: 'tier', value: 'Members of a tier' },
   { id: 'event_attendees', value: 'People who RSVP’d to an event' },
   { id: 'custom', value: 'Choose people' },
];

// Same substitutions the server makes, for the preview.
const merge = (text, vars) => String(text || '')
   .replace(/\{\{\s*first_name\s*\}\}/gi, (vars.name || '').split(' ')[0] || 'there')
   .replace(/\{\{\s*name\s*\}\}/gi, vars.name || '')
   .replace(/\{\{\s*email\s*\}\}/gi, vars.email || '')
   .replace(/\{\{\s*organization\s*\}\}/gi, vars.organization || '');

function Compose() {
   const api = useApiClient();
   const router = useRouter();
   const params = useSearchParams();
   const { state } = useAuth();
   const { showToast } = useToast();
   const editId = params.get('edit');
   const templateParam = params.get('template');

   const [templates, setTemplates] = useState([]);
   const [tiers, setTiers] = useState([]);
   const [events, setEvents] = useState([]);
   const [people, setPeople] = useState([]);
   const [emailEnabled, setEmailEnabled] = useState(true);
   const [form, setForm] = useState({ templateId: '', audienceType: '', tierId: '', eventId: '', userIds: [], subject: '', body: '' });
   const [audience, setAudience] = useState(null); // { label, count } | { error }
   const [errors, setErrors] = useState({});
   const [saving, setSaving] = useState(false);
   const [loaded, setLoaded] = useState(false);

   useEffect(() => {
      (async () => {
         try {
            const [t, m, e, c, cfg] = await Promise.all([
               api.get('/messages/templates'),
               api.get('/memberships'),
               api.get('/events'),
               api.get('/contacts'),
               api.get('/messages/config', { silent: true }),
            ]);
            setTemplates(t.data);
            setTiers(m.data || []);
            setEvents(e.data || []);
            setPeople(c.data || []);
            setEmailEnabled(Boolean(cfg.data?.emailEnabled));

            if (editId) {
               const msg = (await api.get(`/messages/${editId}`)).data;
               if (!['draft', 'ready'].includes(msg.status)) return router.replace(`/message/${editId}`);
               const ref = msg.audienceRef || {};
               setForm({
                  templateId: msg.templateId ? String(msg.templateId) : '',
                  audienceType: msg.audienceType,
                  tierId: ref.tierId ? String(ref.tierId) : '',
                  eventId: ref.eventId ? String(ref.eventId) : '',
                  userIds: (ref.userIds || []).map(String),
                  subject: msg.subject,
                  body: msg.body,
               });
            } else if (templateParam) {
               const tpl = t.data.find((x) => String(x.id) === templateParam);
               if (tpl) setForm((f) => ({ ...f, templateId: String(tpl.id), subject: tpl.subject, body: tpl.body }));
            }
         } catch {
            // toast shown by the API client
         } finally {
            setLoaded(true);
         }
      })();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [editId, templateParam]);

   const audienceRef = useMemo(() => {
      if (form.audienceType === 'tier') return { tierId: Number(form.tierId) || null };
      if (form.audienceType === 'event_attendees') return { eventId: Number(form.eventId) || null };
      if (form.audienceType === 'custom') return { userIds: form.userIds.map(Number) };
      return {};
   }, [form.audienceType, form.tierId, form.eventId, form.userIds]);

   // Live recipient count.
   useEffect(() => {
      if (!form.audienceType) return setAudience(null);
      // Wait until the tier, event or people picker has a value.
      if ((form.audienceType === 'tier' && !form.tierId)
         || (form.audienceType === 'event_attendees' && !form.eventId)
         || (form.audienceType === 'custom' && !form.userIds.length)) return setAudience(null);
      const t = setTimeout(() => {
         api.post('/messages/audience-preview', { audienceType: form.audienceType, audienceRef }, { silent: true })
            .then((r) => setAudience(r.data))
            .catch((err) => setAudience({ error: err?.response?.data?.message || 'Choose who gets this message' }));
      }, 250);
      return () => clearTimeout(t);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [form.audienceType, audienceRef]);

   const pickTemplate = (id) => {
      const tpl = templates.find((x) => String(x.id) === id);
      const dirty = form.body.trim() && form.body !== templates.find((x) => String(x.id) === form.templateId)?.body;
      if (tpl && dirty && !window.confirm('Replace what you have written with this template?')) return;
      setForm((f) => ({ ...f, templateId: id, ...(tpl ? { subject: tpl.subject, body: tpl.body } : {}) }));
   };

   const validate = () => {
      const e = {};
      if (!form.audienceType) e.audienceType = 'Choose who gets this message.';
      if (form.audienceType === 'tier' && !form.tierId) e.tierId = 'Choose a tier.';
      if (form.audienceType === 'event_attendees' && !form.eventId) e.eventId = 'Choose an event.';
      if (form.audienceType === 'custom' && !form.userIds.length) e.userIds = 'Choose at least one person.';
      if (!form.subject.trim()) e.subject = 'Subject is required.';
      if (!form.body.trim()) e.body = 'Message is required.';
      setErrors(e);
      return Object.keys(e).length === 0;
   };

   const submit = async (action) => {
      if (!validate()) return;
      if (action === 'send' && emailEnabled) {
         const n = audience?.count ?? 0;
         if (!window.confirm(`Send this email to ${n} ${n === 1 ? 'person' : 'people'} now?`)) return;
      }
      setSaving(true);
      const payload = {
         subject: form.subject,
         body: form.body,
         audienceType: form.audienceType,
         audienceRef,
         templateId: form.templateId ? Number(form.templateId) : null,
      };
      try {
         let res;
         if (editId) {
            await api.put(`/messages/${editId}`, payload);
            res = action === 'send' ? await api.post(`/messages/${editId}/send`) : { data: { status: 'draft' } };
         } else {
            res = await api.post('/messages', { ...payload, action });
         }
         const st = res.data.status;
         if (st === 'sent' || st === 'partial') showToast(`Sent to ${res.data.sentCount} ${res.data.sentCount === 1 ? 'person' : 'people'}`, 'success');
         else if (st === 'ready') showToast('Saved as ready to send. It goes out once email is connected.', 'info');
         else showToast('Draft saved', 'success');
         router.push('/message');
      } catch {
         // toast shown by the API client
      } finally {
         setSaving(false);
      }
   };

   const orgName = state?.organization?.name || 'Your organization';
   const sample = { name: state?.user?.name || 'Jordan Smith', email: state?.user?.email || '', organization: orgName };
   const personOptions = people.map((p) => ({ value: String(p.id), label: p.name ? `${p.name} (${p.email})` : p.email }));

   if (!loaded) return <p className="text-gray-500">Loading…</p>;

   return (
      <div className="space-y-6">
         <nav className="flex items-center space-x-2 text-sm font-medium">
            <button onClick={() => router.push('/message')} className="flex items-center hover:text-[var(--brand)] transition">
               <Mail className="w-5 h-4 mr-1" /> Messages
            </button>
            <ChevronRight size={16} />
            <span className="text-gray-900">{editId ? 'Edit Message' : 'Compose Message'}</span>
         </nav>

         <h1 className="text-3xl font-bold text-gray-900">{editId ? 'Edit Message' : 'Compose New Message'}</h1>

         {!emailEnabled && (
            <div className="flex gap-3 items-start p-4 rounded-lg border border-amber-200 bg-amber-50 text-amber-900 text-sm">
               <Info size={18} className="shrink-0 mt-0.5" />
               <p>Email sending isn’t connected yet. <b>Send</b> saves this message as ready to send. Nothing goes out until email is switched on.</p>
            </div>
         )}

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 space-y-5">
               <InputField label="Template" name="template" type="select" value={form.templateId} values={templates.map((t) => ({ id: String(t.id), value: t.name }))} onChange={(e) => pickTemplate(e.target.value)} />

               <InputField
                  label="Audience" name="audience" type="select" value={form.audienceType} values={AUDIENCES}
                  error={errors.audienceType}
                  onFocus={() => setErrors((p) => ({ ...p, audienceType: null }))}
                  onChange={(e) => setForm({ ...form, audienceType: e.target.value })}
               />
               {form.audienceType === 'tier' && (
                  <InputField label="Tier" name="tier" type="select" value={form.tierId} values={tiers.map((t) => ({ id: String(t.id), value: t.name }))} error={errors.tierId}
                     onFocus={() => setErrors((p) => ({ ...p, tierId: null }))} onChange={(e) => setForm({ ...form, tierId: e.target.value })} />
               )}
               {form.audienceType === 'event_attendees' && (
                  <InputField label="Event" name="event" type="select" value={form.eventId} values={events.map((ev) => ({ id: String(ev.id), value: ev.title }))} error={errors.eventId}
                     onFocus={() => setErrors((p) => ({ ...p, eventId: null }))} onChange={(e) => setForm({ ...form, eventId: e.target.value })} />
               )}
               {form.audienceType === 'custom' && (
                  <MultiSelect label="Recipients" options={personOptions} value={form.userIds} placeholder="Search by name or email" error={errors.userIds}
                     onChange={(vals) => { setErrors((p) => ({ ...p, userIds: null })); setForm((f) => ({ ...f, userIds: vals })); }} />
               )}
               {audience && (
                  <p className={`flex items-center gap-2 text-sm ${audience.error ? 'text-red-600' : 'text-gray-700'}`}>
                     <Users size={16} />
                     {audience.error ? audience.error : <span><b>{audience.count}</b> {audience.count === 1 ? 'person' : 'people'} · {audience.label}</span>}
                  </p>
               )}

               <InputField label="Subject" name="subject" type="text" maxLength={200} value={form.subject} error={errors.subject}
                  onFocus={() => setErrors((p) => ({ ...p, subject: null }))} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
               <InputField label="Message" name="body" type="textarea" rows={12} value={form.body} error={errors.body} info={MERGE_HELP}
                  onFocus={() => setErrors((p) => ({ ...p, body: null }))} onChange={(e) => setForm({ ...form, body: e.target.value })} />

               <div className="flex flex-wrap justify-end gap-3 pt-2">
                  <button type="button" onClick={() => router.push('/message')} className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button type="button" disabled={saving} onClick={() => submit('draft')} className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-60">Save draft</button>
                  <button type="button" disabled={saving} onClick={() => submit('send')} className="px-5 py-2 text-sm font-medium text-white bg-[var(--brand)] rounded-lg disabled:opacity-60">
                     {saving ? 'Working…' : emailEnabled ? 'Send now' : 'Save as ready to send'}
                  </button>
               </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 h-fit lg:sticky lg:top-6">
               <p className="text-xs uppercase tracking-wide text-gray-500 mb-3">Preview (as {sample.name} would see it)</p>
               <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-white">
                  <div className="px-5 py-3 text-white font-semibold" style={{ background: 'var(--brand)' }}>{orgName}</div>
                  <div className="p-5">
                     <p className="font-semibold text-gray-900 mb-4">{merge(form.subject, sample) || <span className="text-gray-400">No subject yet</span>}</p>
                     <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{merge(form.body, sample) || <span className="text-gray-400">Your message appears here.</span>}</div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default function MessageAddPage() {
   return (
      <AdminRoute>
         <Suspense fallback={<p className="text-gray-500">Loading…</p>}>
            <Compose />
         </Suspense>
      </AdminRoute>
   );
}
