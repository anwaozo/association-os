export default function StatsCard({ title, value, color, icon, info }) {
   return (
      <div className="bg-white p-6 rounded-xl border border-gray-200 flex justify-between items-center card-shadow">
         <div>
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <p className="text-3xl font-bold mt-1 text-indigo-600">{value}</p>
            <p className="text-xs text-gray-500">{info}</p>
         </div>
         {icon ? (
            <div className={`p-3 rounded-full text-${color}-100 bg-${color}-200`}>
               {icon}
            </div>
         ) : ''}
      </div>
   );
}
