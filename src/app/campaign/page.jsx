'use client';
import { useState, useEffect } from 'react';
import Currency from '@/app/components/Currency';
import CampaignAddPage from '@/app/campaign/add/page';
import { DollarSign } from 'lucide-react';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { Plus, Pencil } from 'lucide-react';
import { useApiClient } from "@/lib/apiClient";
import { useToast } from "@/app/components/toast/ToastContext";
import { SHOW_PREVIEW } from '@/lib/features';

export default function CampaignPage() {
   const api = useApiClient();
   const { showToast } = useToast();
   const [contacts, setContacts] = useState([]);
   const [campaign, setCampaign] = useState([]);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [editing, setEditing] = useState(null);
   const [formKey, setFormKey] = useState(0);

   const openCreate = () => { setEditing(null); setFormKey((k) => k + 1); setIsModalOpen(true); };
   const openEdit = (c) => { setEditing(c); setFormKey((k) => k + 1); setIsModalOpen(true); };

   const updateCampaign = async (data) => {
      try {
         await api.put(`/campaign/${editing.id}`, data);
         showToast(`Campaign updated!`);
         setIsModalOpen(false);
         setEditing(null);
         const list = await api.get("/campaign");
         setCampaign(list.data);
      } catch (err) {
         // Error toast shown by the API client
      }
   };

   const addNewCampaign = async (newCampaign) => {
      try {
         await api.post("/campaign", newCampaign);
         showToast(`Campaign added successfully!`);
         setIsModalOpen(false);
         const list = await api.get("/campaign");
         setCampaign(list.data);
      } catch (err) {
         // Error toast shown by the API client
      }
   };

   const fetchCampaigns = async () => {
      const res = await api.get("/campaign");
      if (res.data) {
         setCampaign(res.data);
      }
   };

   useEffect(() => {
      fetchCampaigns();
   }, []);

   const getStatusColor = (status) => {
      if (status === 'Upcoming') return 'text-green-700 bg-green-100';
      if (status === 'Ongoing') return 'text-yellow-700 bg-yellow-100';
      return 'text-gray-700 bg-gray-100';
   };

   const onBack = () => {
      window.history.back();
   }

   return (
      <ProtectedRoute>
         <div className="space-y-6">
            
            {/* Breadcrumb / Back Link */}
            {SHOW_PREVIEW && (
            <nav className="flex items-center space-x-2 text-sm text-gray-500 font-medium">
               <button onClick={onBack} className="flex items-center hover:text-[var(--brand)] transition">
                  <DollarSign className="w-4 h-4 mr-0.5" />
                  Fundraising
               </button>
               <span>/</span>
               <span className="text-gray-900 font-bold truncate max-w-xs">Active Campaigns</span>
            </nav>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
               <h1 className="text-3xl font-bold text-gray-900">Active Campaigns</h1>
               <button className="flex items-center gap-2 bg-[var(--brand)] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors" onClick={openCreate}>
                  <Plus size={18} />
                  Create Campaign
               </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
               <div className="flex flex-col space-y-10">
                  {campaign.length === 0 && (
                     <p className="text-gray-500">No campaigns yet. Use Create Campaign to start one.</p>
                  )}
                  {campaign.map((campaign) => {
                     const received = Number(campaign?.received) || 0;
                     const goal = Number(campaign?.goal) || 1;
                     const percentRaised = Math.round((received / goal) * 100);
                     return (
                     <div key={campaign.id} className="w-full mb-10">
                        <div className="flex justify-between items-end mb-3">
                           <div>
                              <h3 className="text-xl font-semibold text-gray-900">{campaign.name}</h3>
                              {campaign.date && <p className="text-sm text-gray-500">Runs until {new Date(campaign.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}</p>}
                           </div>
                           <div className="flex items-center gap-4">
                              <span className="text-lg font-medium text-gray-500">{percentRaised}%</span>
                              <button
                                 onClick={() => openEdit(campaign)}
                                 className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                              >
                                 <Pencil size={14} /> Edit
                              </button>
                           </div>
                        </div>
                        
                        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden mb-3">
                           <div 
                              className={`h-full rounded-full ${(percentRaised >= 0 && percentRaised < 20 ? 'bg-red-600' : (percentRaised >= 21 && percentRaised < 60 ? 'bg-gray-600' : 'bg-primary-green'))}`}
                              style={{ width: `${Math.min(100, percentRaised)}%` }}
                           ></div>
                        </div>
                        
                        <div className="text-gray-600 text-lg">
                           <span className="font-medium text-gray-900"><Currency amount={received} /></span> of <Currency amount={goal} />
                        </div>
                     </div>
                     );
                  })}
               </div>
            </div>

         </div>
         <CampaignAddPage 
            key={formKey}
            isOpen={isModalOpen}
            onClose={() => { setIsModalOpen(false); setEditing(null); }}
            onSave={addNewCampaign}
            onUpdate={updateCampaign}
            mode={editing ? "edit" : "add"}
            campaign={editing}
         />
      </ProtectedRoute>
   );
};