'use client';
import { useState } from 'react';

// Amount picker + optional donor fields. Calls onSubmit({ amount, isAnonymous, note, donorName, donorEmail }).
// campaign: { donation_amount, isCustomAmount, isAnonymous } or null for a general gift.
export default function DonateForm({ campaign, askDonor = false, busy, disabled, onSubmit }) {
   const presets = (Array.isArray(campaign?.donation_amount) ? campaign.donation_amount : [])
      .map((v) => Number(String(v).replace(/[^0-9.]/g, '')))
      .filter((n) => n >= 1);
   const choices = presets.length ? presets : [25, 50, 100, 250];
   const allowCustom = !campaign || campaign.isCustomAmount !== false || presets.length === 0;

   const [amount, setAmount] = useState(String(choices[1] ?? choices[0]));
   const [custom, setCustom] = useState(false);
   const [isAnonymous, setIsAnonymous] = useState(false);
   const [note, setNote] = useState('');
   const [donorName, setDonorName] = useState('');
   const [donorEmail, setDonorEmail] = useState('');

   const value = Number(amount);
   const valid = value >= 1 && (!askDonor || (donorName.trim() && /\S+@\S+\.\S+/.test(donorEmail)));

   const submit = (e) => {
      e.preventDefault();
      if (!valid || busy || disabled) return;
      onSubmit({ amount: value, isAnonymous, note, donorName, donorEmail });
   };

   return (
      <form onSubmit={submit} className="space-y-4">
         <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Choose an amount</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
               {choices.map((c) => (
                  <button
                     type="button" key={c}
                     onClick={() => { setCustom(false); setAmount(String(c)); }}
                     className={`py-3 rounded-lg border text-base font-semibold transition ${!custom && Number(amount) === c ? 'bg-[var(--brand)] text-white border-[var(--brand)]' : 'bg-white text-gray-800 border-gray-300 hover:border-gray-400'}`}
                  >
                     ${c.toLocaleString()}
                  </button>
               ))}
            </div>
            {allowCustom && (
               <div className="mt-3">
                  {custom ? (
                     <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                           type="number" min="1" step="0.01" autoFocus value={amount}
                           onChange={(e) => setAmount(e.target.value)}
                           className="w-full pl-7 pr-3 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[var(--brand)]/30"
                           aria-label="Custom amount in dollars"
                        />
                     </div>
                  ) : (
                     <button type="button" onClick={() => { setCustom(true); setAmount(''); }} className="text-sm font-medium text-[var(--brand)]">Enter a different amount</button>
                  )}
               </div>
            )}
         </div>

         {askDonor && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
               <label className="block text-sm">
                  <span className="font-medium text-gray-700">Your name</span>
                  <input required value={donorName} onChange={(e) => setDonorName(e.target.value)} maxLength={120} className="mt-1 w-full p-3 border border-gray-300 rounded-lg" />
               </label>
               <label className="block text-sm">
                  <span className="font-medium text-gray-700">Email (for your receipt)</span>
                  <input required type="email" value={donorEmail} onChange={(e) => setDonorEmail(e.target.value)} maxLength={200} className="mt-1 w-full p-3 border border-gray-300 rounded-lg" />
               </label>
            </div>
         )}

         <label className="block text-sm">
            <span className="font-medium text-gray-700">Note (optional)</span>
            <input value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} placeholder="e.g. In honor of…" className="mt-1 w-full p-3 border border-gray-300 rounded-lg" />
         </label>

         {(!campaign || campaign.isAnonymous !== false) && (
            <label className="flex items-center gap-2 text-sm text-gray-700">
               <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} />
               Don’t show my name publicly
            </label>
         )}

         <button type="submit" disabled={!valid || busy || disabled} className="w-full py-3 rounded-lg text-white font-semibold bg-[var(--brand)] disabled:opacity-50">
            {busy ? 'Opening secure checkout…' : `Donate${value >= 1 ? ` $${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : ''}`}
         </button>
         <p className="text-xs text-gray-500 text-center">Payments are processed securely by Stripe.</p>
      </form>
   );
}
