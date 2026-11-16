'use client';
import { useState } from 'react';
import Sidebar from '@/app/components/Sidebar';
import Header from '@/app/components/Header';
import MessageList from '@/app/message/MessageList';
import DeliveryLog from '@/app/message/DeliveryLog';
import { FaSearch, FaCreditCard, FaUserPlus, FaCheckCircle, FaHeart, FaBell, FaList, FaFile } from 'react-icons/fa';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { ListOrdered, FileText } from 'lucide-react';

export default function MessagePage() {
   const [isOpen, setIsOpen] = useState(true);
   const [activeTab, setActiveTab] = useState('templates');
   const [searchText, setSearchText] = useState('');
   const [filter, setFilter] = useState('All Activity');

   const MOCK_MESSAGES = [
      { 
         id: 1, 
         notification_type: "Email",
         template: "Blank Message",
         subject: "Welcome to our organization!",
         delivery_log:[
            {label: 'Sent', count: 15},
            {label: 'Delivered', count: 15},
            {label: 'Opened', count: 12},
            {label: 'Cliked', count: 8},
            {label: 'Failed', count: 0},
         ]
      },
      { 
         id: 2, 
         notification_type: "Email",
         template: "Due Receipt",
         subject: "Welcome to our organization!",
         delivery_log:[
            {label: 'Sent', count: 15},
            {label: 'Delivered', count: 15},
            {label: 'Opened', count: 12},
            {label: 'Cliked', count: 8},
            {label: 'Failed', count: 0},
         ]
      },
      { 
         id: 3, 
         notification_type: "Email",
         template: "Welcome Email",
         subject: "Welcome to our organization!",
         delivery_log:[
            {label: 'Sent', count: 15},
            {label: 'Delivered', count: 15},
            {label: 'Opened', count: 12},
            {label: 'Cliked', count: 8},
            {label: 'Failed', count: 0},
         ]
      },
      { 
         id: 4, 
         notification_type: "Email",
         template: "New Event",
         subject: "Welcome to our organization!",
         delivery_log:[
            {label: 'Sent', count: 15},
            {label: 'Delivered', count: 15},
            {label: 'Opened', count: 12},
            {label: 'Cliked', count: 8},
            {label: 'Failed', count: 0},
         ]
      },
      { 
         id: 5, 
         notification_type: "SMS",
         template: "Event Reminder",
         subject: "Welcome to our organization!",
         delivery_log:[
            {label: 'Sent', count: 15},
            {label: 'Delivered', count: 15},
            {label: 'Opened', count: 12},
            {label: 'Cliked', count: 8},
            {label: 'Failed', count: 0},
         ]
      },
   ];

   const deliveryLog = [
      {
         id: 1,
         title: 'Annual Gala - Save the Date',
         target: { type: 'group', label: 'All Members' },
         time: '2 hours ago',
         stats: { sent: 15, delivered: 15, opened: 12, clicked: 8, failed: 0 },
      },
      {
         id: 2,
         title: 'Dues Reminder - October',
         target: { type: 'tag', label: 'Past Due Members' },
         time: '1 day ago',
         stats: { sent: 15, delivered: 15, opened: 12, clicked: 8, failed: 0 },
      },
      {
         id: 3,
         title: 'Welcome to our organization',
         target: { type: 'group', label: 'New Members' },
         time: '2 days ago',
         stats: { sent: 15, delivered: 15, opened: 12, clicked: 8, failed: 0 },
      },
      {
         id: 4,
         title: 'Welcome to our organization',
         target: { type: 'user', label: 'Sarah Johnson' },
         time: '5 days ago',
         stats: { sent: 1, delivered: 1, opened: 1, clicked: 1, failed: 0 },
      },
   ];

   const ICON_MAP = {
      payment: { icon: FaCreditCard, color: 'text-green-600', bg: 'bg-green-100', detailColor: 'text-green-800', detailBg: 'bg-green-100' },
      member_joined: { icon: FaUserPlus , color: 'text-blue-600', bg: 'bg-blue-100', detailColor: 'text-blue-800', detailBg: 'bg-blue-100' },
      event_rsvp: { icon: FaCheckCircle, color: 'text-purple-600', bg: 'bg-purple-100', detailColor: 'text-purple-800', detailBg: 'bg-purple-100' },
      donation: { icon: FaHeart, color: 'text-red-600', bg: 'bg-red-100', detailColor: 'text-red-800', detailBg: 'bg-red-100' },
      notification_sent: { icon: FaBell, color: 'text-orange-600', bg: 'bg-orange-100', detailColor: 'text-orange-800', detailBg: 'bg-orange-100' },
   };

   const tabDatas = [
      { id: 'templates', label: 'Templates', icon: ListOrdered },
      { id: 'delivery_log', label: 'Delivery Log', icon: FileText },
   ];

   const renderTabContent = () => {
      switch (activeTab) {
         case 'templates':
            return <MessageList messages={MOCK_MESSAGES} />;
         case 'delivery_log':
            return <DeliveryLog messages={deliveryLog} />;
         default:
            return null;
      }
   };
   
   return (
      <ProtectedRoute>
         <Header title="Messages" subTitle="Configure membership levels and pricing" />

         {/* Tabs Navigation */}
         <div className="flex items-center gap-8 border-b border-gray-200 mb-8">
            {tabDatas.map(tab => (
            <button
               key={tab.label}
               onClick={() => setActiveTab(tab.id)}
               className={`
                  px-5 py-3 text-sm font-semibold flex items-center space-x-2 transition-colors duration-150
                  ${activeTab === tab.id 
                     ? 'text-[var(--brand)] border-b-2 border-[var(--brand)]' 
                     : 'text-gray-500 hover:text-gray-700'
                  }
               `}
            >
               <tab.icon size={16} /><span>{tab.label}</span>
            </button>
            ))}
         </div>

         {renderTabContent()}
      </ProtectedRoute>
   );
}
