'use client';
import { useState, useEffect } from 'react';
import Currency from '@/app/components/Currency';
import { FaChevronLeft, FaFacebookMessenger, FaEdit, FaSearch, FaCheckCircle, FaMinusCircle, FaFile, FaEllipsisV, FaChevronDown } from 'react-icons/fa';
import { FaCircleXmark } from 'react-icons/fa6';
import ToggleSwitch from '@/app/components/forms/ToggleSwitch';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { useSelectedItem } from "@/store/useSelectedItem";

export default function MembershipDetailPage({ params }) {
   const { item, clearItem } = useSelectedItem();
   if (!params) {
      return <div>Loading or Membership Tier not found...</div>;
   }
   const [activeTab, setActiveTab] = useState('details');

   useEffect(() => {
      if (!item) {
         router.replace("/membership");
      }
   }, [item]);

   const getMemberStatusColor = (status) => {
      switch (status) {
         case 'Active':
            return 'text-green-700 bg-green-100 border border-green-200';
         case 'Lapsed':
            return 'text-yellow-700 bg-yellow-100 border border-yellow-200';
         case 'Contact':
            return 'text-blue-700 bg-blue-100 border border-blue-200';
         case 'Paid Due':
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
                  />
                  {remindersEnabled && (
                     <ReminderDropdown
                        selectedValue={reminderDays}
                        onChange={setReminderDays}
                     />
                  )}
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

   const MembersTab = ({ members }) => {
      const [searchTerm, setSearchTerm] = useState('');
      const [filterTier, setFilterTier] = useState('All Status');

      // Get unique tiers for the filter dropdown
      const uniqueTiers = ['All Status', ...new Set(members.map(r => r.status))];
      
      const filteredMembers = members.filter(member => {
         const matchesSearch = 
               member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
               String(member.phone).includes(searchTerm);
               
         const matchesTier = filterTier === 'All Status' || member.status === filterTier;
         
         // Only show Confirmed, Pending, Waitlist in the list (filter out Canceled)
         const isVisible = members.status !== 'Canceled';
         
         return matchesSearch && matchesTier && isVisible;
      });

      const MemberRow = ({ member }) => {
         // Simple dropdown for actions (placeholder)
         const [isMenuOpen, setIsMenuOpen] = useState(false);
         const actionClasses = "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left";
         
         return (
            <tr className="border-b border-gray-100 hover:bg-gray-50 transition duration-100">
                  {/* Name & Email */}
                  <td className="px-6 py-4 whitespace-nowrap">
                     <div className="text-sm font-semibold text-gray-900">{member.name}</div>
                  </td>

                  {/* Contact Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                     <div className="text-sm text-gray-600">{member.email}</div>
                     <div className="text-sm text-gray-400">{member.phone}</div>
                  </td>
                  
                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                     <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${getMemberStatusColor(member.status)}`}>
                        {member.status === 'Active' && <FaCheckCircle className="w-3 h-3 mr-1" />}
                        {member.status === 'Pending' && <FaMinusCircle className="w-3 h-3 mr-1" />}
                        {member.status === 'Waitlist' && <FaFile className="w-3 h-3 mr-1" />}
                        {member.status}
                     </span>
                  </td>
                  
                  {/* RSVP Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                     {member.joinDate}
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
                              <button className={actionClasses} onClick={() => { console.log('Confirm RSVP', member.id); setIsMenuOpen(false); }}>
                                 Send Email
                              </button>
                              <button className={actionClasses} onClick={() => { console.log('Cancel RSVP', member.id); setIsMenuOpen(false); }}>
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
               
            {/* Members Table */}
            <div className="overflow-x-auto">
               <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                        <tr>
                           <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                           </th>
                           <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Contact
                           </th>
                           <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                           </th>
                           <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Join Date
                           </th>
                           <th scope="col" className="relative px-6 py-3">
                              <span className="sr-only">Actions</span>
                           </th>
                        </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                        {filteredMembers.length > 0 ? (
                           filteredMembers.map(member => (
                              <MemberRow key={member.id} member={member} />
                           ))
                        ) : (
                           <tr>
                              <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                                    No Members match your current filters.
                              </td>
                           </tr>
                        )}
                  </tbody>
               </table>
            </div>
         </div>
      );
   };

   const tier = {
      id: 1,
      name: "Student",
      slug: 'student',
      price: "$50 / Annual",
      status: "Autorenew",
      benefits: [
         "Access to all events",
         "Member directory access",
         "Exclusive newsletters"
      ],
      activeMembers: 48,
      monthlyRevenue: 200,
      members: [{
         id: 1,
         name: "John Doe",
         email: "jhon@mail.com",
         phone: "555-1234",
         status: "Active",
         joinDate: "2023-01-15",
      },
      {
         id: 2,
         name: "Mark Smith",
         email: "mark@mail.com",
         phone: "555-1235",
         status: "Contact",
         joinDate: "2023-02-15",
      }
   ],
   };

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
      console.log(`Deleting Tier ${tier.id}`);
   }

   const handleSaveSettings = (eventId, newSettings) => {
      setEvents(prevEvents => prevEvents.map(event => 
         tier.id === eventId ? { ...tier, ...newSettings } : event
      ));
      console.log(`Settings updated for ${eventId}:`, newSettings);
   };

   // --- Event Details Tab Content ---
   const MembershipDetailsTab = () => (
      <div className="mt-8 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200">
         <p><Currency amount={item.price} /></p>
         <p>Auto-Renew Enabled <span>{item.auto_renewal === true ? 'Yes' : 'No'}</span></p>

         <div className="mt-4 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Benefits</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{item.benefits.join("\n")}</p>
         </div>
         
         {/* Monthly Revenue */}
         <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex-1 w-full">
               <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-semibold text-gray-700">Monthly Revenue</p>
               </div>
            </div>
            
            {/* Amount */}
            <div className="flex items-center space-x-2 p-3 bg-white rounded-xl shadow-md border border-gray-300">
               <div>
                  <p className="text-lg font-bold text-gray-900 leading-none">
                     <Currency amount={tier.monthlyRevenue} />
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
   // --- End Tab Content ---

   const renderTabContent = () => {
      switch (activeTab) {
         case 'details':
            return <MembershipDetailsTab />;
         case 'rsvps':
            return <MembersTab members={tier.members} />;
         case 'settings':
            return <EventSettingsTab 
               event={item} 
               onSaveSettings={(newSettings) => handleSaveSettings(tier.id, newSettings)} 
               onDeleteEvent={onDeleteEvent}
            />
         default:
            return null;
      }
   };

   return (
      <ProtectedRoute>
         <div className="space-y-6">
            
            <nav className="flex items-center space-x-2 text-sm text-gray-500 font-medium">
               <button onClick={onBack} className="flex items-center hover:text-[#FF884D] transition">
                  <FaChevronLeft className="w-4 h-4 mr-0.5" />
                  Membership Tiers
               </button>
               <span>/</span>
               <span className="text-gray-900 font-bold truncate max-w-xs">{item.name}</span>
            </nav>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6">
               <div className="flex flex-wrap items-center space-x-4 mb-4 sm:mb-0">
                  <h1 className="text-3xl font-bold text-gray-900">{item.name}</h1>
               </div>
                  
               {/* Actions */}
               <div className="flex space-x-3">
                  <button className="flex items-center px-4 py-2 bg-[#FF884D] border border-gray-300 text-white font-medium rounded-xl transition shadow-sm">
                     <FaFacebookMessenger className="w-5 h-5 mr-2" />
                     Invite Contact
                  </button>
                  <button className="flex items-center px-4 py-2 bg-white text-gray-800 font-medium rounded-xl shadow-md transition">
                     <FaEdit className="w-5 h-5 mr-2" />
                     Edit Tier
                  </button>
               </div>
            </div>
            
            {/* Tabs Navigation */}
            <div className="flex border-b border-gray-200 -mb-px">
               <TabButton id="details" label="Tier Details" />
               <TabButton id="rsvps" label="Members" count={tier.activeMembers} />
               <TabButton id="settings" label="Settings" />
            </div>

            {/* Tab Content */}
            {renderTabContent()}

         </div>
      </ProtectedRoute>
   );
};