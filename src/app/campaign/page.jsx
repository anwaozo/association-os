'use client';
import { useState, useEffect } from 'react';
import Currency from '@/app/components/Currency';
import CampaignAddPage from '@/app/campaign/add/page';
import { DollarSign } from 'lucide-react';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { Plus } from 'lucide-react';
import { useApiClient } from "@/lib/apiClient";
import { useToast } from "@/app/components/toast/ToastContext";

export default function CampaignPage() {
   const api = useApiClient();
   const { showToast } = useToast();
   const [contacts, setContacts] = useState([]);
   const [campaign, setCampaign] = useState([]);
   const [isModalOpen, setIsModalOpen] = useState(false);

   const addNewCampaign = async (newCampaign) => {
      try {
         const res = await api.post("/campaign", newCampaign);
         if(res.status === 201) {
            showToast(`Campaign  added successfully!`);
            setIsModalOpen(false);
            const list = await api.get("/campaign");
            setCampaign(list.data);
         } else {
            showToast(res.data.message);
         }
      } catch (err) {
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

   const campaigns = [
      {
         id: 1,
         title: 'General Fund',
         raised: '$8,450',
         goal: '$10,000',
         percentage: 85,
         colorClass: 'bg-primary-green'
      },
      {
         id: 2,
         title: 'Scholarship Fund',
         raised: '$15,200',
         goal: '$20,000',
         percentage: 76,
         colorClass: 'bg-primary-green'
      },
      {
         id: 3,
         title: 'Building Fund',
         raised: '$32,500',
         goal: '$50,000',
         percentage: 65,
         colorClass: 'bg-primary-green'
      },
      {
         id: 4,
         title: 'Capital Campaign',
         raised: '$47,800',
         goal: '$100,000',
         percentage: 48,
         colorClass: 'bg-gray-600' 
      },
   ];

   const onBack = () => {
      window.history.back();
   }

   return (
      <ProtectedRoute>
         <div className="space-y-6">
            
            {/* Breadcrumb / Back Link */}
            <nav className="flex items-center space-x-2 text-sm text-gray-500 font-medium">
               <button onClick={onBack} className="flex items-center hover:text-[#FF884D] transition">
                  <DollarSign className="w-4 h-4 mr-0.5" />
                  Fundraising
               </button>
               <span>/</span>
               <span className="text-gray-900 font-bold truncate max-w-xs">Active Campaigns</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
               <h1 className="text-3xl font-bold text-gray-900">Active Campaigns</h1>
               <button className="flex items-center gap-2 bg-[#FF7A2C] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors" onClick={setIsModalOpen.bind(null, true)}>
                  <Plus size={18} />
                  Create Campaign
               </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
               <div className="flex flex-col space-y-10">
                  {campaign.map((campaign) => {
                     const received = Number(campaign?.received) || 0;
                     const goal = Number(campaign?.goal) || 1;
                     const percentRaised = Math.round((received / goal) * 100);
                     return (
                     <div key={campaign.title} className="w-full mb-10">
                        <div className="flex justify-between items-end mb-3">
                           <h3 className="text-xl font-semibold text-gray-900">{campaign.name}</h3>
                           <span className="text-lg font-medium text-gray-500">{percentRaised}%</span>
                        </div>
                        
                        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden mb-3">
                           <div 
                              className={`h-full rounded-full ${(percentRaised >= 0 && percentRaised < 20 ? 'bg-red-600' : (percentRaised >= 21 && percentRaised < 60 ? 'bg-gray-600' : 'bg-primary-green'))}`}
                              style={{ width: `${percentRaised}%` }}
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
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={addNewCampaign}
         />
      </ProtectedRoute>
   );
};