'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
   Search,
  Info,
  NotepadText,
  CalendarDays,
  Clock,
  MapPin,
  Send,
  SquarePen,
  UsersIcon,
  ChevronLeft,
  Settings2,
  FileDown
} from 'lucide-react';
import ToggleSwitch from '@/app/components/forms/ToggleSwitch';
import { useSelectedItem } from "@/store/useSelectedItem";
import { useApiClient } from "@/lib/apiClient";
import { useToast } from "@/app/components/toast/ToastContext";
import EventAddPage from '@/app/event/add/page';
import { downloadCsv, fileSafe, isoDay } from '@/lib/csv';
import { SHOW_PREVIEW } from "@/lib/features";
import { formatToReadableDate, formatToTime, getEventStatus} from '@/app/components/DateTimeFormat';

export default function EventDetailPage({ params }) {
   const [isOpen, setIsOpen] = useState(true);
   const { item, setItem, clearItem } = useSelectedItem();
   const router = useRouter();
   const api = useApiClient();
   const { showToast } = useToast();
   const [isEditOpen, setIsEditOpen] = useState(false);
   if (!params) {
      return <div>Loading or Event not found...</div>;
   }
   const [activeTab, setActiveTab] = useState('details');

   // "View RSVPs" links here with ?tab=rsvps.
   useEffect(() => {
      if (new URLSearchParams(window.location.search).get('tab') === 'rsvps') setActiveTab('rsvps');
   }, []);

   useEffect(() => {
      if (!item) {
         router.replace("/event"); // redirect back to the events list
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

   // Full payload for PUT /events/:id (the API validates the whole event).
   const eventPayload = (ev, overrides = {}) => ({
      title: ev.title,
      date: isoDay(ev.date),
      start_time: ev.start_time,
      end_time: ev.end_time,
      location: ev.location,
      capacity: ev.capacity,
      price: ev.price,
      description: ev.description,
      isRSVP: ev.isRSVP !== false,
      isPublic: Boolean(ev.isPublic),
      ...overrides,
   });

   // Saves an edit and keeps the page in sync with what the API returned.
   const saveEvent = async (data) => {
      try {
         const res = await api.put(`/events/${item.id}`, data);
         setItem({ ...item, ...res.data });
         showToast("Event updated successfully!", "success");
         return true;
      } catch (err) {
         showToast("Failed to update event", "error");
         return false;
      }
   };

   const EventSettingsTab = () => {
      const [enableRSVP, setEnableRSVP] = useState(item?.isRSVP !== false);
      const [isPublic, setIsPublic] = useState(Boolean(item?.isPublic));
      const [saving, setSaving] = useState(false);
      const settingsChanged = enableRSVP !== (item?.isRSVP !== false) || isPublic !== Boolean(item?.isPublic);

      const handleSave = async () => {
         setSaving(true);
         await saveEvent(eventPayload(item, { isRSVP: enableRSVP, isPublic }));
         setSaving(false);
      };

      return (
         <div className="mt-4 space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-200">
               <div className="pb-6 border-b border-gray-100">
                  <ToggleSwitch
                     label="RSVP Enabled"
                     description="Allow members to register for this event"
                     enabled={enableRSVP}
                     setEnabled={setEnableRSVP}
                  />
               </div>
               <div className="pb-6 border-b border-gray-100">
                  <ToggleSwitch
                     label="Public Event"
                     description="Show this event on the public landing page"
                     enabled={isPublic}
                     setEnabled={setIsPublic}
                  />
               </div>
               <div className="flex justify-end pt-4">
                  <button
                     onClick={handleSave}
                     disabled={!settingsChanged || saving}
                     className="px-6 py-2 text-sm font-semibold rounded-xl text-white bg-[var(--brand)] hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                     {saving ? 'Saving…' : 'Save Changes'}
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
                  {SHOW_PREVIEW && (
                  <button 
                     onClick={() => setIsMenuOpen(!isMenuOpen)} 
                     className="text-gray-400 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100 transition"
                  >
                     <FaEllipsisV className="w-5 h-5" />
                  </button>
                  )}
                  
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
            <div className="mb-6">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">All RSVPs</h3>
                  <button
                     onClick={() => downloadCsv(`${fileSafe(item?.title)}-rsvps.csv`, [
                        { header: 'Name', value: (r) => r.user?.name },
                        { header: 'Email', value: (r) => r.user?.email },
                        { header: 'RSVP Date', value: (r) => isoDay(r.createdAt) },
                     ], filteredRsvps)}
                     className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-800 font-medium rounded-xl hover:bg-gray-100 transition shadow-sm"
                  >
                        <FileDown className="w-5 h-5 mr-2" />
                        Download List
                  </button>
               </div>
               <p className="text-sm text-gray-600 mb-4">
                  <span className="font-semibold text-gray-900">{filteredRsvps.length}</span> Members / <span className="font-semibold text-gray-900">{totalGuests?totalGuests:0}</span> Guests
               </p>
               
               <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
                  <div className="relative flex-1">
                     <input
                        type="text"
                        placeholder="Search by name, tickets, or email"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-transparent transition shadow-inner"
                     />
                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                  
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

   // Calculate attendance percentage, safely handling division by zero
   const filledPercent = item?.capacity > 0 ? ((item?.rsvps.length / item?.capacity) * 100).toFixed(0) : 0;

   const TabButton = ({ id, label, icon, count }) => (
      <button
         onClick={() => setActiveTab(id)}
         className={`
            px-5 py-3 text-sm font-semibold flex items-center space-x-2 transition-colors duration-150
            ${activeTab === id 
               ? 'text-[var(--brand)] border-b-2 border-[var(--brand)]' 
               : 'text-gray-500 hover:text-gray-700'
            }
         `}
      >
         {icon}
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

   // --- Event Details Tab Content ---
   const EventDetailsTab = () => (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
         <div className="space-y-4 mb-10">
            <div className="flex items-center gap-3 text-gray-700">
               <CalendarDays size={20} className="text-gray-400" />
               <span>{formatToReadableDate(item?.date)}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
               <Clock size={20} className="text-gray-400" />
               <span>{formatToTime(item?.start_time)} - {formatToTime(item?.end_time)}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
               <MapPin size={20} className="text-gray-400" />
               <span>{item?.location}</span>
            </div>
         </div>
         <div className="mb-10">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About the event</h3>
            {item?.description}
         </div>
         <div>
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-lg font-semibold text-gray-900">Event Capacity</h3>
               <span className="text-sm text-gray-500 font-medium">{filledPercent}% filled</span>
            </div>
            
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
               <div className="flex-1 w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div 
                     className="bg-primary-green h-full rounded-full" 
                     style={{ width: `${filledPercent}%` }}
                  ></div>
               </div>
               
               <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4 min-w-[180px] shadow-sm border border-gray-100">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                     <UsersIcon size={20} />
                  </div>
                  <div>
                     <p className="text-xs text-gray-500 font-medium uppercase">RSVPs</p>
                     <p className="text-xl font-bold text-gray-900">{item?._count?.rsvps}/{item?.capacity}</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );

   const renderTabContent = () => {
      switch (activeTab) {
         case 'details':
            return <EventDetailsTab />;
         case 'rsvps':
            return <EventRsvpsTab rsvps={item.rsvps || []} />;
         case 'settings':
            return <EventSettingsTab />;
         default:
            return null;
      }
   };

   // Opened without an event selected (reload or direct link): the effect above
   // sends the user back to the events list; render nothing meanwhile.
   if (!item) {
      return <p className="text-gray-500">Loading event…</p>;
   }

   return (
      <div className="space-y-6">
         <nav className="flex items-center space-x-2 text-sm text-gray-500 font-medium">
            <button onClick={onBack} className="flex items-center hover:text-[var(--brand)] transition">
               <ChevronLeft className="w-4 h-4 mr-0.5" />
               Events
            </button>
            <span>/</span>
            <span className="text-gray-900 font-bold truncate max-w-xs">{item?.title}</span>
         </nav>

         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6">
            <div className="flex flex-wrap items-center space-x-4 mb-4 sm:mb-0">
               <h1 className="text-3xl font-bold text-gray-900">{item?.title}</h1>
               <div className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(item?.date)}`}>
                  {getEventStatus(item?.date)}
               </div>
            </div>
               
            {/* Actions */}
            <div className="flex space-x-3">
               {SHOW_PREVIEW && (
               <button className="flex items-center gap-2 px-4 py-2 bg-[var(--brand)] text-white rounded-lg hover:opacity-90 transition-colors font-medium shadow-sm">
                  <Send className="w-5 h-5 mr-2" />
                  Send Announcement
               </button>
               )}
               <button
                  onClick={() => setIsEditOpen(true)}
                  disabled={!item}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm"
               >
                  <SquarePen className="w-5 h-5 mr-2" />
                  Edit Event
               </button>
            </div>
         </div>
         
         {/* Tabs Navigation */}
         <div className="flex border-b border-gray-200 -mb-px">
            <TabButton id="details" label="Event Details" icon={<Info size={18} />} />
            <TabButton id="rsvps" label="RSVPs" icon={<NotepadText size={18} />} count={item?.attendance} />
            <TabButton id="settings" label="Settings" icon={<Settings2 size={18}/>} />
         </div>

         {/* Tab Content */}
         {item && renderTabContent()}

         <EventAddPage
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            onUpdateEvent={async (data) => { if (await saveEvent(data)) setIsEditOpen(false); }}
            mode="edit"
            event={item}
         />

      </div>
   );
};