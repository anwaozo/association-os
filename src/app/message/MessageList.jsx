'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Plus, Search, ChevronDown, Mail } from 'lucide-react';

export default function MessageList({ messages }) {

   const [searchTerm, setSearchTerm] = useState('');
   const [filter, setFilter] = useState('All Types');  

   // Get unique tiers for the filter dropdown
   const uniqueTypes = ['All Types', ...new Set(messages.map(message => message.template))];

   const filteredMembers = messages.filter(message => {
      const matchesSearch = 
         message.template.toLowerCase().includes(searchTerm.toLowerCase()) ||
         message.subject.toLowerCase().includes(searchTerm.toLowerCase());
            
      const matchesTypes = filter === 'All Types' || message.template === filter;
      
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

   const Badge = ({ type }) => {
      const isEmail = type === 'Email';
      const bgColor = isEmail ? 'bg-green-100' : 'bg-orange-100';
      const textColor = isEmail ? 'text-green-800' : 'text-primary-orange';
      return (
         <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${bgColor} ${textColor}`}>
            {type}
         </span>
      );
   };

   const MemberRow = ({ member }) => {
      // Simple dropdown for actions (placeholder)
      const [isMenuOpen, setIsMenuOpen] = useState(false);
      const actionClasses = "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left";
      
      return (
         <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100 last:border-none">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
               <Mail size={20} />
               </div>
               <div>
                  <h4 className="text-sm font-medium text-gray-900">{member.template}</h4>
                  <p className="text-sm text-gray-500">{member.subject}</p>
               </div>
            </div>
            <div className="flex items-center gap-3">
               <Badge type={member.notification_type} />
               <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
               Edit
               </button>
               <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
               Use
               </button>
            </div>
         </div>
      );
   };

   return (
     <div className="bg-white rounded-xl shadow-sm border border-gray-200">
         <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200">
            <div>
               <h2 className="text-lg font-semibold text-gray-900 mb-1">Message Templates</h2>
               <p className="text-sm text-gray-600">Pre-configured templates for common notifications</p>
            </div>
            <Link 
               href="/message/add" 
               className="flex items-center gap-2 px-4 py-2 bg-[#FF7A2C] text-white rounded-lg transition-colors font-medium shadow-sm">
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
            <table className="min-w-full divide-y divide-gray-200">
               <tbody className="bg-white divide-y divide-gray-100">
                  {filteredMembers.length > 0 ? (
                     filteredMembers.map(member => (
                        <MemberRow key={member.id} member={member} />
                     ))
                  ) : (
                     <tr>
                        <td colSpan="2" className="px-6 py-10 text-center text-gray-500">
                           No match your current filters.
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
   );
};