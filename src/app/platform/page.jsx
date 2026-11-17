'use client';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Copy, Check, X, Link2, RefreshCw } from 'lucide-react';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import Header from '@/app/components/Header';
import OrgBadge from '@/app/components/OrgBadge';
import { useApiClient } from '@/lib/apiClient';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/app/components/toast/ToastContext';

const STATUS = {
   2: { label: 'Pending review', cls: 'bg-amber-100 text-amber-800' },
   1: { label: 'Active', cls: 'bg-green-100 text-green-700' },
   0: { label: 'Suspended', cls: 'bg-gray-200 text-gray-700' },
   3: { label: 'Rejected', cls: 'bg-red-100 text-red-700' },
};
const INVITE = {
   pending: { label: 'Invite sent', cls: 'text-blue-700' },
   used: { label: 'Admin signed up', cls: 'text-green-700' },
   expired: { label: 'Invite expired', cls: 'text-red-700' },
   revoked: { label: 'Invite replaced', cls: 'text-gray-500' },
};
const TABS = [
   { id: 'pending', label: 'Pending', match: (o) => o.status === 2 },
   { id: 'active', label: 'Active', match: (o) => o.status === 1 },
   { id: 'other', label: 'Suspended & rejected', match: (o) => o.status === 0 || o.status === 3 },
   { id: 'all', label: 'All', match: () => true },
];
const field = 'block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand)] text-sm';
const fmt = (d) => (d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '');

function Modal({ title, onClose, children }) {
   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-label={title}>
         <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
               <h2 className="font-semibold text-gray-900">{title}</h2>
               <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
            </div>
            <div className="p-6">{children}</div>
         </div>
      </div>
   );
}

function InviteLinkModal({ org, invite, onClose }) {
   const [copied, setCopied] = useState(false);
   const url = `${window.location.origin}/invite/${invite.token}`;
   const copy = async () => {
      try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* select manually */ }
   };
   return (
      <Modal title={`Invite link for ${org.name}`} onClose={onClose}>
         <p className="text-sm text-gray-600 mb-3">
            Send this link to <strong>{invite.email}</strong>. It works once and expires <strong>{fmt(invite.expiresAt)}</strong>.
         </p>
         <div className="flex gap-2">
            <input readOnly value={url} onFocus={(e) => e.target.select()} className={`${field} bg-gray-50 font-mono text-xs`} aria-label="Invite link" />
            <button onClick={copy} className="shrink-0 inline-flex items-center gap-1 px-3 py-2 rounded-lg text-white bg-[var(--brand)] hover:opacity-90 text-sm">
               {copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy</>}
            </button>
         </div>
         <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mt-4">
            Copy it now: for security the link is only shown once. If it&apos;s lost or expires, use &ldquo;New invite link&rdquo;; the old one stops working.
         </p>
      </Modal>
   );
}

function NewOrgModal({ onClose, onCreated }) {
   const api = useApiClient();
   const [f, setF] = useState({ name: '', slug: '', tagline: '', primaryColor: '#1F3864', contactName: '', contactEmail: '', contactPhone: '' });
   const [error, setError] = useState('');
   const [busy, setBusy] = useState(false);
   const set = (e) => setF({ ...f, [e.target.name]: e.target.value });
   const submit = async (e) => {
      e.preventDefault();
      setBusy(true); setError('');
      try {
         const res = await api.post('/platform/organizations', f, { silent: true });
         onCreated(res.data);
      } catch (err) { setError(err?.response?.data?.message || 'Could not create the organization.'); }
      setBusy(false);
   };
   return (
      <Modal title="New organization" onClose={onClose}>
         <form onSubmit={submit} className="space-y-4">
            <div>
               <label htmlFor="o-name" className="block text-sm font-medium text-gray-700 mb-1">Organization name</label>
               <input id="o-name" name="name" value={f.name} onChange={set} required className={field} />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label htmlFor="o-slug" className="block text-sm font-medium text-gray-700 mb-1">Short name <span className="text-gray-400">(optional)</span></label>
                  <input id="o-slug" name="slug" value={f.slug} onChange={set} placeholder="houston-chamber" className={field} />
               </div>
               <div>
                  <label htmlFor="o-color" className="block text-sm font-medium text-gray-700 mb-1">Brand color</label>
                  <input id="o-color" type="color" name="primaryColor" value={f.primaryColor} onChange={set} className="h-10 w-full rounded border border-gray-200" />
               </div>
            </div>
            <div className="border-t border-gray-100 pt-4">
               <p className="text-sm font-medium text-gray-900 mb-3">Organization admin</p>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label htmlFor="o-cname" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                     <input id="o-cname" name="contactName" value={f.contactName} onChange={set} required className={field} />
                  </div>
                  <div>
                     <label htmlFor="o-cphone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                     <input id="o-cphone" name="contactPhone" value={f.contactPhone} onChange={set} className={field} />
                  </div>
               </div>
               <div className="mt-4">
                  <label htmlFor="o-cemail" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input id="o-cemail" type="email" name="contactEmail" value={f.contactEmail} onChange={set} required className={field} />
               </div>
            </div>
            {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
            <div className="flex justify-end gap-2 pt-2">
               <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100">Cancel</button>
               <button type="submit" disabled={busy} className="px-4 py-2 rounded-lg text-sm text-white bg-[var(--brand)] hover:opacity-90 disabled:opacity-60">{busy ? 'Creating...' : 'Create and get invite link'}</button>
            </div>
         </form>
      </Modal>
   );
}

function RejectModal({ org, onClose, onDone }) {
   const api = useApiClient();
   const [reason, setReason] = useState('');
   const [busy, setBusy] = useState(false);
   const submit = async (e) => {
      e.preventDefault(); setBusy(true);
      try { await api.post(`/platform/organizations/${org.id}/reject`, { reason }); onDone(); } catch { /* toast shown */ }
      setBusy(false);
   };
   return (
      <Modal title={`Reject ${org.name}?`} onClose={onClose}>
         <form onSubmit={submit} className="space-y-4">
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason <span className="text-gray-400">(optional, for your records)</span></label>
            <textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} rows={3} className={field} />
            <div className="flex justify-end gap-2">
               <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100">Cancel</button>
               <button type="submit" disabled={busy} className="px-4 py-2 rounded-lg text-sm text-white bg-red-600 hover:bg-red-700 disabled:opacity-60">Reject application</button>
            </div>
         </form>
      </Modal>
   );
}

function Console() {
   const api = useApiClient();
   const router = useRouter();
   const { state } = useAuth();
   const { showToast } = useToast();
   const [orgs, setOrgs] = useState(null);
   const [tab, setTab] = useState('pending');
   const [modal, setModal] = useState(null); // {type, org, invite}
   const [busyId, setBusyId] = useState(null);

   useEffect(() => {
      if (state.user && !state.user.isPlatformAdmin) router.replace('/dashboard');
   }, [state.user, router]);

   const load = useCallback(async () => {
      try { const res = await api.get('/platform/organizations'); setOrgs(res.data); } catch { setOrgs([]); }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);
   useEffect(() => { if (state.user?.isPlatformAdmin) load(); }, [load, state.user]);

   const counts = useMemo(() => Object.fromEntries(TABS.map((t) => [t.id, (orgs || []).filter(t.match).length])), [orgs]);
   const rows = (orgs || []).filter(TABS.find((t) => t.id === tab).match);

   const act = async (org, fn) => {
      setBusyId(org.id);
      try { await fn(); } catch { /* toast shown by API client */ }
      setBusyId(null);
   };
   const approve = (org) => act(org, async () => {
      const res = await api.post(`/platform/organizations/${org.id}/approve`);
      showToast(`${org.name} approved`, 'success');
      setModal({ type: 'invite', org: res.data.organization, invite: res.data.invite });
      load();
   });
   const newLink = (org) => act(org, async () => {
      const res = await api.post(`/platform/organizations/${org.id}/invites`, {});
      setModal({ type: 'invite', org: res.data.organization, invite: res.data.invite });
      load();
   });
   const setStatus = (org, status) => act(org, async () => {
      await api.put(`/platform/organizations/${org.id}/status`, { status });
      showToast(status === 0 ? `${org.name} suspended` : `${org.name} reactivated`, 'success');
      load();
   });

   return (
      <Fragment>
         <div className="flex items-start justify-between gap-4">
            <Header title="Platform Console" subTitle="Review applications, onboard organizations and manage invite links" />
            <button onClick={() => setModal({ type: 'new' })} className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-[var(--brand)] hover:opacity-90 text-sm font-medium">
               <Plus size={16} /> New organization
            </button>
         </div>

         <div className="flex border-b border-gray-200 mb-4 overflow-x-auto">
            {TABS.map((t) => (
               <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap ${tab === t.id ? 'text-[var(--brand)] border-b-2 border-[var(--brand)]' : 'text-gray-500 hover:text-gray-700'}`}>
                  {t.label} <span className="ml-1 text-xs rounded-full bg-gray-100 px-2 py-0.5 text-gray-600">{counts[t.id] ?? 0}</span>
               </button>
            ))}
         </div>

         {orgs === null ? (
            <p className="text-gray-500">Loading...</p>
         ) : rows.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-500">
               {tab === 'pending' ? 'No applications waiting for review.' : 'Nothing here yet.'}
            </div>
         ) : (
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
               {rows.map((o) => {
                  const st = STATUS[o.status] || STATUS[1];
                  const inv = o.latestInvite ? INVITE[o.latestInvite.status] : null;
                  const adminJoined = o.latestInvite?.status === 'used' || (o._count?.users ?? 0) > 0;
                  const busy = busyId === o.id;
                  return (
                     <div key={o.id} className="p-5 flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                           <OrgBadge org={o} size={40} />
                           <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                 <span className="font-semibold text-gray-900 truncate">{o.name}</span>
                                 <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${st.cls}`}>{st.label}</span>
                              </div>
                              <p className="text-sm text-gray-600 truncate">
                                 {o.contactName ? `${o.contactName} · ` : ''}{o.contactEmail || 'No contact on file'}{o.contactPhone ? ` · ${o.contactPhone}` : ''}
                              </p>
                              <p className="text-xs text-gray-500">
                                 {o.status === 2 ? `Applied ${fmt(o.createdAt)}` : `${o._count?.users ?? 0} people · created ${fmt(o.createdAt)}`}
                                 {o.status === 3 && o.rejectionReason ? ` · ${o.rejectionReason}` : ''}
                                 {inv && o.status === 1 && (
                                    <span className={`ml-2 ${inv.cls}`}>
                                       {inv.label}{o.latestInvite.status === 'pending' ? ` · expires ${fmt(o.latestInvite.expiresAt)}` : ''}
                                    </span>
                                 )}
                              </p>
                           </div>
                        </div>
                        <div className="flex flex-wrap gap-2 md:justify-end">
                           {o.status === 2 && (
                              <>
                                 <button disabled={busy} onClick={() => approve(o)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-white bg-green-600 hover:bg-green-700 disabled:opacity-60"><Check size={16} /> Approve</button>
                                 <button disabled={busy} onClick={() => setModal({ type: 'reject', org: o })} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-red-700 border border-red-200 hover:bg-red-50 disabled:opacity-60"><X size={16} /> Reject</button>
                              </>
                           )}
                           {o.status === 1 && !adminJoined && (
                              <button disabled={busy} onClick={() => newLink(o)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-gray-800 border border-gray-300 hover:bg-gray-50 disabled:opacity-60">
                                 {o.latestInvite ? <RefreshCw size={16} /> : <Link2 size={16} />} New invite link
                              </button>
                           )}
                           {o.status === 1 && o.slug !== 'associationos' && (
                              <button disabled={busy} onClick={() => setStatus(o, 0)} className="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-60">Suspend</button>
                           )}
                           {o.status === 0 && (
                              <button disabled={busy} onClick={() => setStatus(o, 1)} className="px-3 py-1.5 rounded-lg text-sm text-gray-800 border border-gray-300 hover:bg-gray-50 disabled:opacity-60">Reactivate</button>
                           )}
                        </div>
                     </div>
                  );
               })}
            </div>
         )}

         {modal?.type === 'invite' && <InviteLinkModal org={modal.org} invite={modal.invite} onClose={() => setModal(null)} />}
         {modal?.type === 'new' && (
            <NewOrgModal
               onClose={() => setModal(null)}
               onCreated={(data) => { showToast(`${data.organization.name} created`, 'success'); setTab('active'); setModal({ type: 'invite', org: data.organization, invite: data.invite }); load(); }}
            />
         )}
         {modal?.type === 'reject' && <RejectModal org={modal.org} onClose={() => setModal(null)} onDone={() => { showToast(`${modal.org.name} rejected`, 'success'); setModal(null); load(); }} />}
      </Fragment>
   );
}

export default function PlatformPage() {
   return <ProtectedRoute><Console /></ProtectedRoute>;
}
