'use client';

export default function SettingsTabs({ tabs, active, onChange }) {
   return (
      <div className="flex border-b border-gray-200 -mb-px overflow-x-auto">
         {tabs.map(tab => (
            <button
               key={tab.id}
               onClick={() => onChange(tab.id)}
               className={`px-5 py-3 text-sm font-semibold flex items-center space-x-2 transition-colors duration-150 whitespace-nowrap ${
                  active === tab.id ? 'text-[var(--brand)] border-b-2 border-[var(--brand)]' : 'text-gray-500 hover:text-gray-700'
               }`}
            >
               <tab.icon size={16} /><span>{tab.label}</span>
            </button>
         ))}
      </div>
   );
}
