'use client';
import { useState, useEffect } from 'react';
import Currency from '@/app/components/Currency';
import CampaignAddPage from '@/app/campaign/add/page';
import { FaCalendar, FaClock, FaMapPin, FaDollarSign, FaUsers, FaCheckSquare, FaChevronLeft, FaFacebookMessenger, FaEdit, FaSearch, FaDownload, FaCheckCircle, FaMinusCircle, FaFile, FaEllipsisV, FaChevronDown, FaPlus } from 'react-icons/fa';
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

   /*const campaigns = [{
      id: 1,
      name: "General Fund",
      slug: "general-fund",
      received: 8450,
      total: 10000,
   },{
      id: 2,
      name: "Scholarship Fund",
      slug: "scholarship-fund",
      received: 15200,
      total: 20000,
   },{
      id: 3,
      name: "Building Fund",
      slug: "building-fund",
      received: 32500,
      total: 50000,
   },{
      id: 4,
      name: "Capital Campaign",
      slug: "capital-campaign",
      received: 47800,
      total: 100000,
   }];*/

   // --- Event Details Tab Content ---
   const CampaignList = (campaigns) => (
      <div className="mt-8 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200">
         
         {/* Campaigns List */}
         <div className="w-full items-center space-y-4 sm:space-y-0 sm:space-x-6 p-4 bg-gray-50">
            {campaign.map((campaign) => {
               const percentRaised = ((campaign?.received ? campaign?.received : 0 / campaign.goal) * 100).toFixed(0);
               return (
                  <div key={campaign.id} className="flex-1 w-full mb-5">
                     <h3 className="text-lg font-semibold text-gray-900 mb-2">{campaign.name}</h3>
                     <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-700"><span className="font-bold"><Currency amount={campaign?.received ? campaign?.received : 0} /></span> of <span className="font-bold"><Currency amount={campaign.goal} /></span></p>
                        <p className="text-sm font-bold text-indigo-600">{percentRaised}%</p>
                     </div>
                     {/* Progress Bar */}
                     <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                           className="h-3 rounded-full bg-green-300 transition-all duration-500" 
                           style={{ width: `${percentRaised}%` }}
                        ></div>
                     </div>
                  </div>
               );
            })}
         </div>

      </div>
   );
   // --- End Tab Content ---

   const onBack = () => {
      window.history.back();
   }

   return (
      <ProtectedRoute>
         <div className="space-y-6">
            
            {/* Breadcrumb / Back Link */}
            <nav className="flex items-center space-x-2 text-sm text-gray-500 font-medium">
               <button onClick={onBack} className="flex items-center hover:text-[#FF884D] transition">
                  <FaChevronLeft className="w-4 h-4 mr-0.5" />
                  Fundraising
               </button>
               <span>/</span>
               <span className="text-gray-900 font-bold truncate max-w-xs">Active Campaigns</span>
            </nav>

            {/* Event Header: Title, Status, Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6">
               <div className="flex flex-wrap items-center space-x-4 mb-4 sm:mb-0">
                  <h1 className="text-3xl font-bold text-gray-900">Active Campaigns</h1>
               </div>
                  
               {/* Actions */}
               <div className="flex space-x-3">
                  <button className="flex items-center gap-2 bg-[#FF7A2C] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors" onClick={setIsModalOpen.bind(null, true)}>
                     <Plus className="mr-2" /> Create Campaign
                  </button>
               </div>
            </div>

            <CampaignList campaigns={campaign} />

         </div>
         <CampaignAddPage 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={addNewCampaign}
         />
      </ProtectedRoute>
   );
};