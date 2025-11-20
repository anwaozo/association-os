'use client';
import Link from 'next/link';
import { Fragment, useState, useEffect } from 'react';
import { formatToReadableDate } from '@/app/components/DateTimeFormat';
import Header from '@/app/components/Header';
import { FaArrowRight, FaCalendar, FaCreditCard } from 'react-icons/fa';
import { useApiClient } from "@/lib/apiClient";
import { FaCircleCheck } from 'react-icons/fa6';
import Currency from '@/app/components/Currency';

const AnnouncementItem = ({ title, content, postDate }) => (
  <div className="py-4 border-b border-gray-200 last:border-b-0">
    <h4 className="text-xl font-semibold text-gray-900 mb-1">{title}</h4>
    <p className="text-gray-700 mb-2">{content}</p>
    <p className="text-xs text-gray-500">Posted {postDate}</p>
  </div>
);


// --- Main Dashboard Page ---

export default function UserDashboard() {
   const api = useApiClient();
   const [dashboard, setDashboard] = useState([]);
   const [loading, setLoading] = useState(true);
   const [showMembershipModal, setShowMembershipModal] = useState(false);

   const fetchDashboard = async () => {
      setLoading(true);
      const res = await api.get("/users");
      if (res.data) {
         setDashboard(res.data);
         setLoading(false);
      }
   };

   const updateMembership = async (membershipId) => {
      setLoading(true);
      const res = await api.post("/users/update_membership", {membershipId: membershipId});
      if (res.data) {
         fetchDashboard();
         setShowMembershipModal(false)
         setLoading(false);
      }
   }

   useEffect(() => {
      /*updateMembership();*/
      fetchDashboard();
   }, []);

   return (
      <Fragment>
         <Header title="Good Morning, John" subTitle="Here's what's happening with your membership." />

         {/* 2. Dashboard Content Grid */}
         <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
               
               <div className="col-span-1">
                  <div className="bg-[#fbf4eb] p-6 rounded-xl border border-[#efebe6] shadow-sm lg:col-span-1 flex flex-col justify-between">
                     <div>
                        <h3 className="font-medium text-slate-800 mb-6">My Membership</h3>
                        {dashboard?.membership ? (
                           <Fragment>
                           <div className="space-y-6">
                              <div>
                                 <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Status</p>
                                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#dcfce7] text-[#166534]">
                                    Active
                                 </span>
                              </div>
                              <div>
                                 <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Tier</p>
                                 <p className="text-lg font-medium text-slate-900">{ dashboard.membership.name }</p>
                              </div>
                           </div>

                           <div className="mt-2 pt-6 border-t border-slate-200/50 space-y-3">
                              <div className="flex items-center gap-3 text-sm text-slate-600">
                                 <FaCalendar size={16} className="text-slate-400" />
                                 <span>Member since {formatToReadableDate(dashboard?.membershipHistory?.startDate)}</span>
                              </div>
                              <div className="flex items-center gap-3 text-sm text-slate-600">
                                 <FaCreditCard size={16} className="text-slate-400" />
                                 <span>Next billing: {formatToReadableDate(dashboard?.membershipHistory?.endDate)}</span>
                              </div>
                           </div>
                           <button
                              onClick={() => setShowMembershipModal(true)}
                              className="mt-6 w-full px-4 py-2 bg-slate-900 text-white text-sm rounded-lg hover:bg-slate-700 transition"
                           >
                              Change Membership
                           </button>
                           </Fragment> 
                        ) : ( 
                           <Fragment>
                              <p className="text-gray-500 mb-4">You do not have a membership yet.</p>
                              <button
                                 onClick={() => setShowMembershipModal(true)}
                                 className="w-full px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-500 transition"
                              >
                                 Add Membership
                              </button>
                           </Fragment>
                        ) }
                     </div>
                  </div>
               </div>
               
               <div className="bg-white rounded-xl border border-gray-100 shadow-sm lg:col-span-2 p-6">
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="font-medium text-slate-800">My RSVPs</h3>
                     <Link href="/event" className="text-sm text-slate-500 flex items-center hover:text-slate-800 transition-colors">
                        View All <FaArrowRight size={14} className="ml-1" />
                     </Link>
                  </div>

                  <div className="space-y-4">
                     {dashboard?.rsvps?.length > 0 ? (
                     dashboard.rsvps.map(rsvp => 
                     <div key={rsvp?.event?.title} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors">
                        <div className="mb-2 sm:mb-0">
                           <h4 className="font-medium text-slate-900">{rsvp?.event?.title}</h4>
                           <p className="text-sm text-slate-500 mt-0.5">{formatToReadableDate(rsvp?.createdAt)}</p>
                        </div>
                        <div className="flex items-center text-xs font-medium text-[#166534] bg-[#dcfce7] px-3 py-1.5 rounded-full">
                           <FaCircleCheck size={14} className="mr-1.5" /> In Calendar
                        </div>
                     </div>
                     )) : (
                        <p className="px-6 py-10 text-center text-gray-500"> No match your current filters.</p>
                     )}
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm lg:col-span-3 p-6">
              <h3 className="font-medium text-slate-800 mb-6">News & Announcements</h3>
               <div className="space-y-8">
                  <AnnouncementItem 
                     title="Welcome New Members!" 
                     content="We're excited to welcome 15 new members to our community this month. Join us at the welcome reception on Oct 12." 
                     date="Posted 2 days ago" 
                  />
                  <AnnouncementItem 
                     title="Annual Dues Reminder" 
                     content="Your annual membership dues will be processed on November 1st. Update your payment method if needed." 
                     date="Posted 1 week ago" 
                  />
                  <AnnouncementItem 
                     title="Community Service Success" 
                     content="Thank you to everyone who participated in last month's community service day. Together we made a real impact!" 
                     date="Posted 2 weeks ago" 
                  />
               </div>
            </div>
         </div>

         {showMembershipModal && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
               <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Select a Membership
                  </h3>

                  {dashboard?.memberships.map((m) => {
                     const isActive = dashboard?.membership?.id === m.id;

                     return (
                        <button
                           key={m.id}
                           disabled={isActive}
                           onClick={() => updateMembership(m.id)}
                           className={`
                              w-full text-left px-4 py-4 border rounded-xl transition
                              ${isActive 
                                 ? "bg-green-50 border-green-300 text-green-700 cursor-not-allowed"
                                 : "hover:bg-slate-50 border-slate-200"
                              }
                           `}
                        >
                           <p className="font-medium text-slate-800">{m.name}</p>
                           <p className="text-sm text-slate-500 capitalize">
                              {m.billing_cadence == 1 ? 'Monthly': 'Annual'} — <Currency amount={m.price} />
                           </p>
                        </button>
                     );
                  })}

                  <button
                     onClick={() => setShowMembershipModal(false)}
                     className="mt-4 w-full px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300"
                  >
                  Close
                  </button>
               </div>
            </div>
         )}

      </Fragment>
   );
}