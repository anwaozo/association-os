import Link from 'next/link';
import { useState } from 'react';
import { FaSearch, FaPlus } from 'react-icons/fa';

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

   const MemberRow = ({ member }) => {
      // Simple dropdown for actions (placeholder)
      const [isMenuOpen, setIsMenuOpen] = useState(false);
      const actionClasses = "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left";
      
      return (
         <tr className="border-b border-gray-100 hover:bg-gray-50 transition duration-100">
            <td className="px-6 py-4 whitespace-nowrap">
               <div className="text-sm font-semibold text-gray-900">{member.template}</div>
               <div className="text-xs text-gray-500">{member.subject}</div>
            </td>
            
            <td className="px-6 py-4 whitespace-nowrap">
               <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ml-3 ${notificationType(member.notification_type)}`}>
                  {member.notification_type}
               </span> 
               <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ml-3 border-gray-200 bg-gray-100`}>
                  Edit
               </span>
               <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ml-3 border-gray-200 bg-gray-100`}>
                  Use
               </span>
            </td>
         </tr>
      );
   };

   return (
      <div className="mt-8 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200">
         {/* Header and Search/Filter Bar */}
         <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-xl font-bold text-gray-900">Message Templates</h3>
               <Link 
                  className="flex items-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-lg"
                  href={"/message/add"}
               >
                  <FaPlus className="w-5 h-5 mr-2" />
                  Compose Message
               </Link>
            </div>
            
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
               {/* Search Bar */}
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
               
               {/* Types Filter */}
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
         
         {/* Table */}
         <div className="overflow-x-auto">
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