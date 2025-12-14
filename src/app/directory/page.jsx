'use client';
import { Fragment, useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/app/components/Header';
import SearchBar from '@/app/components/SearchBar';
import { MapPin, Building2 } from 'lucide-react';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import ProfileModal from '@/app/directory/ProfileModal';
import { useApiClient } from "@/lib/apiClient";

export default function Directory() {
   const api = useApiClient();
   const [members, setMembers] = useState([]);
   const [events, setEvents] = useState([]);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [searchTerm, setSearchTerm] = useState('');
   const [statusFilter, setStatusFilter] = useState('All');
   const [selectedMember, setSelectedMember] = useState(null);

   useEffect(() => {
      const fetchContacts = async () => {
         const res = await api.get("/contacts");
         if (res.data) {
            setMembers(res.data);
         }
      };
      fetchContacts();
   }, []);

   /*const members = [
      { initials: 'SJ', name: 'Sarah Johnson', title: 'Senior Vice President', company: 'Goldman Sachs', location: 'New York, NY', tags: ['Finance', 'Investment', 'Leadership'], memberSince: '2 Year' },
      { initials: 'MC', name: 'Michael Chen', title: 'Founder & CEO', company: 'TechVentures In', location: 'San Francisco, CA', tags: ['Technology', 'Entrepreneurship', 'SaaS'], memberSince: '2 Year' },
      { initials: 'RT', name: 'Robert Taylor', title: 'Managing Partner', company: 'Taylor & Associate', location: 'New York, NY', tags: ['Legal', 'M&A', 'Corporate Law'], memberSince: '2 Year' },
      { initials: 'JL', name: 'Jennifer Lee', title: 'Chief Marketing Officer', company: 'Acme Corporation', location: 'Los Angeles, CA', tags: ['Marketing', 'Digital', 'Branding'], memberSince: '2 Year' },
      { initials: 'DW', name: 'David Wilson', title: 'Principal', company: 'Wilson Architects', location: 'Chicago, IL', tags: ['Architecture', 'Design', 'Sustainability'], memberSince: '2 Year' },
      { initials: 'ER', name: 'Emily Rodriguez', title: 'Professor of Economics', company: 'Columbia University', location: 'New York, NY', tags: ['Education', 'Economics', 'Research'], memberSince: '2 Year' },
   ];*/

   const filters = ['All Status', 'Upcoming', 'Ongoing', 'Completed'];

   const filteredMembers = members.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || member.status === statusFilter;
      return matchesSearch && matchesStatus;
   });

   const openProfile = (memberData) => {
      setSelectedMember(memberData);
   };

   const closeProfile = () => {
      setSelectedMember(null);
   };

   const getInitials = (fullName) => {
      const parts = fullName.split(' ');
      if (parts.length === 1) return parts[0][0];
      return parts.slice(0, 2).map(n => n[0]).join('');
   };

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
                  <div key={member.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-full">
                     <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold text-gray-500 flex-shrink-0">
                        {getInitials(member.name)}
                        </div>
                        <div>
                        <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">{member.title}</p>
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                           <Building2 size={14} />
                           <span>{member.company}</span>
                        </div>
                        </div>
                     </div>

                     <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
                        <MapPin size={14} />
                        <span>{member.location}</span>
                     </div>

                     <div className="flex flex-wrap gap-2 mb-6 flex-grow">
                        {member?.tags && member.tags.map((tag, index) => (
                           <span key={index} className="px-3 py-1 text-xs font-medium text-primary-orange bg-orange-100 rounded-full border border-orange-200">
                              {tag}
                           </span>
                        ))}
                     </div>

                     <button 
                        className="w-full py-2.5 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm cursor-pointer"
                        onClick={() => openProfile(member)}
                     >
                        View Profile
                     </button>
                  </div>
               ))}
            </div>
         </div>

         {selectedMember && (
            <ProfileModal member={selectedMember} onClose={closeProfile} />
         )}
      </ProtectedRoute>
   )
}