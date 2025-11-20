'use client';
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/app/components/Header';
import Currency from '@/app/components/Currency';
import StatsCard from '@/app/components/StatsCard';
import MembershipAddPage from '@/app/membership/add/page';
import { useApiClient } from "@/lib/apiClient";
import { useToast } from "@/app/components/toast/ToastContext";
import { FaPlus, FaSearch, FaEllipsisH, FaUsers, FaCheckCircle } from 'react-icons/fa';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { useSelectedItem } from "@/store/useSelectedItem";

export default function MembershipPage() {
   const api = useApiClient();
   const { showToast } = useToast();
   const { setItem } = useSelectedItem();
   const [membership, setMembership] = useState([]);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [searchTerm, setSearchTerm] = useState("");

   const addNewMembership = async (newMembership) => {
      try {
         const res = await api.post("/memberships", newMembership);
         showToast("Membership created successfully!", "success");
         setIsModalOpen(false);
         const list = await api.get("/memberships");
         setMembership(list.data);
      } catch (err) {
      }
   };

   useEffect(() => {
      const fetchMebersips = async () => {
         const res = await api.get("/memberships");
         if (res.data) {
            setMembership(res.data);
         }
      };

      fetchMebersips();
   }, []);

   const stats = [
      { title: "Total Tiers", value: 4, color: "indigo" },
      { title: "Total Members", value: 345, color: "green" },
      { title: "Most Popular", value: "Professional", color: "yellow" },
   ];

   const TierCard = ({ tier }) => (
      <div className="bg-white p-6 rounded-xl shadow-md border-b-4 border-gray-200 hover:border-indigo-500 transition-all">
         <div className="flex justify-between items-start mb-4">
            <div>
               <h3 className="text-xl font-bold text-gray-900 mb-1">{tier.name}</h3>
               <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600"><Currency amount={tier.price} /></span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">{tier.auto_renewal === true ? 'Autorenew': 'No Autorenew'}</span>
               </div>
            </div>
            <button className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors">
               <Link
                  href={`membership/${tier.slug}`}
                  onClick={() => setItem(tier)}
               >
                  <FaEllipsisH className="w-5 h-5" />
               </Link>
            </button>
         </div>

         <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Benefits</h4>
            <ul className="text-sm text-gray-600 space-y-1">
               {tier.benefits.slice(0, 3).map((benefit, index) => (
               <li key={index} className="flex items-start">
                  <FaCheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  {benefit}
               </li>
               ))}
            </ul>
         </div>

         <div className="flex items-center text-sm text-gray-600 mb-6">
            <FaUsers className="w-4 h-4 mr-2 text-indigo-500" />
            <span>{tier.activeMembers} active members</span>
         </div>

         <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
            <span className="text-md text-gray-600">Monthly Revenue</span>
            <span className="text-xl font-bold text-green-600">
               <Currency amount={tier.monthlyRevenue} />
            </span>
         </div>
      </div>
   );

   return (
      <ProtectedRoute>
         <Header title="Membership Tiers" subTitle="Configure membership levels and pricing" />

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-10">
            {stats.map((item, i) => (
            <StatsCard key={i} title={item.title} value={item.value} color={item.color} icon={item.icon} />
            ))}
         </div>

         <div className="bg-white rounded-xl p-6 shadow-xl border border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-200 pb-4">
               <h2 className="text-xl font-semibold text-gray-900 mb-4 sm:mb-0">All Tiers</h2>
               <button 
                  className="flex items-center px-4 py-2 bg-orange-600 rounded-lg text-white font-medium rounded-lg transition shadow-md"
                  onClick={setIsModalOpen.bind(null, true)}
               >
                  <FaPlus className="w-5 h-5 mr-2" />
                  Create Tier
               </button>
            </div>

            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-8">
               <div className="relative flex-1">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                     type="text"
                     placeholder="Search by name"
                     className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder-gray-500"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>

               <select className="bg-gray-50 text-gray-900 border border-gray-300 rounded-lg py-2 px-4 focus:ring-indigo-500 focus:border-indigo-500 transition-colors cursor-pointer appearance-none">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Inactive</option>
               </select>
            </div>

            {/* Tier Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {membership.filter(tier =>
                  tier.name.toLowerCase().includes(searchTerm.toLowerCase())).map((tier) => (
                  <TierCard key={tier.id} tier={tier} />
               ))}
            </div>
         </div>
         <MembershipAddPage 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={addNewMembership}
         />
      </ProtectedRoute>
   );
}