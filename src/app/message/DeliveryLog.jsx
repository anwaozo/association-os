'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Plus, Search, Clock, CheckCircle, Users, User } from 'lucide-react';

export default function DeliveryLog({ messages }) {

   const [searchTerm, setSearchTerm] = useState('');
   const [filter, setFilter] = useState('All Types');  

   // Get unique tiers for the filter dropdown
   const uniqueTypes = ['All Types', ...new Set(messages.map(message => message.title))];

   const filteredMembers = messages.filter(message => {
      const matchesSearch = 
         message.title.toLowerCase().includes(searchTerm.toLowerCase());
            
      const matchesTypes = filter === 'All Types' || message.title === filter;
      
      return matchesSearch && matchesTypes;
   });

   const notificationType = (status) => {
      switch (status) {
         case 'Email':
            return 'text-green-700 bg-green-100 border border-green-200';
         case 'SMS':
            return 'text-red-700 bg-red-100 border border-red-200';
         default:
            return 'text-gray-700 bg-gray-100 border border-gray-200';
      }
   };

   const DeliveryLogRow = ({ log }) => {
      return (
         <div className="p-4 bg-white border-b border-gray-100 last:border-none">
            <div className="flex items-start justify-between mb-4">
               <div>
                  <h4 className="text-base font-semibold text-gray-900 mb-1">{log.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                     <TargetBadge type={log.target.type} label={log.target.label} />
                     <Clock size={14} />
                     <span>{log.time}</span>
                  </div>
               </div>
               <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-700 bg-green-50 rounded-full">
                  <CheckCircle size={14} /> Sent
               </span>
            </div>

            <div className="grid grid-cols-5 gap-4 text-center">
               {Object.entries(log.stats).map(([key, value]) => (
               <div key={key}>
                  <p className="text-xl font-bold text-gray-900">{value}</p>
                  <p className={`text-sm font-medium ${key === 'failed' && value > 0 ? 'text-red-500' : 'text-gray-500'}`}>
                     {key.charAt(0).toUpperCase() + key.slice(1)}
                  </p>
               </div>
               ))}
            </div>
         </div>
         /*<div className="bg-white text-black p-6 rounded-xl shadow-lg border border-gray-700 hover:border-gray-600 transition-all cursor-pointer mb-6">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <h3 className="text-xl font-semibold mb-1">
                     {member.template}
                  </h3>
               </div>
               
               <span className="px-3 py-1 bg-green-200 text-green-400 rounded-full text-xs font-semibold flex items-center flex-shrink-0">
                  <FaFacebookMessenger className="w-3 h-3 mr-1" /> Sent
               </span>
            </div>

            <div className="grid grid-cols-5 gap-4 pt-4 border-t border-gray-700">
               {member.delivery_log.map((key, value) => {
                  const displayColor = key.label === 'Failed' ? 'text-red-400' : 'text-green-400';
                  return (
                     <MetricBlock 
                        key={value}
                        label={key.label}
                        count={key.count}
                        color={displayColor}
                     />
                  );
               })}
            </div>
        </div>*/
      );
   };

   const TargetBadge = ({ type, label }) => {
      const Icon = type === 'group' ? Users : User;
      return (
         <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
            <Icon size={12} /> {label}
         </span>
      );
   };

   const MetricBlock = ({ label, count, color }) => (
      <div className="flex flex-col p-2">
         <p className={`text-2xl font-bold text-gray-500 uppercase tracking-wider mt-1 ${color}`}>
            {count}
         </p>
         <p className={`text-xl font-medium text-black mt-1`}>
            {label}
         </p>
      </div>
   );

   return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
         <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200">
            <div>
               <h2 className="text-lg font-semibold text-gray-900 mb-1">Delivery Log</h2>
               <p className="text-sm text-gray-600">Track sent messages and engagement</p>
            </div>
            <Link 
               href="/message/add" 
               className="flex items-center gap-2 px-4 py-2 bg-[var(--brand)] text-white rounded-lg transition-colors font-medium shadow-sm">
               <Plus size={18} />
               Compose Message
            </Link>
         </div>

         <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
               <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, campaign, amount" 
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-orange/50 focus:border-primary-orange"
               />
            </div>
            <select
               value={filter}
               onChange={(e) => setFilter(e.target.value)}
               className="w-full md:w-48 p-3 bg-white border border-gray-300 rounded-xl text-gray-900 cursor-pointer focus:border-transparent transition shadow-sm"
            >
               {uniqueTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
               ))}
            </select>
         </div>

         <div className="divide-y divide-gray-100 overflow-x-auto">
            {filteredMembers.length > 0 ? (
               filteredMembers.map(member => (
                  <DeliveryLogRow key={member.id} log={member} />
               ))
            ) : (
               <span className="px-6 py-10 text-center text-gray-500">
                  No match your current filters.
               </span>
            )}
         </div>
      </div>

      /*<div className="mt-8 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200">
         <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-xl font-bold text-gray-900">Delivery Log</h3>
               <button className="flex items-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-lg">
                  <FaPlus className="w-5 h-5 mr-2" />
                  Compose Message
               </button>
            </div>
            
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
               <div className="relative flex-1">
                  <input
                     type="text"
                     placeholder="Search by name, tickets, or email"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-transparent transition shadow-inner"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
               </div>
               
               <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full md:w-48 p-3 bg-white border border-gray-300 rounded-xl text-gray-900 cursor-pointer focus:border-transparent transition shadow-sm"
               >
                  {uniqueTypes.map(type => (
                     <option key={type} value={type}>{type}</option>
                  ))}
               </select>
            </div>
         </div>
         
         <div className="overflow-x-auto">
            {filteredMembers.length > 0 ? (
               filteredMembers.map(member => (
                  <DeliveryLogRow key={member.id} member={member} />
               ))
            ) : (
               <span className="px-6 py-10 text-center text-gray-500">
                  No match your current filters.
               </span>
            )}
         </div>
      </div>*/
   );
};