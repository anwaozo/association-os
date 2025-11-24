'use client';
import { Fragment } from 'react';
import Link from 'next/link';
import Header from '@/app/components/Header';
import StatsCard from '@/app/components/StatsCard';
import { UserPlus, Calendar, Mail, Upload, Layers, DollarSign, ArrowRight, UserCheck, UserX,  TrendingUp } from 'lucide-react';


export default function AdminDashboard() {

   const stats = [
      { title: 'Active Members', value: 312, color: 'green', icon: <UserCheck size={16}/>, 'info': '93% of total' },
      { title: 'Past Due', value: 28, color: 'red', icon: <UserX size={16} />, 'info': '7% of total' },
      { title: 'Upcomming Events', value: 8, color: 'violet', icon: <Calendar size={16} />, 'info': 'Next 30 days' },
      { title: 'Funds Raised YTD', value: 15, color: 'blue', icon: <TrendingUp size={16} />, 'info': '85% of goal' },
   ];
   
   const actions = [
      {title: 'Add Member', icon: <UserPlus />},
      {title: 'Create Event', icon: <Calendar />},
      {title: 'Send Message', icon: <Mail />},
      {title: 'Import Contact', icon: <Upload />},
      {title: 'Create Tier', icon: <Layers />},
      {title: 'Create Campaign', icon: <DollarSign />},
   ];

   const upcomingEvents = [
      {
         name:"Annual Gala Dinner",
         date:"Nov 15, 2025",
         count:"127/150", 
         percent:"85% full"
      },
      {
         name:"Networking Mixer",
         date:"Nov 22, 2025",
         count:"45/75", 
         percent:"60% full"
      },
      {
         name:"Holiday Charity Drive",
         date:"Dec 10, 2025",
         count:"32/100", 
         percent:"32% full"
      }
   ];

   const activityItems = [
      {
         title:"New member joined: Sarah Thompson",
         time:"2 hours ago" 
      },
      {
         title:"Payment received: Michael Chen - $100",
         time:"5 hours ago" 
      },
      {
         title:"New event RSVP: Emily Rodriguez for Annual Gala",
         time:"1 day ago" 
      },
      {
         title:"Donation received: Anonymous - $500",
         time:"2 days ago" 
      }
   ];

   const attentionCards = [
      { name:"John Anderson", issue:"Payment past due", badge:"5d"},
      { name:"Sarah Mitchell", issue:"Payment past due", badge:"3d"},
      { name:"David Chen", issue:"Membership expiring soon", badge:"7d"}
   ];

   return (
      <div className="relative z-10">
         <Header title="Good Morning, Admin" subTitle="Welcome back! Here's what's happening in The Friar Society." />

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map(item => (
            <StatsCard key={item.title} title={item.title} value={item.value} color={item.color} icon={item.icon} info={item.info} />
            ))}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            
            {/* Upcoming Events List (Takes up 2 columns) */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
               <div>
                  <h3 className="font-semibold text-lg">Upcoming Events</h3>
                  <p className="text-slate-500 text-sm">Events in the next 30 days</p>
               </div>
               <button className="text-sm font-medium text-slate-600 flex items-center gap-1 hover:text-slate-900">
                  View All <ArrowRight size={16} />
               </button>
            </div>

            <div className="space-y-4">
               {upcomingEvents.map(upcomingEvent => 
                  <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                     <div>
                     <h4 className="font-medium text-slate-900">{upcomingEvent.name}</h4>
                     <p className="text-slate-500 text-sm">{upcomingEvent.date}</p>
                     </div>
                     <div className="bg-gray-100 px-3 py-1 rounded-md text-right">
                     <span className="block text-sm font-semibold text-slate-800">{upcomingEvent.count}</span>
                     <span className="block text-xs text-slate-500">{upcomingEvent.percent}</span>
                     </div>
                  </div>
               )}
            </div>
            </div>

            {/* Quick Actions Grid (Takes up 1 column) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="mb-6">
               <h3 className="font-semibold text-lg">Quick Actions</h3>
               <p className="text-slate-500 text-sm">Common tasks and shortcuts</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
               {actions.map(action => 
                  <button key={action.title} className="flex flex-col items-center justify-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all gap-2 group">
                  <div className="text-slate-500 group-hover:text-slate-900 transition-colors">
                  {action.icon}
                  </div>
                  <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900">{action.title}</span>
               </button>
               )}
            </div>
            </div>
         </div>

         <div className="w-full min-w-0">
         <div className="grid grid-cols-2 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
               <div className="flex justify-between items-center mb-6">
                  <div>
                  <h3 className="font-semibold text-lg">Recent Activity</h3>
                  <p className="text-slate-500 text-sm">Latest updates from your organization</p>
                  </div>
                  <button className="text-sm font-medium text-slate-600 flex items-center gap-1 hover:text-slate-900">
                  View All <ArrowRight size={16} />
                  </button>
               </div>

               <div className="space-y-6">
                  {activityItems.map((item) => (
                  <div key={item.title} className="flex gap-4">
                     <div className="mt-1.5">
                        <div className="w-2 h-2 bg-slate-800 rounded-full"></div>
                     </div>
                     <div>
                        <p className="text-sm text-slate-800 font-medium">{item.title}</p>
                        <p className="text-xs text-slate-400 mt-1">{item.time}</p>
                     </div>
                  </div>
                  ))}
               </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
               <div className="flex justify-between items-center mb-6">
                  <div>
                  <h3 className="font-semibold text-lg">Needs Attention</h3>
                  <p className="text-slate-500 text-sm">Members with outstanding items</p>
                  </div>
                  <button className="text-sm font-medium text-slate-600 flex items-center gap-1 hover:text-slate-900">
                  View All Members <ArrowRight size={16} />
                  </button>
               </div>

               <div className="space-y-3">
                  {attentionCards.map((card) => (
                  <div key={card.name} className="flex items-center justify-between p-4 bg-orange-50 border border-orange-100 rounded-lg">
                     <div>
                        <h4 className="font-medium text-slate-900 text-sm">{card.name}</h4>
                        <p className="text-slate-500 text-xs">{card.issue}</p>
                     </div>
                     <div className="bg-white px-2 py-1 rounded border border-orange-100 text-xs font-medium text-slate-600 shadow-sm">
                        {card.badge}
                     </div>
                  </div>
                  ))}
               </div>
            </div>
         </div>
         </div>
      </div>
   );
}
