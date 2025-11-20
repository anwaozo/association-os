'use client';
import { useState } from 'react';
import Link from 'next/link';
import Header from '@/app/components/Header';
import Currency from '@/app/components/Currency';
import Donation from '@/app/fundraising/Donation';
import PerformanceChart from '@/app/fundraising/PerformanceChart';
import { FaArrowRight, FaCalendar, FaEnvelope, FaDownload, FaDollarSign, FaDatabase, FaChartLine } from 'react-icons/fa';
import ProtectedRoute from '@/app/components/ProtectedRoute';

export default function FundraisingPage() {

   const StatTile = ({ title, value, timePeriod, icon: Icon, linkText }) => (
      <div className="p-5 bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col justify-between">
         <div className="flex justify-between items-start mb-3">
               <p className="text-sm font-semibold text-gray-500">{title}</p>
               {/* Dropdown for Total Raised */}
               {timePeriod && (
                  <select className="bg-gray-100 text-gray-700 border border-gray-300 rounded-lg py-1 px-3 text-sm cursor-pointer focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none">
                     <option>{timePeriod}</option>
                     <option>Last 30 Days</option>
                     <option>Year to Date</option>
                  </select>
               )}
               {/* Icon for Recurring contributions */}
               {Icon && Icon}
         </div>
         <div className="flex items-end justify-between">
               {/* Value display, applying currency formatting if appropriate */}
               <p className="text-3xl font-bold text-gray-900">
                  {title === "Total Raised" ? <Currency amount={value} /> : value.toLocaleString()}
               </p>
               {/* Link for Active Campaigns */}
               {linkText && (
                  <Link href={'/campaign'}>
                  <span className="flex items-center text-sm font-medium text-indigo-600 cursor-pointer hover:text-indigo-700">
                     {linkText} <FaArrowRight className="w-4 h-4 ml-1" />
                  </span>
                  </Link>
               )}
         </div>
      </div>
   );
   
   const statDatas = [
      { title: "Total Raised", value: 12450, timePeriod: "All time" },
      { title: "Recurring contributions", value: 3, icon: <FaDollarSign className="w-5 h-5 text-gray-500" /> },
      { title: "Active Campaigns", value: 2, linkText: "View", link: 'campaign' },
   ];

   const DONATION_DATA = [
      { id: 1, name: "John Doe", email: "john@example.com", type: "Monthly", amount: 40, date: "Jan 15, 2024", campaign: "Scholarship Fund" },
      { id: 2, name: "Sarah Johnson", email: "sarah@example.com", type: "Monthly", amount: 500, date: "Feb 20, 2024", campaign: "Scholarship Fund" },
      { id: 3, name: "Michael Chen", email: "michael@example.com", type: "One-time", amount: 1000, date: "Mar 10, 2024", campaign: "None" },
      { id: 4, name: "Emily Rodriguez", email: "emily@example.com", type: "One-time", amount: 250, date: "Apr 5, 2024", campaign: "None" },
      { id: 5, name: "David Wilson", email: "david@example.com", type: "One-time", amount: 50, date: "May 12, 2024", campaign: "None" },
      { id: 6, name: "Jennifer Lee", email: "jennifer@example.com", type: "One-time", amount: 2500, date: "Sep 1, 2025", campaign: "Scholarship Fund" },
      { id: 7, name: "Robert Taylor", email: "robert@example.com", type: "Monthly", amount: 50, date: "Jun 18, 2024", campaign: "General Fund" },
      { id: 8, name: "Lisa Anderson", email: "lisa@example.com", type: "One-time", amount: 100, date: "Jul 22, 2024", campaign: "General Fund" },
   ];

   return (
      <ProtectedRoute>
         <Header title="Fundraising" subTitle="Configure membership levels and pricing" />

         {/* Top Section: Chart and Stats */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Fundraising Performance Chart (takes 2/3 width on large screens) */}
            <div className="lg:col-span-2">
               <PerformanceChart />
            </div>

            {/* Stats Tiles (takes 1/3 width on large screens, stacked vertically) */}
            <div className="lg:col-span-1 space-y-6">
               {statDatas.map((stat, index) => (
                  <StatTile key={index} {...stat} />
               ))}
            </div>
         </div>

         {/* Recent Donations Table */}
         <Donation data={DONATION_DATA} />
      </ProtectedRoute>
   );
}
