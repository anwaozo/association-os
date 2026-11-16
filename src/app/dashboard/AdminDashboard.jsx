'use client';
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Header from '@/app/components/Header';
import StatsCard from '@/app/components/StatsCard';
import { useApiClient } from "@/lib/apiClient";
import { importInChunks } from '@/lib/importInChunks';
import ContactAddPage from '@/app/contact/add/page';
import ContactImportPage from '@/app/contact/import/page';
import EventAddPage from '@/app/event/add/page';
import MembershipAddPage from '@/app/membership/add/page';
import CampaignAddPage from '@/app/campaign/add/page';
import { useToast } from "@/app/components/toast/ToastContext";
import { UserPlus, Calendar, Mail, Upload, Layers, DollarSign, ArrowRight, UserCheck, UserX,  TrendingUp } from 'lucide-react';
import { formatToReadableDate, formatToTime, getEventStatus} from '@/app/components/DateTimeFormat';
import { useAuth } from '@/context/AuthContext';
import { greeting, timeAgo, daysUntil } from '@/lib/time';

export default function AdminDashboard() {
   const api = useApiClient();
   const router = useRouter();
   const { showToast } = useToast();
   const { state } = useAuth();
   const [dashboard, setDashboard] = useState({});
   const [isContactModalOpen, setIsContactModalOpen] = useState(false);
   const [isContactImportModalOpen, setIsContactImportModalOpen] = useState(false);
   const [isEventModalOpen, setIsEventModalOpen] = useState(false);
   const [isTierModalOpen, setIsTierModalOpen] = useState(false);
   const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);

   useEffect(() => {
      fetchDashboard();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const fetchDashboard = async () => {
      const res = await api.get("/dashboard");
      if (res.data) {
         setDashboard(res.data);
      }
   };

   const openContactAddModal = () => setIsContactModalOpen(true);

   const handleAddContact = async (contactData) => {
      const newContact = {
         name: `${contactData.firstName} ${contactData.lastName}`,
         email: contactData.email,
         phone: contactData.phone,
         role: contactData.status
      };

      try {
         await api.post("/auth/register", newContact);
         showToast(`Contact ${newContact.name} added successfully!`);
         setIsContactModalOpen(false);
         fetchDashboard();
      } catch (err) {
         // Error toast shown by the API client
      }
   };

   const openContactImportModal = () => setIsContactImportModalOpen(true);

   const handleBulkImport = async (newContacts) => {
      const formattedNewContacts = newContacts.map(c => ({
         name: `${c.firstName} ${c.lastName}`.trim(),
         email: c.email,
         phone: c.phone,
         role: c.status
      }));

      try {
         const imported = await importInChunks(api, formattedNewContacts);
         showToast(`${imported} contacts imported successfully!`);
         setIsContactImportModalOpen(false);
         fetchDashboard();
      } catch (err) {
         // Error toast shown by the API client
      }
   };

   const openEventAddModal = () => setIsEventModalOpen(true);

   const addNewEvent = async (newEvent) => {
      try {
         await api.post("/events", newEvent);
         showToast("Event created successfully!", "success");
         setIsEventModalOpen(false);
         fetchDashboard();
      } catch (err) {
         // Error already handled globally
      }
   };

   const openTierAddModal = () => setIsTierModalOpen(true);

   const addNewMembership = async (newMembership) => {
      try {
         const res = await api.post("/memberships", newMembership);
         showToast("Membership created successfully!", "success");
         setIsTierModalOpen(false);
      } catch (err) {
      }
   };

   const openCampaignAddModal = () => setIsCampaignModalOpen(true);

   const addNewCampaign = async (newCampaign) => {
      try {
         await api.post("/campaign", newCampaign);
         showToast(`Campaign added successfully!`);
         setIsCampaignModalOpen(false);
         fetchDashboard();
      } catch (err) {
      }
   };

   const stats = [
      { title: 'Active Members', value: dashboard?.members_count ?? 0, color: 'green', icon: <UserCheck size={16}/>, info: `${dashboard?.contacts_count ?? 0} contacts` },
      { title: 'Renewals Due', value: dashboard?.expiring_count ?? 0, color: 'red', icon: <UserX size={16} />, info: 'Next 30 days' },
      { title: 'Upcoming Events', value: dashboard?.upcoming_count ?? 0, color: 'violet', icon: <Calendar size={16} />, info: 'Scheduled' },
      { title: 'Active Campaigns', value: dashboard?.campaigns_count ?? 0, color: 'blue', icon: <TrendingUp size={16} />, info: `$${Number(dashboard?.campaign_goal_total || 0).toLocaleString()} in goals` },
   ];

   const actions = [
      {title: 'Add Member', icon: <UserPlus />, click: openContactAddModal},
      {title: 'Create Event', icon: <Calendar />, click: openEventAddModal},
      {title: 'Import Contacts', icon: <Upload />, click: openContactImportModal},
      {title: 'Create Tier', icon: <Layers />, click: openTierAddModal},
      {title: 'Create Campaign', icon: <DollarSign />, click: openCampaignAddModal},
      {title: 'View Members', icon: <UserCheck />, click: () => router.push('/contact')},
   ];

   const activityItems = dashboard?.recentActivity || [];
   const attentionCards = dashboard?.expiringSoon || [];
   const firstName = (state?.user?.name || '').split(' ')[0] || 'there';

   return (
      <div className="relative z-10">
         <Header title={`${greeting()}, ${firstName}`} subTitle={`Here's what's happening at ${state?.organization?.name || 'your organization'}.`} />

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map(item => (
            <StatsCard key={item.title} title={item.title} value={item.value} color={item.color} icon={item.icon} info={item.info} />
            ))}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
               <div className="flex justify-between items-center mb-6">
                  <div>
                     <h3 className="font-semibold text-lg">Upcoming Events</h3>
                     <p className="text-slate-500 text-sm">Next events on the calendar</p>
                  </div>
                  <button 
                     className="text-sm font-medium text-slate-600 flex items-center gap-1 hover:text-slate-900 cursor-pointer"
                     onClick={() => router.push("/event")}
                  >
                     View All <ArrowRight size={16} />
                  </button>
               </div>

               <div className="space-y-4">
                  {!(dashboard?.upcomingEvents?.length > 0) && (
                     <p className="text-sm text-slate-500">No upcoming events yet. Use Create Event to add one.</p>
                  )}
                  {dashboard?.upcomingEvents?.length > 0 && dashboard?.upcomingEvents.map(upcomingEvent => {
                     const filledPercent = upcomingEvent?.capacity > 0 ? ((upcomingEvent?._count?.rsvps / upcomingEvent?.capacity) * 100).toFixed(0) : 0;
                     return (
                        <div key={upcomingEvent.slug} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                           <div>
                              <h4 className="font-medium text-slate-900">{upcomingEvent.title}</h4>
                              <p className="text-slate-500 text-sm">{formatToReadableDate(upcomingEvent.date)}</p>
                           </div>
                           <div className="bg-gray-100 px-3 py-1 rounded-md text-right">
                              <span className="block text-sm font-semibold text-slate-800">{upcomingEvent?._count?.rsvps}{upcomingEvent.capacity ? ` / ${upcomingEvent.capacity}` : ''} RSVPs</span>
                              <span className="block text-xs text-slate-500">{upcomingEvent.capacity ? `${filledPercent}% full` : 'No cap'}</span>
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
               <div className="mb-6">
                  <h3 className="font-semibold text-lg">Quick Actions</h3>
                  <p className="text-slate-500 text-sm">Common tasks and shortcuts</p>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  {actions.map(action => 
                  <button 
                     key={action.title} 
                     className="flex flex-col items-center justify-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all gap-2 group cursor-pointer"
                     onClick={action?.click}
                  >
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-6">
                     <div>
                     <h3 className="font-semibold text-lg">Recent Activity</h3>
                     <p className="text-slate-500 text-sm">Latest updates from your organization</p>
                     </div>
                  </div>

                  <div className="space-y-6">
                     {activityItems.length === 0 && <p className="text-sm text-slate-500">No activity yet.</p>}
                     {activityItems.map((item, i) => (
                     <div key={`${item.type}-${i}`} className="flex gap-4">
                        <div className="mt-1.5">
                           <div className="w-2 h-2 bg-[var(--brand)] rounded-full"></div>
                        </div>
                        <div>
                           <p className="text-sm text-slate-800 font-medium">{item.title}</p>
                           <p className="text-xs text-slate-400 mt-1">{timeAgo(item.at)}</p>
                        </div>
                     </div>
                     ))}
                  </div>
               </div>

               <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-6">
                     <div>
                     <h3 className="font-semibold text-lg">Needs Attention</h3>
                     <p className="text-slate-500 text-sm">Memberships renewing in the next 30 days</p>
                     </div>
                     <button onClick={() => router.push('/contact')} className="text-sm font-medium text-slate-600 flex items-center gap-1 hover:text-slate-900 cursor-pointer">
                     View All Members <ArrowRight size={16} />
                     </button>
                  </div>

                  <div className="space-y-3">
                     {attentionCards.length === 0 && <p className="text-sm text-slate-500">No renewals due in the next 30 days.</p>}
                     {attentionCards.map((card) => (
                     <div key={card.id} className="flex items-center justify-between p-4 bg-orange-50 border border-orange-100 rounded-lg">
                        <div>
                           <h4 className="font-medium text-slate-900 text-sm">{card.user?.name || card.user?.email}</h4>
                           <p className="text-slate-500 text-xs">{card.membership?.name} renews {formatToReadableDate(card.endDate)}</p>
                        </div>
                        <div className="bg-white px-2 py-1 rounded border border-orange-100 text-xs font-medium text-slate-600 shadow-sm">
                           {daysUntil(card.endDate)}d
                        </div>
                     </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>

         <ContactAddPage 
            isOpen={isContactModalOpen}
            onClose={() => setIsContactModalOpen(false)}
            onAddContact={handleAddContact}
         />

         <ContactImportPage 
            isOpen={isContactImportModalOpen}
            onClose={() => setIsContactImportModalOpen(false)}
            onBulkImport={handleBulkImport}
         />

         <EventAddPage 
            isOpen={isEventModalOpen}
            onClose={() => setIsEventModalOpen(false)}
            onSave={addNewEvent}
         />

         <MembershipAddPage 
            isOpen={isTierModalOpen}
            onClose={() => setIsTierModalOpen(false)}
            onSave={addNewMembership}
         />

         <CampaignAddPage 
            isOpen={isCampaignModalOpen}
            onClose={() => setIsCampaignModalOpen(false)}
            onSave={addNewCampaign}
         />

      </div>
   );
}
