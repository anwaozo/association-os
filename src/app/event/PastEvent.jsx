'use client';
import { Fragment, useState, useMemo } from 'react';
import Header from '@/app/components/Header';
import { FaCalendar, FaClock, FaMapPin, FaUsers } from 'react-icons/fa';
import { FaLocationPin } from 'react-icons/fa6';

export default function PastEvent() {

   const upcomingEvents = [
   {
      title: 'Annual Gala Dinner',
      date: 'Oct 15, 2025',
      time: '6:00 - 10:00',
      location: 'Grand Ballroom',
      description: 'Join us for our annual celebration with distinguished guests and members.',
      attendees: '85/100 attending',
      status: 'Upcoming',
      isAttending: true,
   },
   {
      title: 'Networking Breakfast',
      date: 'Oct 23, 2025',
      time: '08:00 - 9:30',
      location: 'Chapter Room',
      description: 'Connect with fellow members over breakfast and coffee.',
      attendees: '24/30 attending',
      status: 'Upcoming',
      isAttending: true,
   },
   // ... other events
   ];

   const rsvpItems = [
      { title: 'Networking Mixer', date: 'Nov 22, 2025', status: 'In Calendar' },
      { title: 'Annual Gala Dinner', date: 'Oct 22, 2025', status: 'Add to calendar' },
   ];

   return (
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
         <div className="flex">
            <div className="flex-grow pr-8">
               <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>
               {upcomingEvents.map((event, index) => (
                  <div className="bg-white p-6 rounded-lg shadow border border-gray-100 flex justify-between items-start">
                     <div className="flex-1">
                        <div className="flex items-center mb-2">
                           <h4 className="text-lg font-semibold text-gray-900 mr-3">{event.title}</h4>
                           <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-800">{event.status}</span>
                        </div>
                        <ul className="text-sm text-gray-600 space-y-1 mt-2">
                           <li className="flex items-center"><FaCalendar className="w-4 h-4 mr-2 text-gray-400"/> {event.date}</li>
                           <li className="flex items-center"><FaClock className="w-4 h-4 mr-2 text-gray-400"/> {event.time}</li>
                           <li className="flex items-center"><FaMapPin className="w-4 h-4 mr-2 text-gray-400"/> {event.location}</li>
                           <li className="flex items-center"><FaUsers className="w-4 h-4 mr-2 text-gray-400"/> {event.attendees}</li>
                        </ul>
                        <p className="text-sm text-gray-700 mt-4">{event.description}</p>
                     </div>
                     <button className="flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                        {event.isAttending ? 'RSVP Now' : 'RSVP Now'}
                     </button>
                  </div>
               ))}
            </div>
         </div>
      </div>
   )
}