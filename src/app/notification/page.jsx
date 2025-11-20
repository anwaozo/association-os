'use client';
import { useState } from 'react';
import Header from '@/app/components/Header';
import { FaSearch, FaCreditCard, FaUserPlus, FaCheckCircle, FaHeart, FaBell } from 'react-icons/fa';
import ProtectedRoute from '@/app/components/ProtectedRoute';

export default function NotificationPage() {
   const [searchText, setSearchText] = useState('');
   const [filter, setFilter] = useState('All Activity');

   const MOCK_NOTIFICATIONS = [
      { 
         id: 1, 
         type: "payment",
         message: "Michael Chen paid $150 for Professional membership",
         details: [
            { label: "amount", value: "$150" },
            { label: "paymentId", value: "ch_3Nz..." }
         ],
         time: "5 minutes ago",
         template: "Payments"
      },
      { 
         id: 2, 
         type: "member_joined",
         message: "Emma Wilson registered as a Student member",
         details: [
            { label: "tier", value: "Student" },
            { label: "email", value: "emma.w@email.com" }
         ],
         time: "23 minutes ago",
         template: "Members"
      },
      { 
         id: 3, 
         type: "event_rsvp",
         message: "James Martinez RSVP'd to Annual Gala Dinner (2 tickets)", 
         details: [
            { label: "event", value: "Annual Gala Dinner" },
            { label: "tickets", value: "2" }
         ],
         time: "1 hour ago",
         template: "RSVPs"
      },
      { 
         id: 4, 
         type: "donation",
         message: "Anonymous donor contributed $500 to Annual Fund 2025", 
         details: [
            { label: "amount", value: "$500" },
            { label: "campaign", value: "Annual Fund 2025" }
         ],
         time: "2 hours ago",
         template: "Donations"
      },
      { 
         id: 5, 
         type: "notification_sent",
         message: "Event reminder sent to 127 Annual Gala attendees", 
         details: [
            { label: "recipients", value: "127" },
            { label: "template", value: "Event Reminder (24h)" }
         ],
         time: "2 hours ago",
         template: "Payments"
      },
   ];

   const filteredNotifications = MOCK_NOTIFICATIONS.filter(n => {
      const matchesSearch = 
         n.message.toLowerCase().includes(searchText.toLowerCase()) || 
         n.details.some(d => d.value.toLowerCase().includes(searchText.toLowerCase()))

      const matchesTemplate = filter === 'All Activity' || n.template === filter;

      return matchesSearch && matchesTemplate;
   });

   const uniqueTiers = ['All Activity', ...new Set(MOCK_NOTIFICATIONS.map(r => r.template))];

   const ICON_MAP = {
      payment: { icon: FaCreditCard, color: 'text-green-600', bg: 'bg-green-100', detailColor: 'text-green-800', detailBg: 'bg-green-100' },
      member_joined: { icon: FaUserPlus , color: 'text-blue-600', bg: 'bg-blue-100', detailColor: 'text-blue-800', detailBg: 'bg-blue-100' },
      event_rsvp: { icon: FaCheckCircle, color: 'text-purple-600', bg: 'bg-purple-100', detailColor: 'text-purple-800', detailBg: 'bg-purple-100' },
      donation: { icon: FaHeart, color: 'text-red-600', bg: 'bg-red-100', detailColor: 'text-red-800', detailBg: 'bg-red-100' },
      notification_sent: { icon: FaBell, color: 'text-orange-600', bg: 'bg-orange-100', detailColor: 'text-orange-800', detailBg: 'bg-orange-100' },
   };

   const DetailBadge = ({ label, value, type }) => {
      const { detailColor, detailBg } = ICON_MAP[type];
      
      return (
         <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${detailBg} ${detailColor} mr-2 mt-1`}>
               <span className="font-medium opacity-80 mr-1 capitalize">{label}:</span>
               <span className="font-semibold">{value}</span>
         </span>
      );
   };

   const NotificationRow = ({ notification }) => {
      const { icon: Icon, color, bg } = ICON_MAP[notification.type];

      return (
         <div className="flex justify-between items-start py-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer px-4 -mx-4 rounded-lg"> {/* Updated for light mode */}
               
            {/* Left Section: Icon and Message */}
            <div className="flex items-start flex-1">
               <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${bg} ${color} flex-shrink-0 mt-0.5`}>
                  <Icon className="w-4 h-4" />
               </div>
               
               <div className="ml-4 flex-1">
                  <p className="text-gray-900 font-medium leading-relaxed"> {/* Updated for light mode */}
                     {notification.message}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center">
                        {notification.details.map((detail, index) => (
                           <DetailBadge 
                              key={index} 
                              label={detail.label} 
                              value={detail.value} 
                              type={notification.type}
                           />
                        ))}
                  </div>
               </div>
            </div>

            {/* Right Section: Time */}
            <div className="ml-4 flex-shrink-0 text-right text-sm text-gray-500 pt-0.5"> {/* Updated for light mode */}
               {notification.time}
            </div>
         </div>
      );
   };
   
   return (
      <ProtectedRoute>
         <Header title="Notifications" subTitle="System-wide activity and recent events" />

         <div className="bg-white rounded-xl p-6 shadow-xl border border-gray-100"> 
            {/* Updated for light mode */}
            {/* Header / Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
               
               {/* Search Bar */}
               <div className="relative w-full md:w-1/2 mb-4 md:mb-0">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" /> {/* Updated for light mode */}
                  <input
                     type="text"
                     placeholder="Search activity..."
                     value={searchText}
                     onChange={(e) => setSearchText(e.target.value)}
                     className="w-full pl-10 pr-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none" // Updated for light mode
                  />
               </div>

               {/* Filter Dropdown (Simplified for mock) */}
               <div className="relative w-full md:w-auto">
                  <select
                     value={filter}
                     onChange={(e) => setFilter(e.target.value)}
                     className="w-full md:w-48 p-3 bg-white border border-gray-300 rounded-xl text-gray-900 appearance-none cursor-pointer focus:border-transparent transition shadow-sm"
               >
                     {uniqueTiers.map(template => (
                        <option key={template} value={template}>{template}</option>
                     ))}
                  </select>
               </div>
            </div>
            
            {/* Notification Rows */}
            <div className="divide-y divide-gray-200"> {/* Updated for light mode */}
               {filteredNotifications.length > 0 ? (
                  filteredNotifications.map(n => (
                     <NotificationRow key={n.id} notification={n} />
                  ))
               ) : (
                  <div className="text-center py-10 text-gray-500 text-lg">
                     No activity matches your search criteria.
                  </div>
               )}
            </div>
         </div>
      </ProtectedRoute>
   );
}
