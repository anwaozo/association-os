'use client';
import { Fragment } from 'react';
import Link from 'next/link';
import Header from '@/app/components/Header';
import StatsCard from '@/app/components/StatsCard';

export default function AdminDashboard({stats, actions}) {

   return (
      <Fragment>
         <Header title="Good Morning, Admin" subTitle="Welcome back! Here's what's happening in The Friar Society." />

         
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((item, i) => (
            <StatsCard key={i} title={item.title} value={item.value} color={item.color} icon={item.icon} info={item.info} />
            ))}
         </div>

         
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
               <div className="bg-white p-6 rounded-xl border border-gray-200 card-shadow">
                  <div className="flex justify-between items-center mb-4">
                     <h2 className="text-lg font-semibold text-gray-800">Upcoming Events</h2>
                     <Link href="/event" className="text-sm font-medium text-orange-600 hover:underline flex items-center">
                           View All 
                           <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                     </Link>
                  </div>
                  <p className="text-sm text-gray-500 mb-6">Events in the next 30 days</p>

                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                     <div>
                        <p className="font-medium text-gray-800">Annual Gala Dinner</p>
                        <p className="text-xs text-gray-500">Nov 15, 2025</p>
                     </div>
                     <p className="text-sm font-medium text-orange-600">127/150 <span className="text-xs text-gray-500 ml-1">85% full</span></p>
                  </div>

                  {/* Event List Item 2 */}
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                     <div>
                           <p className="font-medium text-gray-800">Networking Mixer</p>
                           <p className="text-xs text-gray-500">Nov 22, 2025</p>
                     </div>
                     <p className="text-sm font-medium text-orange-600">45/75 <span className="text-xs text-gray-500 ml-1">60% full</span></p>
                  </div>

                  {/* Event List Item 3 */}
                  <div className="flex justify-between items-center pt-3">
                     <div>
                           <p className="font-medium text-gray-800">Holiday Charity Drive</p>
                           <p className="text-xs text-gray-500">Dec 10, 2025</p>
                     </div>
                     <p className="text-sm font-medium text-orange-600">32/100 <span className="text-xs text-gray-500 ml-1">32% full</span></p>
                  </div>
               </div>

               <div className="bg-white p-6 rounded-xl border border-gray-200 card-shadow">
                  <div className="flex justify-between items-center mb-6">
                     <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
                     <a href="#" className="text-sm font-medium text-orange-600 hover:underline flex items-center">
                           View All
                           <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                     </a>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Latest updates from your organization</p>

                  {/* Activity List */}
                  <ul className="space-y-4">
                     <li className="flex items-start">
                           <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                           <div>
                              <p className="text-sm text-gray-700">New member joined: <span className="font-medium text-orange-600">Sarah Thompson</span></p>
                              <p className="text-xs text-gray-500">2 hours ago</p>
                           </div>
                     </li>
                     <li className="flex items-start">
                           <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                           <div>
                              <p className="text-sm text-gray-700">Payment received: <span className="font-medium text-green-600">Michael Chen - $100</span></p>
                              <p className="text-xs text-gray-500">9 hours ago</p>
                           </div>
                     </li>
                     <li className="flex items-start">
                           <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                           <div>
                              <p className="text-sm text-gray-700">New event RSVP: <span className="font-medium text-orange-600">Emily Rodriguez for Annual Gala</span></p>
                              <p className="text-xs text-gray-500">1 day ago</p>
                           </div>
                     </li>
                     <li className="flex items-start">
                           <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                           <div>
                              <p className="text-sm text-gray-700">Donation received: <span className="font-medium text-green-600">Anonymous - $500</span></p>
                              <p className="text-xs text-gray-500">2 days ago</p>
                           </div>
                     </li>
                  </ul>
               </div>
            </div>

            {/* Column 2 (Quick Actions & Needs Attention) */}
            <div className="lg:col-span-1 space-y-6">

                  {/* Quick Actions Card */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200 card-shadow">
                     <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
                     <p className="text-sm text-gray-500 mb-6">Common tasks and shortcuts</p>
                     
                     <div className="grid grid-cols-2 gap-4">
                        {/* Action 1: Add Member */}
                        <button className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg text-gray-600 hover:bg-orange-100 hover:text-orange-600 transition border border-gray-200">
                              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                              <span className="text-sm">Add Member</span>
                        </button>
                        {/* Action 2: Create Event */}
                        <button className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg text-gray-600 hover:bg-orange-100 hover:text-orange-600 transition border border-gray-200">
                              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                              <span className="text-sm">Create Event</span>
                        </button>
                        {/* Action 3: Send Message */}
                        <button className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg text-gray-600 hover:bg-orange-100 hover:text-orange-600 transition border border-gray-200">
                              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.605A9.702 9.702 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                              <span className="text-sm">Send Message</span>
                        </button>
                        {/* Action 4: Import Contact */}
                        <button className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg text-gray-600 hover:bg-orange-100 hover:text-orange-600 transition border border-gray-200">
                              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                              <span className="text-sm">Import Contact</span>
                        </button>
                        {/* Action 5: Create Tier */}
                        <button className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg text-gray-600 hover:bg-orange-100 hover:text-orange-600 transition border border-gray-200">
                              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h.01M3 14h.01M3 18h.01M16 16h2a2 2 0 002-2v-4a2 2 0 00-2-2h-4a2 2 0 00-2 2v4a2 2 0 002 2zM3 6h.01M16 6h2a2 2 0 002-2V2a2 2 0 00-2-2h-4a2 2 0 00-2 2v2a2 2 0 002 2zM3 6h.01M16 6h2a2 2 0 002-2V2a2 2 0 00-2-2h-4a2 2 0 00-2 2v2a2 2 0 002 2z"></path></svg>
                              <span className="text-sm">Create Tier</span>
                        </button>
                           {/* Action 6: Create Campaign */}
                        <button className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg text-gray-600 hover:bg-orange-100 hover:text-orange-600 transition border border-gray-200">
                              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-2.485 0-4 1.515-4 4s1.515 4 4 4 4-1.515 4-4-1.515-4-4-4z"></path></svg>
                              <span className="text-sm">Create Campaign</span>
                        </button>
                     </div>
                  </div>

                  {/* Needs Attention Card */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200 card-shadow">
                     <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">Needs Attention</h2>
                        <a href="#" className="text-sm font-medium text-orange-600 hover:underline flex items-center">
                              View All Members
                              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </a>
                     </div>
                     <p className="text-sm text-gray-500 mb-4">Members with outstanding items</p>

                     <div className="space-y-3">
                        {/* Item 1: John Anderson (Past Due - Red) */}
                        <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                              <div>
                                 <p className="font-medium text-red-600">John Anderson</p>
                                 <p className="text-xs text-gray-500">Payment past due</p>
                              </div>
                              <span className="text-xs font-semibold text-red-600">5d</span>
                        </div>
                        
                        {/* Item 2: Sarah Mitchell (Past Due - Red) */}
                        <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                              <div>
                                 <p className="font-medium text-red-600">Sarah Mitchell</p>
                                 <p className="text-xs text-gray-500">Payment past due</p>
                              </div>
                              <span className="text-xs font-semibold text-red-600">3d</span>
                        </div>
                        
                        {/* Item 3: David Chen (Expiring - Yellow) */}
                        <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                              <div>
                                 <p className="font-medium text-yellow-700">David Chen</p>
                                 <p className="text-xs text-gray-500">Membership expiring soon</p>
                              </div>
                              <span className="text-xs font-semibold text-yellow-700">7d</span>
                        </div>
                     </div>
                  </div>

            </div>

         </div>
      </Fragment>
   );
}
