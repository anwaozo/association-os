'use client';
import { Fragment, useState } from 'react';
import Link from 'next/link';
import Header from '@/app/components/Header';
import SearchBar from '@/app/components/SearchBar';
import { FaPlus, FaCalendar, FaSearch, FaEllipsisH, FaClock, FaList, FaShare } from 'react-icons/fa';
import { FaLocationPin } from 'react-icons/fa6';
import ProtectedRoute from '@/app/components/ProtectedRoute';

export default function Directory() {
   const [events, setEvents] = useState([]);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [searchTerm, setSearchTerm] = useState('');
   const [statusFilter, setStatusFilter] = useState('All');

   const members = [
      { initials: 'SJ', name: 'Sarah Johnson', title: 'Senior Vice President', company: 'Goldman Sachs', location: 'New York, NY', tags: ['Finance', 'Investment', 'Leadership'] },
      { initials: 'MC', name: 'Michael Chen', title: 'Founder & CEO', company: 'TechVentures In', location: 'San Francisco, CA', tags: ['Technology', 'Entrepreneurship', 'SaaS'] },
      { initials: 'RT', name: 'Robert Taylor', title: 'Managing Partner', company: 'Taylor & Associate', location: 'New York, NY', tags: ['Legal', 'M&A', 'Corporate Law'] },
      { initials: 'JL', name: 'Jennifer Lee', title: 'Chief Marketing Officer', company: 'Acme Corporation', location: 'Los Angeles, CA', tags: ['Marketing', 'Digital', 'Branding'] },
      { initials: 'DW', name: 'David Wilson', title: 'Principal', company: 'Wilson Architects', location: 'Chicago, IL', tags: ['Architecture', 'Design', 'Sustainability'] },
      { initials: 'ER', name: 'Emily Rodriguez', title: 'Professor of Economics', company: 'Columbia University', location: 'New York, NY', tags: ['Education', 'Economics', 'Research'] },
   ];

   const filters = ['All Status', 'Upcoming', 'Ongoing', 'Completed'];

   // Filtered Events (simple client-side filter)
   const filteredMembers = members.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || member.status === statusFilter;
      return matchesSearch && matchesStatus;
   });

   return (
      <ProtectedRoute>
         <Header title="Directory" subTitle="Connect with fellow members of The Friar Society" />

         <div className={`bg-white p-6 rounded-xl shadow-xl border border-gray-100`}>

            <SearchBar
               filters={filters}
               searchTerm={searchTerm}
               setSearchTerm={setSearchTerm}
               statusFilter={statusFilter}
               setStatusFilter={setStatusFilter}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredMembers.map((member) => (
                  <div key={member.name} className="bg-white text-black rounded-xl shadow-xl p-6 border border-gray-100 hover:border-gray-500 transition-all duration-300">
      
                     <div className="flex items-center mb-4">
                        <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-black-200 mr-4">
                           {member.initials}
                        </div>
                        
                        <div>
                           <h3 className="text-xl font-semibold">{member.name}</h3>
                           <p className="text-sm">{member.title}</p>
                           <p className="text-sm ">{member.company}</p>
                        </div>
                     </div>

                     <div className="flex items-center text-sm text-gray-400 mb-4 pt-2 border-t border-gray-700">
                        <FaLocationPin className="w-4 h-4 mr-2 text-indigo-400" />
                        {member.location}
                     </div>

                     <div className="flex flex-wrap gap-2 mb-6">
                        {member.tags.map((tag) => (
                           <span key={tag} className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-500 border border-red-600 cursor-pointer transition">
                              {tag}
                           </span>
                        ))}
                     </div>

                     <button className="w-full py-2 border border-gray-600 text-white-200 rounded-lg font-medium transition cursor-pointer">
                     View Profile
                     </button>
                  </div>
               ))}
            </div>

         </div>
      </ProtectedRoute>
   )
}