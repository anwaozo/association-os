'use client';
import { Fragment, useState, useMemo, useEffect } from 'react';
import Header from '@/app/components/Header';
import { FaCalendar } from 'react-icons/fa';
import UpComingEvent from '@/app/event/UpComingEvent';
import PastEvent from '@/app/event/PastEvent';
import { useApiClient } from "@/lib/apiClient";

export default function UserEvent() {
   const api = useApiClient();
   const [activeTab, setActiveTab] = useState('upcoming');
   const [upcoming, setUpcoming] = useState([]);
   const [past, setPast] = useState([]);
   const [myRSVPs, setMyRSVPs] = useState([]);
   const [loading, setLoading] = useState(true);

   const fetchUserEvents = async () => {
      setLoading(true);
      const res = await api.get("/events/user");
      if (res.data) {
         setUpcoming(res.data.upcomingEvents);
         setPast(res.data.pastEvents);
         setMyRSVPs(res.data.myRsvp);
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchUserEvents();
   }, []);

   const tabDatas = [
      { id: 'upcoming', label: 'Upcoming Events', icon: FaCalendar },
      { id: 'past', label: 'Past Events', icon: FaCalendar },
   ];

   return (
      <Fragment>
         <Header title="Events" subTitle="Browse and RSVP to society events" />

         <div className="flex border-b border-gray-200 -mb-px">
            {tabDatas.map(tab => (
            <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`
                  px-5 py-3 text-sm font-semibold flex items-center space-x-2 transition-colors duration-150
                  ${activeTab === tab.id 
                     ? 'text-[#FF884D] border-b-2 border-[#FF884D]' 
                     : 'text-gray-500 hover:text-gray-700'
                  }
               `}
            >
               <tab.icon /><span>{tab.label}</span>
            </button>
            ))}
         </div>


         <div className="tab-content">
            {activeTab === 'upcoming' && <UpComingEvent upcomingEvents={upcoming} myRSVPs={myRSVPs} refresh={fetchUserEvents} />}
            {activeTab === 'past' && <PastEvent pastEvents={past} refresh={fetchUserEvents} />}
         </div>


      </Fragment>
   )
}