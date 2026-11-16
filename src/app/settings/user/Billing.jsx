'use client';
import { Fragment, useState } from 'react';
import InputField from '@/app/components/forms/InputField';
import { CreditCardIcon, Plus, Download } from 'lucide-react';

export default function Billing() {
   const billingHistory = [
      { id: 1, date: 'Jan 15, 2024', description: 'Annual Membership Dues - Professional', amount: '$150.00', status: 'Paid' },
      { id: 2, date: 'Mar 20, 2024', description: 'Annual Gala Dinner Tickets (2)', amount: '$300.00', status: 'Paid' },
      { id: 3, date: 'May 10, 2024', description: 'Donation', amount: '$100.00', status: 'Paid' },
      { id: 4, date: 'Aug 5, 2024', description: 'Donation', amount: '$250.00', status: 'Paid' },
   ];
   return (
      <div className="space-y-8">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Membership Plan Card */}
         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-6">
               <div>
               <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Professional Membership</h3>
                  <span className="px-2.5 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center gap-1">
                     <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                     </svg>
                     Active
                  </span>
               </div>
               <div className="text-sm text-gray-600 space-y-1">
                  <p>Next billing date: January 15, 2026</p>
                  <p>Payment method: •••• •••• •••• 4242</p>
                  <p>Auto-renewal: Enabled</p>
               </div>
               </div>
               <div className="text-right">
               <p className="text-2xl font-bold text-gray-900">$150.00</p>
               <p className="text-sm text-gray-500">per year</p>
               </div>
            </div>
            <div className="flex gap-3">
               <button className="px-4 py-2 bg-[var(--brand)] text-white rounded-lg font-medium">
               Change Tier
               </button>
               <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm">
               Cancel Membership
               </button>
            </div>
         </div>

         {/* Payment Methods Card */}
         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Saved Payment Methods</h3>
            <p className="text-sm text-gray-600 mb-6">Manage your payment cards</p>
            
            <div className="space-y-4">
               {/* Saved Card Item */}
               <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-orange-100 border border-orange-200 rounded flex items-center justify-center text-primary-orange">
                     <CreditCardIcon size={20} />
                  </div>
                  <div>
                     <p className="text-sm font-medium text-gray-900">Visa ending in 4242</p>
                     <p className="text-sm text-gray-500">Expires 12/2026</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 bg-orange-100 text-primary-orange text-xs font-medium rounded-full">
                     Default
                  </span>
                  <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                     Edit
                  </button>
               </div>
               </div>

               {/* Add Payment Method Button */}
               <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm">
               <Plus size={18} />
               Add Payment Method
               </button>
            </div>
         </div>
         </div>

         {/* Payment History Card */}
         <div className="bg-white rounded-xl shadow-sm border border-gray-200">
         <div className="p-6 flex justify-between items-center border-b border-gray-200">
            <div>
               <h3 className="text-lg font-semibold text-gray-900 mb-1">Payment History</h3>
               <p className="text-sm text-gray-600">Your transaction history and receipts</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm">
               <Download size={16} />
               Export
            </button>
         </div>
         
         {/* Table */}
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
               <tr className="bg-gray-50 text-sm text-gray-500 font-medium border-b border-gray-200">
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Description</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Receipt</th>
               </tr>
               </thead>
               <tbody className="divide-y divide-gray-200">
               {billingHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                     <td className="px-6 py-4 text-sm text-gray-600">{item.date}</td>
                     <td className="px-6 py-4 text-sm text-gray-900 font-medium">{item.description}</td>
                     <td className="px-6 py-4 text-sm text-gray-900 font-medium">{item.amount}</td>
                     <td className="px-6 py-4">
                     <span className="px-2.5 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        {item.status}
                     </span>
                     </td>
                     <td className="px-6 py-4 text-right">
                     <button className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100 inline-flex">
                        <Download size={18} />
                     </button>
                     </td>
                  </tr>
               ))}
               </tbody>
            </table>
         </div>
         </div>
      </div>
   );
}