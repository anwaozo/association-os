'use client';
import { Fragment } from 'react';
import Header from '@/app/components/Header';

// --- Reusable Components ---

const MembershipCard = () => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-full">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">My Membership</h3>
    
    {/* Status */}
    <div className="mb-4">
      <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
      <span className="inline-block px-3 py-1 text-sm font-semibold text-green-700 bg-green-100 rounded-full">
        Active
      </span>
    </div>
    
    {/* Tier */}
    <div className="mb-4">
      <p className="text-sm font-medium text-gray-500 mb-1">Tier</p>
      <p className="text-gray-900 font-medium">Student Member</p>
    </div>

    {/* Details List */}
    <div className="space-y-3 pt-2 border-t border-gray-100">
      <div className="flex items-center text-gray-700">
        <span className="mr-2">📅</span>
        <p className="text-sm">Member since Jan 2024</p>
      </div>
      <div className="flex items-center text-gray-700">
        <span className="mr-2">🗓️</span>
        <p className="text-sm">Next billing: Nov 1, 2025</p>
      </div>
    </div>
  </div>
);

const RsvpItem = ({ title, date, actionText, actionColor, isAdded = false }) => (
  <div className="flex justify-between items-center py-4 border-b border-gray-100 last:border-b-0">
    <div>
      <h4 className="text-gray-900 font-medium">{title}</h4>
      <p className="text-sm text-gray-500">{date}</p>
    </div>
    {isAdded ? (
      <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
        🟢 In Calendar
      </span>
    ) : (
      <button className={`text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors`}>
        {actionText}
      </button>
    )}
  </div>
);

const AnnouncementItem = ({ title, content, postDate }) => (
  <div className="py-4 border-b border-gray-200 last:border-b-0">
    <h4 className="text-xl font-semibold text-gray-900 mb-1">{title}</h4>
    <p className="text-gray-700 mb-2">{content}</p>
    <p className="text-xs text-gray-500">Posted {postDate}</p>
  </div>
);


// --- Main Dashboard Page ---

export default function UserDashboard() {
   return (
      <Fragment>
         <Header title="Good Morning, John" subTitle="Here's what's happening with your membership." />

         {/* 2. Dashboard Content Grid */}
         <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
               
               {/* A. My Membership Card */}
               <div className="col-span-1">
                  <MembershipCard />
               </div>
               
               {/* B. My RSVPs Card */}
               <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">My RSVPs</h3>
                  <a href="/events" className="flex items-center text-sm font-medium text-orange-600 hover:text-orange-700">
                     View All 
                     <span className="ml-1">→</span>
                  </a>
                  </div>
                  
                  <div className="divide-y divide-gray-100">
                  <RsvpItem 
                     title="Networking Mixer" 
                     date="Nov 22, 2025" 
                     actionText="In Calendar" 
                     isAdded={true}
                  />
                  <RsvpItem 
                     title="Annual Gala Dinner" 
                     date="Oct 22, 2025" 
                     actionText="Add to calendar"
                     isAdded={false}
                  />
                  {/* More RSVP items... */}
                  </div>
               </div>
            </div>

            {/* 3. News & Announcements Section */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
               <h2 className="text-2xl font-bold text-gray-900 mb-6">News & Announcements</h2>
               
               <div className="divide-y divide-gray-100">
                  <AnnouncementItem
                  title="Welcome New Members!"
                  content="We're excited to welcome 15 new members to our community this month. Join us at the welcome reception on Oct 12."
                  postDate="2 days ago"
                  />
                  <AnnouncementItem
                  title="Annual Dues Reminder"
                  content="Your annual membership dues will be processed on November 1st. Update your payment method if needed."
                  postDate="1 week ago"
                  />
                  <AnnouncementItem
                  title="Community Service Success"
                  content="Thank you to everyone who participated in last month's community service day. Together we made a real impact!"
                  postDate="2 weeks ago"
                  />
               </div>
            </div>
         
         </div>
      </Fragment>
   );
}