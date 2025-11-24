'use client';
import { Fragment, useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/app/components/Header';
import StatsCard from '@/app/components/StatsCard';
import { useToast } from "@/app/components/toast/ToastContext";
import EventAddPage from '@/app/event/add/page';
import EventBadge from '@/app/event/EventBadge';
import { useApiClient } from "@/lib/apiClient";
import { useSelectedItem } from "@/store/useSelectedItem";
import { formatToReadableDate, formatToTime, getEventStatus} from '@/app/components/DateTimeFormat';

import { FaPlus, FaCalendar, FaSearch, FaEllipsisH, FaClock, FaList, FaShare } from 'react-icons/fa';
import { FaLocationPin } from 'react-icons/fa6';
import { 
  Calendar,
  EllipsisIcon,
  Clock,
  Plus,
  MapPin,
  MoreVertical,
  Mail,
  Phone,
  Pencil,
  Send,
  Trash2,
  Search,
  Info,
  Users
} from 'lucide-react';

export default function AdminEvent() {
   const api = useApiClient();
   const [events, setEvents] = useState([]);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [searchTerm, setSearchTerm] = useState('');
   const [statusFilter, setStatusFilter] = useState('All');
   const { showToast } = useToast();
   const { setItem } = useSelectedItem();

   const addNewEvent = async (newEvent) => {
      try {
         const res = await api.post("/events", newEvent);
         showToast("Event created successfully!", "success");
         setIsModalOpen(false);
         const list = await api.get("/events");
         setEvents(list.data);
      } catch (err) {
         // Error already handled globally
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

   const eventLists = [
      {
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
         rsvps: 127,
      },
      {
         id: 2,
         name: "Networking Breakfast",
         slug: "networking-breakfast",
         date: "Oct 22, 2025",
         time: "08:00 - 12:00",
         location: "Chapter Room",
         description: "Connect with fellow members over breakfast and coffee.",
         status: "Upcoming",
         attendance: 24,
         capacity: 30,
         cost: 0,
         rsvps: 45,
      },
      {
         id: 3,
         name: "Community Service Day",
         slug: "community-service-day",
         date: "Nov 5, 2025",
         time: "10:00 - 2:00",
         location: "Local Community Center",
         description: "Give back to the community alongside your fellow Friars.",
         status: "Upcoming",
         attendance: 42,
         capacity: 50,
         cost: 0,
         rsvps: 32,
      },
      {
         id: 4,
         name: "Leadership Workshop",
         slug: "leadership-workshop",
         date: "Nov 12, 2025",
         time: "2:00 - 4:00",
         location: "Conference Room A",
         description: "Develop your leadership skills with industry experts.",
         status: "Ongoing",
         attendance: 18,
         capacity: 25,
         cost: 25,
         rsvps: 18,
      },
   ];

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

      const totalRSVPs = events.reduce((sum, e) => sum + (e.rsvps.length || 0), 0);
      const totalCapacity = events.reduce((sum, e) => sum + (e.capacity || 0), 0);
      const totalAttendance = events.reduce((sum, e) => sum + (e.attendance || 0), 0);

      const avgAttendance =
         totalCapacity > 0
            ? ((totalAttendance / totalCapacity) * 100).toFixed(0)
            : "N/A";

      return { total, upcoming, totalRSVPs, avgAttendance };
   }, [events]);

   const stats = [
      { title: "Total Events", value: stats1.total, color: "bg-green-200" },
      { title: "Upcoming Events", value: stats1.upcoming, color: "bg-red-200" },
      { title: "Total RSVPs", value: stats1.totalRSVPs, color: "bg-violet-200" },
      { title: "Avg. Attendance", value: stats1.avgAttendance + "%", color: "bg-blue-200" },
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
         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md flex flex-col justify-between">
            <div>
               <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                     <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                     <EventBadge date={event.date} />
                  </div>
                  <button className="text-gray-400 hover:text-gray-700 transition p-1">
                     <Link
                        href={`event/${event.slug}`}
                        onClick={() => setItem(event)}
                        >
                        <EllipsisIcon />
                     </Link>
                  </button>
               </div>

               <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${progressBg} ${progressColor}`}>
                  {event.rsvps.length} / {event.capacity} attending
               </span>

               {event.price > 0 && (
                  <span className="inline-flex items-center text-sm font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full mb-3">
                     ${event.price}
                  </span>
               )}
               
               <div className="space-y-2 mt-5 text-sm text-gray-700 mb-4">
                  <p className="flex items-center font-medium">
                     <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                     {formatToReadableDate(event.date)}
                  </p>
                  <p className="flex items-center">
                     <Clock className="w-4 h-4 mr-2 text-gray-500" />
                     {formatToTime(event.start_time)} - {formatToTime(event.end_time)}
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

            {/* Actions */}
            <div className="flex space-x-3 border-t pt-4">
               <button className="flex-1 flex items-center justify-center px-4 py-2 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition border border-gray-300 text-sm">
                  <Users className="w-4 h-4 mr-1" />
                  View RSVPs
               </button>
               <button className="flex-1 flex items-center justify-center px-4 py-2 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition border border-gray-200 text-sm">
                  <Send className="w-4 h-4 mr-1" />
                  Send Announcement
               </button>
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
                  className="flex items-center gap-2 bg-[#FF7A2C] hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  onClick={setIsModalOpen.bind(null, true)}
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
         />
      </Fragment>
   )
}