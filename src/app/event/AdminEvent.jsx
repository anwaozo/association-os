'use client';
import { SHOW_PREVIEW } from '@/lib/features';
import { downloadCsv, fileSafe, isoDay } from '@/lib/csv';
import { Fragment, useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/app/components/Header';
import Portal from '@/app/components/Portal';
import StatsCard from '@/app/components/StatsCard';
import { useToast } from "@/app/components/toast/ToastContext";
import EventAddPage from '@/app/event/add/page';
import EventBadge from '@/app/event/EventBadge';
import { useApiClient } from "@/lib/apiClient";
import { useSelectedItem } from "@/store/useSelectedItem";
import { formatToReadableDate, getEventStatus} from '@/app/components/DateTimeFormat';
import { Calendar, Eye, EllipsisIcon, Clock, Plus, MapPin, Pencil, Send, Trash2, Search, File, Users } from 'lucide-react';

export default function AdminEvent() {
   const api = useApiClient();
   const [events, setEvents] = useState([]);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [searchTerm, setSearchTerm] = useState('');
   const [statusFilter, setStatusFilter] = useState('All');
   const { showToast } = useToast();
   const { setItem } = useSelectedItem();
   const [activeMenuId, setActiveMenuId] = useState(0);
   const [modalMode, setModalMode] = useState("add");
   const [selectedEvent, setSelectedEvent] = useState(null);

   const toggleMenu = (id) => {
      setActiveMenuId(activeMenuId === id ? null : id);
   };

   const openEventAddModal = () => {
      setModalMode("add");
      setSelectedEvent(null);
      setIsModalOpen(true);
   };

   const addNewEvent = async (newEvent) => {
      try {
         const res = await api.post("/events", newEvent);
         showToast("Event created successfully!", "success");
         setIsModalOpen(false);
         const list = await api.get("/events");
         setEvents(list.data);
      } catch (err) {
         showToast("Failed to update contact", "error");
      }
   };

   const handleUpdateEvent = async (updatedData) => {
      try {
         await api.put(`/events/${selectedEvent.id}`, updatedData);
         showToast("Event updated successfully!", "success");
         const res = await api.get("/events");
         setEvents(res.data);
         setIsModalOpen(false);
      } catch (err) {
         showToast("Failed to update event", "error");
      }
   };

   useEffect(() => {
      const fetchEvents = async () => {
         const res = await api.get("/events");
         if (res.data) {
            setEvents(res.data);
         }
      };

      fetchEvents();
   }, []);

   const styles = {
      cardShadow: 'shadow-xl border border-gray-100',
      activeMenuItem: 'bg-[#FEE7D7] text-[#FF5A00] border-l-4 border-[#FF5A00]',
      dashboardMainBg: 'bg-gray-50' 
   };

   const stats1 = useMemo(() => {
      if (!events || events.length === 0) {
         return {
            total: 0,
            upcoming: 0,
            totalRSVPs: 0,
            avgAttendance: "N/A",
         };
      }

      const total = events.length;

      const upcoming = events.filter(e => {
         const status = getEventStatus(e.date); // check by DATE!
         return status === "Upcoming";
      }).length;

      const totalRSVPs = events.reduce((sum, e) => sum + (e.rsvps?.length || 0), 0);
      // Fill rate across events that have a capacity
      const capped = events.filter(e => e.capacity > 0);
      const totalCapacity = capped.reduce((sum, e) => sum + e.capacity, 0);
      const cappedRSVPs = capped.reduce((sum, e) => sum + (e.rsvps?.length || 0), 0);

      const avgAttendance =
         totalCapacity > 0
            ? ((cappedRSVPs / totalCapacity) * 100).toFixed(0)
            : "N/A";

      return { total, upcoming, totalRSVPs, avgAttendance };
   }, [events]);

   const stats = [
      { title: "Total Events", value: stats1.total, color: "bg-green-200" },
      { title: "Upcoming Events", value: stats1.upcoming, color: "bg-red-200" },
      { title: "Total RSVPs", value: stats1.totalRSVPs, color: "bg-violet-200" },
      { title: "Avg. Fill Rate", value: stats1.avgAttendance === "N/A" ? "N/A" : stats1.avgAttendance + "%", color: "bg-blue-200" },
   ];

   const statusList = useMemo(() => {
      if (!events) return ["All"];
      const statuses = new Set();
      events.forEach(event => {
         const s = getEventStatus(event.date);
         statuses.add(s);
      });
      return ["All", ...statuses];  // Add "All" always at top
   }, [events]);

   const filteredEvents = events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
      const eventStatus = getEventStatus(event.date);
      const matchesStatus = statusFilter === "All" || eventStatus === statusFilter;
      return matchesSearch && matchesStatus;
   });

   const EventCard = ({ event }) => {
      const isFull = event.attendance / event.capacity >= 1;
      const progressColor = isFull ? 'text-red-600' : 'text-green-600';
      const progressBg = isFull ? 'bg-red-100' : 'bg-green-100';
      
      return (
         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md flex flex-col justify-between relative">
            <div>
               <div className="flex justify-between items-start mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                     <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                     <EventBadge date={event.date} />
                  </div>
                  <div className="relative">
                     <button 
                        type="button"
                        onClick={(e) => {
                           e.preventDefault();
                           e.stopPropagation();
                           toggleMenu(event.id);
                        }}
                        className="text-gray-400 hover:text-gray-700 transition p-1 cursor-pointer"
                     >
                        <EllipsisIcon />
                     </button>
                     {activeMenuId === event.id && (
                        <div 
                           className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-xl  border border-gray-100 z-50 py-1"
                           onClick={(e) => e.stopPropagation()}
                        >
                           <Link
                              href={`/event/${event.slug}`}
                              onClick={() => setItem(event)}
                              className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50"
                           >
                              <Eye size={14} /> View Details
                           </Link>
                           <button 
                              className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                              onClick={() => {
                                 setModalMode("edit");
                                 setSelectedEvent(event);
                                 setIsModalOpen(true);
                                 setActiveMenuId(null);
                              }}
                           >
                              <Pencil size={14} /> Edit Event
                           </button>
                           <button
                              onClick={() => {
                                 downloadCsv(`${fileSafe(event.title)}-rsvps.csv`, [
                                    { header: 'Name', value: (r) => r.user?.name },
                                    { header: 'Email', value: (r) => r.user?.email },
                                    { header: 'RSVP Date', value: (r) => isoDay(r.createdAt) },
                                 ], event.rsvps || []);
                                 setActiveMenuId(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-gray-50 flex items-center gap-3"
                           >
                              <File size={14} /> Export RSVP List
                           </button>
                           {SHOW_PREVIEW && <div className="h-px bg-gray-100 my-1"></div>}
                           {SHOW_PREVIEW && (
                           <button className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-3">
                              <Trash2 size={14} /> Cancel Event
                           </button>
                           )}
                        </div>
                     )}
                  </div>
               </div>

               <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${progressBg} ${progressColor}`}>
                     {event.rsvps.length} / {event.capacity} attending
                  </span>

                  {event.price > 0 && (
                     <span className="inline-flex items-center text-sm font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full mb-3">
                        ${event.price}
                     </span>
                  )}
               </div>
               
               <div className="space-y-2 mt-5 text-sm text-gray-700 mb-4">
                  <p className="flex items-center font-medium">
                     <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                     {formatToReadableDate(event.date)}
                  </p>
                  <p className="flex items-center">
                     <Clock className="w-4 h-4 mr-2 text-gray-500" />
                     {event.start_time} - {event.end_time}
                  </p>
                  <p className="flex items-center">
                     <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                     {event.location}
                  </p>
               </div>
               
               {/* Description */}
               <p className="text-sm text-gray-500 leading-relaxed mb-6">
                  {event.description}
               </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 border-t pt-4">
               <Link href={`/event/${event.slug}`} className="flex-1 flex items-center justify-center px-4 py-2 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition border border-gray-300 text-sm">
                  <Users className="w-4 h-4 mr-1" />
                  View RSVPs
               </Link>
               {SHOW_PREVIEW && (
               <button className="flex-1 flex items-center justify-center px-4 py-2 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition border border-gray-200 text-sm">
                  <Send className="w-4 h-4 mr-1" />
                  Send Announcement
               </button>
               )}
            </div>
         </div>
      );
   };

   return (
      <Fragment>
         <Header title="Events" subTitle="Manage your organization's events and RSVPs" />

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((item, i) => (
            <StatsCard key={i} title={item.title} value={item.value} color={item.color} icon={item.icon} />
            ))}
         </div>

         <div className={`bg-white p-6 rounded-xl ${styles.cardShadow}`}>
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
               <h2 className="text-lg font-semibold text-gray-800">All Events</h2>
               <button 
                  className="flex items-center gap-2 bg-[var(--brand)] hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  onClick={openEventAddModal}
               >
                  <Plus className="w-4 h-4 mr-1" />
                  Create Event
               </button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
               <div className="relative flex-grow w-full md:max-w-3xl">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                     type="text" 
                     placeholder="Search by name..." 
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full pl-10 pr-4 py-2 bg-gray-50 border-gray-300 rounded-md text-sm focus:ring-2 border focus:ring-gray-200 outline-none placeholder-gray-400"
                  />
               </div>
               {/* Filter Dropdown */}
               <div className="w-full sm:w-auto">
                  <select 
                     value={statusFilter}
                     onChange={(e) => setStatusFilter(e.target.value)}
                     className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-orange-500 focus:border-orange-500 bg-white w-full"
                  >
                     {statusList.map((status) => (
                        <option key={status} value={status}>
                           {status}
                        </option>
                     ))}
                  </select>
               </div>
            </div>

            {filteredEvents.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredEvents.map(event => (
                     <EventCard key={event.id} event={event} />
                  ))}
               </div>
            ) : (
               <div className="text-center p-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-lg font-medium text-gray-700">No events match your current filters.</p>
                  <p className="text-sm text-gray-500 mt-1">Try adjusting the search term or status filter.</p>
               </div>
            )}
         </div>
         <EventAddPage 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={addNewEvent}
            onUpdateEvent={handleUpdateEvent}
            mode={modalMode}
            event={selectedEvent}
         />
      </Fragment>
   )
}