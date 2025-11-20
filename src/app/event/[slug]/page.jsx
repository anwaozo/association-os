'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '@/app/components/Sidebar';
import { FaCalendar, FaClock, FaMapPin, FaDollarSign, FaUsers, FaCheckSquare, FaChevronLeft, FaFacebookMessenger, FaEdit, FaSearch, FaDownload, FaCheckCircle, FaMinusCircle, FaFile, FaEllipsisV, FaChevronDown } from 'react-icons/fa';
import { FaCircleXmark } from 'react-icons/fa6';
import ToggleSwitch from '@/app/components/forms/ToggleSwitch';
import { useSelectedItem } from "@/store/useSelectedItem";
import { formatToReadableDate, formatToTime, getEventStatus} from '@/app/components/DateTimeFormat';

export default function EventDetailPage({ params }) {
   const [isOpen, setIsOpen] = useState(true);
   const { item, clearItem } = useSelectedItem();
   if (!params) {
      return <div>Loading or Event not found...</div>;
   }
   const [activeTab, setActiveTab] = useState('details');

   useEffect(() => {
      if (!item) {
         router.replace("/membership"); // redirect back to list
      }
   }, [item]);

   const getStatusColor = (date) => {
      const status = getEventStatus(date);
      if (status === 'Upcoming') return 'text-green-700 bg-green-100';
      if (status === 'Ongoing') return 'text-yellow-700 bg-yellow-100';
      return 'text-gray-700 bg-gray-100';
   };

   const getRsvpStatusColor = (status) => {
      switch (status) {
         case 'Confirmed':
            return 'text-green-700 bg-green-100 border border-green-200';
         case 'Pending':
            return 'text-yellow-700 bg-yellow-100 border border-yellow-200';
         case 'Waitlist':
            return 'text-blue-700 bg-blue-100 border border-blue-200';
         case 'Canceled':
            return 'text-red-700 bg-red-100 border border-red-200';
         default:
            return 'text-gray-700 bg-gray-100 border border-gray-200';
      }
   };

   const ReminderDropdown = ({ selectedValue, onChange }) => {
      const options = [
         { value: 1, label: '1 day before the day' },
         { value: 3, label: '3 days before the day' },
         { value: 7, label: '7 days before the day' },
      ];

      return (
         <div className="relative inline-block text-left mt-2">
            <select
               value={selectedValue}
               onChange={(e) => onChange(parseInt(e.target.value))}
               className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-xl appearance-none bg-white border"
            >
               {options.map(option => (
                  <option key={option.value} value={option.value}>
                        {option.label}
                  </option>
               ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
               <FaChevronDown className="w-4 h-4" />
            </div>
         </div>
      );
   };

   const EventSettingsTab = ({ event, onSaveSettings, onDeleteEvent }) => {
      // State for local changes before saving
      const [enableRSVP, setEnableRSVP] = useState(event.enableRSVP);
      const [remindersEnabled, setRemindersEnabled] = useState(event.remindersEnabled);
      const [reminderDays, setReminderDays] = useState(event.reminderDays);
      const [isPublic, setIsPublic] = useState(event.isPublic);

      // Check if any setting has changed from the initial event state
      const settingsChanged = 
         enableRSVP !== event.enableRSVP || 
         remindersEnabled !== event.remindersEnabled ||
         (remindersEnabled && reminderDays !== event.reminderDays) || // Only check reminderDays if reminders are active
         isPublic !== event.isPublic;

      // Placeholder save function
      const handleSave = () => {
         const newSettings = { enableRSVP, remindersEnabled, reminderDays, isPublic };
         console.log(`Saving settings for event ${event.id}:`, newSettings);
         onSaveSettings(newSettings); // Pass up the changes
      };


      return (
         <div className="mt-4 space-y-6">
            {/* --- Settings Card (Matching the uploaded image) --- */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-200">
               
               {/* 1. RSVP Enabled Toggle */}
               <div className="pb-6 border-b border-gray-100">
                  <ToggleSwitch
                     label="RSVP Enabled"
                     description="Allow members to register for this event"
                     enabled={enableRSVP}
                     setEnabled={setEnableRSVP}
                  />
               </div>

               {/* 2. Send Reminders Toggle + Dropdown */}
               <div className="pb-6 border-b border-gray-100">
                  <ToggleSwitch
                     label="Send Reminders"
                     description="Automatically remind attendees before the event"
                     enabled={remindersEnabled}
                     setEnabled={setRemindersEnabled}
                     input="select"
                     data={<ReminderDropdown
                        selectedValue={reminderDays}
                        onChange={setReminderDays}
                     />}
                  />
                  {/*remindersEnabled && (
                     <ReminderDropdown
                        selectedValue={reminderDays}
                        onChange={setReminderDays}
                     />
                  )*/}
               </div>


               {/* 3. Public Event Toggle */}
               <div className="pb-8 border-b border-gray-100">
                  <ToggleSwitch
                     label="Public Event"
                     description="Show this event on the public landing page"
                     enabled={isPublic}
                     setEnabled={setIsPublic}
                  />
               </div>

               {/* Show a message if settings were changed and not saved (for the sake of the demo flow) */}
               {settingsChanged && (
                  <div className="flex justify-end pt-4">
                     <button
                        onClick={handleSave}
                        className="px-6 py-2 text-sm font-semibold rounded-xl text-white bg-green-500 hover:bg-green-600 transition"
                     >
                        Apply & Save Changes
                     </button>
                  </div>
               )}


               {/* 4. Cancel Event Button (Matches the design) */}
               <div className="pt-8">
                  <button
                     onClick={() => {
                        // In a real app, this would trigger a confirmation modal (not alert())
                        handleDeleteEvent(event.id); 
                     }}
                     className="flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl shadow-lg transition duration-150"
                  >
                     <FaCircleXmark className="w-5 h-5 mr-2" />
                     Cancel Event
                  </button>
               </div>
            </div>
         </div>
      );
   }

   const EventRsvpsTab = ({ rsvps }) => {
      const [searchTerm, setSearchTerm] = useState('');
      const [filterTier, setFilterTier] = useState('All Tiers');
      
      // Calculate total guests (sum of tickets)
      const totalGuests = rsvps.reduce((sum, rsvp) => sum + rsvp.tickets, 0);

      // Get unique tiers for the filter dropdown
      const uniqueTiers = ['All Tiers', ...new Set(rsvps.map(r => r.tier))];

      const filteredRsvps = rsvps.filter(rsvp => {
         const name = rsvp.user?.name?.toLowerCase() || "";
         const email = rsvp.user?.email?.toLowerCase() || "";
         const phone = rsvp.user?.phone || "";

         const matchesSearch = 
            name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            phone.includes(searchTerm) ||
            String(rsvp.user_id).includes(searchTerm);
               
         const matchesTier = filterTier === 'All Tiers' || rsvp.tier === filterTier;
         
         // Only show Confirmed, Pending, Waitlist in the list (filter out Canceled)
         const isVisible = rsvp.status !== 'Canceled';
         
         return matchesSearch && matchesTier && isVisible;
      });

      const RsvpRow = ({ rsvp }) => {
         const [isMenuOpen, setIsMenuOpen] = useState(false);
         const actionClasses = "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left";
         
         return (
            <tr className="border-b border-gray-100 hover:bg-gray-50 transition duration-100">
               <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">{rsvp?.user?.name}</div>
                  <div className="text-xs text-gray-500">{rsvp?.user?.email}</div>
               </td>
               
               <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${getRsvpStatusColor(rsvp.status)}`}>
                     {rsvp.status === 'Confirmed' && <FaCheckCircle className="w-3 h-3 mr-1" />}
                     {rsvp.status === 'Pending' && <FaMinusCircle className="w-3 h-3 mr-1" />}
                     {rsvp.status === 'Waitlist' && <FaFile className="w-3 h-3 mr-1" />}
                     {rsvp.status}
                  </span>
               </td>
               
               {/* Tier */}
               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {rsvp.tier}
               </td>
               
               {/* Tickets */}
               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {rsvp.tickets}
               </td>
               
               {/* RSVP Date */}
               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {rsvp.rsvpDate}
               </td>
               
               {/* Actions */}
               <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                  <button 
                     onClick={() => setIsMenuOpen(!isMenuOpen)} 
                     className="text-gray-400 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100 transition"
                  >
                     <FaEllipsisV className="w-5 h-5" />
                  </button>
                  
                  {isMenuOpen && (
                     <div className="absolute right-8 top-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-10">
                           <button className={actionClasses} onClick={() => { console.log('Confirm RSVP', rsvp.id); setIsMenuOpen(false); }}>
                              Send Email
                           </button>
                           <button className={actionClasses} onClick={() => { console.log('Cancel RSVP', rsvp.id); setIsMenuOpen(false); }}>
                              Cancel RSVP
                           </button>
                     </div>
                  )}
               </td>
            </tr>
         );
      };

      return (
         <div className="mt-8 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200">
               
               {/* Header and Search/Filter Bar */}
               <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="text-xl font-bold text-gray-900">All RSVPs</h3>
                     <button className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-800 font-medium rounded-xl hover:bg-gray-100 transition shadow-sm">
                           <FaDownload className="w-5 h-5 mr-2" />
                           Download List
                     </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                     <span className="font-semibold text-gray-900">{filteredRsvps.length}</span> Members / <span className="font-semibold text-gray-900">{totalGuests}</span> Guests
                  </p>
                  
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
                     
                     {/* Tier Filter */}
                     <select
                           value={filterTier}
                           onChange={(e) => setFilterTier(e.target.value)}
                           className="w-full md:w-48 p-3 bg-white border border-gray-300 rounded-xl text-gray-900 appearance-none cursor-pointer focus:border-transparent transition shadow-sm"
                     >
                           {uniqueTiers.map(tier => (
                              <option key={tier} value={tier}>{tier}</option>
                           ))}
                     </select>
                  </div>
               </div>
               
               {/* RSVP Table */}
               <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gray-50">
                           <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                 Name
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                 Status
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                 Tier
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                 Tickets
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                 RSVP Date
                              </th>
                              <th scope="col" className="relative px-6 py-3">
                                 <span className="sr-only">Actions</span>
                              </th>
                           </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-gray-100">
                           {filteredRsvps.length > 0 ? (
                              filteredRsvps.map(rsvp => (
                                 <RsvpRow key={rsvp.id} rsvp={rsvp} />
                              ))
                           ) : (
                              <tr>
                                 <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                                       No RSVPs match your current filters.
                                 </td>
                              </tr>
                           )}
                     </tbody>
                  </table>
               </div>

         </div>
      );
   };

   const event = {
      id: 1,
      name: "Annual Gala Dinner",
      slug: "annual-gala-dinner",
      date: "Oct 15, 2025",
      time: "7:00 - 9:00",
      location: "Grand Hall",
      description: "Join us for our annual celebration with distinguished guests and members.",
      status: "Upcoming",
      attendance: 85,
      capacity: 100,
      cost: 0,
      rsvp: 127,
      rsvps: [
         { id: 101, name: "John Doe", email: "john@example.com", status: "Confirmed", tier: "Professional", tickets: 2, rsvpDate: "Oct 1, 2025" },
         { id: 102, name: "Sarah Johnson", email: "sarah@example.com", status: "Confirmed", tier: "Patron", tickets: 1, rsvpDate: "Oct 2, 2025" },
         { id: 103, name: "Michael Chen", email: "michael@example.com", status: "Confirmed", tier: "Professional", tickets: 2, rsvpDate: "Oct 2, 2025" },
         { id: 104, name: "Emily Rodriguez", email: "emily@example.com", status: "Confirmed", tier: "Student", tickets: 3, rsvpDate: "Oct 2, 2025" },
         { id: 105, name: "David Wilson", email: "david@example.com", status: "Confirmed", tier: "Professional", tickets: 2, rsvpDate: "Oct 5, 2025" },
         { id: 106, name: "Jennifer Lee", email: "jennifer@example.com", status: "Pending", tier: "Alumni", tickets: 1, rsvpDate: "Oct 6, 2025" },
         { id: 107, name: "Robert Taylor", email: "robert@example.com", status: "Canceled", tier: "Patron", tickets: 2, rsvpDate: "Oct 7, 2025" },
         { id: 108, name: "Lisa Anderson", email: "lisa@example.com", status: "Confirmed", tier: "Student", tickets: 1, rsvpDate: "Oct 8, 2025" },
         { id: 109, name: "Chris Evans", email: "chris@example.com", status: "Pending", tier: "Professional", tickets: 2, rsvpDate: "Oct 9, 2025" },
         { id: 110, name: "Maria Garcia", email: "maria@example.com", status: "Confirmed", tier: "Alumni", tickets: 1, rsvpDate: "Oct 10, 2025" },
         { id: 111, name: "Kevin Smith", email: "kevin@example.com", status: "Waitlist", tier: "Student", tickets: 1, rsvpDate: "Oct 11, 2025" },
         { id: 112, name: "Jessica Brown", email: "jessica@example.com", status: "Confirmed", tier: "Patron", tickets: 2, rsvpDate: "Oct 12, 2025" },
         { id: 113, name: "Tom Holland", email: "tom@example.com", status: "Confirmed", tier: "Professional", tickets: 1, rsvpDate: "Oct 13, 2025" },
      ],
   };

   // Calculate attendance percentage, safely handling division by zero
   const filledPercent = item.capacity > 0 ? ((item.rsvps.length / item.capacity) * 100).toFixed(0) : 0;

   const TabButton = ({ id, label, count }) => (
      <button
         onClick={() => setActiveTab(id)}
         className={`
            px-5 py-3 text-sm font-semibold flex items-center space-x-2 transition-colors duration-150
            ${activeTab === id 
               ? 'text-[#FF884D] border-b-2 border-[#FF884D]' 
               : 'text-gray-500 hover:text-gray-700'
            }
         `}
      >
         <span>{label}</span>
         {count !== undefined && (
            <span className="ml-1 px-2 py-0.5 text-xs font-bold rounded-full bg-gray-200 text-gray-700">
               {count}
            </span>
         )}
      </button>
   );
   
   const onBack = () => {
      window.history.back();
   }

   const onDeleteEvent = () => {
      console.log(`Deleting event ${event.id}`);
   }

   const handleSaveSettings = (eventId, newSettings) => {
      setEvents(prevEvents => prevEvents.map(event => 
         event.id === eventId ? { ...event, ...newSettings } : event
      ));
      console.log(`Settings updated for ${eventId}:`, newSettings);
   };

   // --- Event Details Tab Content ---
   const EventDetailsTab = () => (
      <div className="mt-8 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8 text-gray-700 mb-8 pb-8 border-b border-gray-100">
            <div className="flex items-start space-x-3">
               <FaCalendar className="w-5 h-5 text-[#FF884D] flex-shrink-0 mt-0.5" />
               <div>
                  <p className="font-semibold text-sm text-gray-500">Date</p>
                  <p className="text-gray-900 font-medium">{formatToReadableDate(item.date)}</p>
               </div>
            </div>
            <div className="flex items-start space-x-3">
               <FaClock className="w-5 h-5 text-[#FF884D] flex-shrink-0 mt-0.5" />
               <div>
                  <p className="font-semibold text-sm text-gray-500">Time</p>
                  <p className="text-gray-900 font-medium">{formatToTime(item.start_time)} - {formatToTime(item.end_time)}</p>
               </div>
            </div>
            <div className="flex items-start space-x-3">
               <FaMapPin className="w-5 h-5 text-[#FF884D] flex-shrink-0 mt-0.5" />
               <div>
                  <p className="font-semibold text-sm text-gray-500">Location / Link</p>
                  <p className="text-gray-900 font-medium">{item.location}</p>
               </div>
            </div>
         </div>

         <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-3">About the Event</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{item.description}</p>
         </div>
         
         <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex-1 w-full">
               <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-semibold text-gray-700">Event Capacity</p>
                  <p className="text-sm font-bold text-green-600">{filledPercent}% filled</p>
               </div>
               <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                     className="h-2.5 rounded-full bg-green-500 transition-all duration-500" 
                     style={{ width: `${filledPercent}%` }}
                  ></div>
               </div>
            </div>
            
            <div className="flex items-center space-x-2 p-3 bg-white rounded-xl shadow-md border border-gray-300">
               <FaUsers className="w-6 h-6 text-[#FF884D]" />
               <div>
                  <p className="text-lg font-bold text-gray-900 leading-none">{item.rsvps.length}/{item.capacity}</p>
                  <p className="text-xs text-gray-500 leading-none">RSVPs</p>
               </div>
            </div>
         </div>
         
         <div className="mt-6 space-y-3">
            {item.price > 0 && (
               <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl border border-blue-200 text-blue-800">
                  <FaDollarSign className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold">Price:</span>
                  <span className="font-bold">${item.price.toFixed(2)} per person</span>
               </div>
            )}
         </div>
      </div>
   );

   const renderTabContent = () => {
      switch (activeTab) {
         case 'details':
            return <EventDetailsTab />;
         case 'rsvps':
            return <EventRsvpsTab rsvps={item.rsvps} />;
         case 'settings':
            return <EventSettingsTab 
               event={event} 
               onSaveSettings={(newSettings) => handleSaveSettings(event.id, newSettings)} 
               onDeleteEvent={onDeleteEvent}
            />
         default:
            return null;
      }
   };

   return (
      <div className="space-y-6">
         <nav className="flex items-center space-x-2 text-sm text-gray-500 font-medium">
            <button onClick={onBack} className="flex items-center hover:text-[#FF884D] transition">
               <FaChevronLeft className="w-4 h-4 mr-0.5" />
               Events
            </button>
            <span>/</span>
            <span className="text-gray-900 font-bold truncate max-w-xs">{item.title}</span>
         </nav>

         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6">
            <div className="flex flex-wrap items-center space-x-4 mb-4 sm:mb-0">
               <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
               <div className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(item.date)}`}>
                  {getEventStatus(item.date)}
               </div>
            </div>
               
            {/* Actions */}
            <div className="flex space-x-3">
               <button className="flex items-center px-4 py-2 bg-[#FF884D] border border-gray-300 text-white font-medium rounded-xl transition shadow-sm">
                  <FaFacebookMessenger className="w-5 h-5 mr-2" />
                  Send Announcement
               </button>
               <button className="flex items-center px-4 py-2 bg-white text-gray-800 font-medium rounded-xl shadow-md transition">
                  <FaEdit className="w-5 h-5 mr-2" />
                  Edit Event
               </button>
            </div>
         </div>
         
         {/* Tabs Navigation */}
         <div className="flex border-b border-gray-200 -mb-px">
            <TabButton id="details" label="Event Details" />
            <TabButton id="rsvps" label="RSVPs" count={item.attendance} />
            <TabButton id="settings" label="Settings" />
         </div>

         {/* Tab Content */}
         {renderTabContent()}

      </div>
   );
};