'use client';
import { Fragment, useState, useMemo } from 'react';
import Header from '@/app/components/Header';
import { formatToReadableDate, formatToTime, getEventStatus} from '@/app/components/DateTimeFormat';
import { FaCalendar, FaClock, FaMapPin, FaUsers } from 'react-icons/fa';
import { FaLocationPin } from 'react-icons/fa6';
import { useApiClient } from "@/lib/apiClient";
import { useToast } from "@/app/components/toast/ToastContext";

export default function UpComingEvent({upcomingEvents, myRSVPs, refresh}) {
   const api = useApiClient();
   const { showToast } = useToast();

   const RSVPNow = async (id) => {
      try {
         await api.post("/events/rsvp", {event_id: id});
         showToast("You're on the list!", "success");
         refresh();
      } catch {
         // Error toast shown by the API client
      }
   };

   const CancelRSVP = async (rsvpId) => {
      const confirmDelete = confirm("Are you sure you want to cancel RSVP?");
      if (!confirmDelete) return;

      try {
         await api.delete(`/events/rsvp/${rsvpId}`);
         showToast("RSVP cancelled", "success");
      } catch {
         // Error toast shown by the API client
      }
      refresh();
   };

   return (
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
         <div className="flex">
            <div className="flex-grow pr-8 space-y-6">
               <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>
               {upcomingEvents.length === 0 && <p className="text-gray-500">No upcoming events right now.</p>}
               {upcomingEvents.map(event => (
                  <div key={event.id} className="bg-white p-6 rounded-lg shadow border border-gray-100 flex justify-between items-start">
                     <div className="flex-1">
                        <div className="flex items-center mb-2">
                           <h4 className="text-lg font-semibold text-gray-900 mr-3">{event.title}</h4>
                           <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-800">{getEventStatus(event.date)}</span>
                        </div>
                        <ul className="text-sm text-gray-600 space-y-1 mt-2">
                           <li className="flex items-center"><FaCalendar className="w-4 h-4 mr-2 text-gray-400"/> {formatToReadableDate(event.date)}</li>
                           <li className="flex items-center"><FaClock className="w-4 h-4 mr-2 text-gray-400"/> {formatToTime(event.start_time)} - {formatToTime(event.end_time)}</li>
                           <li className="flex items-center"><FaMapPin className="w-4 h-4 mr-2 text-gray-400"/> {event.location}</li>
                           <li className="flex items-center"><FaUsers className="w-4 h-4 mr-2 text-gray-400"/> {event._count?.rsvps ?? event.rsvps.length}{event.capacity ? ` / ${event.capacity}` : ''} attending</li>
                        </ul>
                        <p className="text-sm text-gray-700 mt-4">{event.description}</p>
                     </div>
                     {event.isRSVP === false && !event.isAttending ? (
                        <span className="flex-shrink-0 px-4 py-1 text-sm text-gray-500">No RSVP needed</span>
                     ) : (!event.isAttending && event.capacity && (event._count?.rsvps ?? 0) >= event.capacity) ? (
                        <span className="flex-shrink-0 px-4 py-1 text-sm font-medium text-red-600">Full</span>
                     ) : (
                     <button
                        className={`flex-shrink-0 px-4 py-1 text-sm font-medium rounded-md border cursor-pointer
                           ${event.isAttending
                              ? "bg-gray-200 text-gray-500"
                              : "bg-[var(--brand)] text-white border-transparent hover:opacity-90"
                           }`}
                        onClick={() => {
                           if (!event.isAttending) {
                              RSVPNow(event.id);
                           } else {
                              CancelRSVP(event.id);
                           }
                        }}
                     >
                        {event.isAttending ? 'Cancel RSVP' : 'RSVP Now'}
                     </button>
                     )}
                  </div>
               ))}
            </div>
            <div className="w-80 border-l border-gray-200 pl-8">
               <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">My RSVPs</h3>
                  <div className="space-y-4">
                     {myRSVPs.length === 0 && <p className="text-sm text-gray-500">You haven&apos;t RSVP&apos;d to anything yet.</p>}
                     {myRSVPs.map(item => (
                        <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200">
                           <h4 className="text-sm font-medium text-gray-900">{item.event?.title}</h4>
                           <p className="text-xs text-gray-500 mb-2">{formatToReadableDate(item.event?.date)}</p>
                           <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${
                              getEventStatus(item.event?.date) === 'Completed'
                                 ? 'bg-gray-100 text-gray-600'
                                 : 'bg-green-50 text-green-700'
                           }`}>
                              {getEventStatus(item.event?.date) === 'Completed' ? 'Attended' : 'Going'}
                           </span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}