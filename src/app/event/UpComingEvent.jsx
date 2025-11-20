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
      console.log(id);
      const res = await api.post("/events/rsvp", {event_id: id});
      if (res.data) {
         showToast("RSVP's Added Successfully!", "success");
         refresh();
      }
   };

   const CancelRSVP = async (rsvpId) => {
      const confirmDelete = confirm("Are you sure you want to cancel RSVP?");
      if (!confirmDelete) return;

      const res = await api.delete(`/events/rsvp/${rsvpId}`, {
         method: "DELETE",
      });

      if (res.data) {
         showToast("RSVP Cancelled!", "success");
      } else {
         const data = await res.json();
         alert("Error: " + data.message);
      }
      refresh();
   };

   return (
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
         <div className="flex">
            <div className="flex-grow pr-8 space-y-6">
               <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>
               {upcomingEvents.map(event => (
                  <div key={event.title} className="bg-white p-6 rounded-lg shadow border border-gray-100 flex justify-between items-start">
                     <div className="flex-1">
                        <div className="flex items-center mb-2">
                           <h4 className="text-lg font-semibold text-gray-900 mr-3">{event.title}</h4>
                           <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-800">{getEventStatus(event.date)}</span>
                        </div>
                        <ul className="text-sm text-gray-600 space-y-1 mt-2">
                           <li className="flex items-center"><FaCalendar className="w-4 h-4 mr-2 text-gray-400"/> {formatToReadableDate(event.date)}</li>
                           <li className="flex items-center"><FaClock className="w-4 h-4 mr-2 text-gray-400"/> {formatToTime(event.start_time)} - {formatToTime(event.end_time)}</li>
                           <li className="flex items-center"><FaMapPin className="w-4 h-4 mr-2 text-gray-400"/> {event.location}</li>
                           <li className="flex items-center"><FaUsers className="w-4 h-4 mr-2 text-gray-400"/> {event.rsvps.length} / {event.capacity} attending</li>
                        </ul>
                        <p className="text-sm text-gray-700 mt-4">{event.description}</p>
                     </div>
                     <button 
                        className={`flex-shrink-0 px-4 py-1 text-sm font-medium rounded-md border cursor-pointer
                           ${event.isAttending 
                              ? "bg-gray-200 text-gray-500" 
                              : "bg-white text-black "
                           }`}
                        onClick={() => {
                           if (!event.isAttending) {
                              RSVPNow(event.id);
                           } else {
                              CancelRSVP(event.id);
                           }
                        }}
                     >
                        {event.isAttending === false ? 'RSVP Now' : (event.isAttending === true ? 'Cancel RSVP': 'RSVP Now')}
                     </button>
                  </div>
               ))}
            </div>
            <div className="w-80 border-l border-gray-200 pl-8">
               <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">My RSVPs</h3>
                  <div className="space-y-4">
                     {myRSVPs.map(item => (
                        <div key={item.event.title} className="bg-white p-4 rounded-lg border border-gray-200">
                           <h4 className="text-sm font-medium text-gray-900">{item.event.title}</h4>
                           <p className="text-xs text-gray-500 mb-2">{formatToReadableDate(item.date)}</p>
                           <button className={`w-full text-xs py-1 rounded ${
                              item.status === 'In Calendar' 
                                 ? 'bg-green-50 text-green-700' 
                                 : 'text-indigo-600 border border-indigo-200 hover:bg-indigo-50'
                           }`}>
                              {item.status}
                           </button>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}