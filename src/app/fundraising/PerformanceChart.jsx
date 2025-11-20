import {
   LineChart,
   Line,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   ResponsiveContainer,
} from 'recharts';
import Currency from '@/app/components/Currency';
const CHART_DATA = [
   { name: 'Jan', amount: 55 },
   { name: 'Feb', amount: 62 },
   { name: 'Mar', amount: 68 },
   { name: 'Apr', amount: 70 },
   { name: 'May', amount: 75 },
   { name: 'Jun', amount: 80 },
   { name: 'Jul', amount: 88 },
   { name: 'Aug', amount: 85 },
   { name: 'Sep', amount: 78 },
   { name: 'Oct', amount: 72 },
   { name: 'Nov', amount: 65 },
   { name: 'Dec', amount: 60 },
];

export default function PerformanceChart() {
   // Custom Tooltip component for Recharts
   const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
         return (
            <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
               <p className="text-xs text-gray-500">{label}</p>
               <p className="text-md font-bold text-indigo-600">Raised: <Currency amount={payload[0].value * 100} /></p>
            </div>
         );
      }
      return null;
   };

   return (
      <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
         <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Fundraising performance</h3>
            <select className="bg-gray-100 text-gray-700 border border-gray-300 rounded-lg py-1 px-3 text-sm cursor-pointer focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none">
               <option>2025</option>
               <option>2024</option>
               <option>2023</option>
            </select>
         </div>
         <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
               <LineChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  {/* Customizes the grid lines to be subtle */}
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                  <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <YAxis 
                        stroke="#6b7280" 
                        style={{ fontSize: '12px' }} 
                        tickFormatter={(value) => `$${value * 10}`} 
                        domain={[50, 100]} // Set domain to match the visual scale of the screenshot
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#f97316" // Orange line color
                        strokeWidth={3}
                        dot={{ fill: '#f97316', stroke: '#fff', strokeWidth: 2, r: 4 }}
                        activeDot={{ fill: '#ef4444', stroke: '#fff', strokeWidth: 2, r: 6 }}
                  />
               </LineChart>
            </ResponsiveContainer>
         </div>
      </div>
   );
}