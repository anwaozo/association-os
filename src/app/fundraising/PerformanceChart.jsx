'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Currency from '@/app/components/Currency';

// monthly: [{ label: 'Jan', amountCents }] for the last 12 months, oldest first.
export default function PerformanceChart({ monthly = [] }) {
   const data = monthly.map((m) => ({ name: m.label, amount: (m.amountCents || 0) / 100 }));
   const empty = data.every((d) => d.amount === 0);

   const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
         return (
            <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
               <p className="text-xs text-gray-500">{label}</p>
               <p className="text-md font-bold text-gray-900">Raised: <Currency amount={payload[0].value} /></p>
            </div>
         );
      }
      return null;
   };

   return (
      <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 h-full">
         <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Fundraising performance</h3>
            <span className="text-sm text-gray-500">Last 12 months</span>
         </div>
         <div className="h-[250px] relative">
            {empty && <p className="absolute inset-0 flex items-center justify-center text-sm text-gray-400 z-10">Donations will chart here as they come in.</p>}
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '12px' }} tickLine={false} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} tickLine={false} axisLine={false} allowDecimals={false}
                     tickFormatter={(v) => (v >= 1000 ? `$${Math.round(v / 100) / 10}k` : `$${v}`)} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6' }} />
                  <Bar dataKey="amount" fill="var(--brand)" radius={[4, 4, 0, 0]} maxBarSize={36} />
               </BarChart>
            </ResponsiveContainer>
         </div>
      </div>
   );
}
