'use client';
import { FaCalendar } from 'react-icons/fa';
import { formatToReadableDate } from '@/app/components/DateTimeFormat';

export default function PastEvent({pastEvents}) {

   return (
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
         <div className="flex">
            <div className="flex-grow pr-8">
               <h3 className="text-xl font-semibold mb-4">Past Events</h3>
               {pastEvents.map(event => (
                  <div className="bg-white p-6 rounded-lg shadow border border-gray-100 flex justify-between items-start">
                     <div className="flex-1">
                        <div className="flex items-center mb-2">
                           <h4 className="text-lg font-semibold text-gray-900 mr-3">{event.title}</h4>
                           <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-black-800">Ended</span>
                        </div>
                        <ul className="text-sm text-gray-600 space-y-1 mt-2">
                           <li className="flex items-center"><FaCalendar className="w-4 h-4 mr-2 text-gray-400"/> {formatToReadableDate(event.date)}</li>
                        </ul>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   )
}