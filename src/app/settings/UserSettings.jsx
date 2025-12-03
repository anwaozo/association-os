'use client';
import { Fragment, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Header from '@/app/components/Header';
import Profile from '@/app/settings/user/Profile';
import Notification from '@/app/settings/Notification';
import { FaUsers, FaLock, FaCreditCard, FaCopyright } from 'react-icons/fa';
import { User, Shield, CreditCard, Lock, Link as LinkIcon } from 'lucide-react';

export default function SettingsPage() {
   const { user, role, logout } = useAuth();
   const [isOpen, setIsOpen] = useState(true);
   const [activeTab, setActiveTab] = useState('profile');
   const isAdmin = user?.role;

   const tabDatas = [
      { id: 'profile', label: 'Profile', icon: User },
      { id: 'security', label: 'Security', icon: Shield },
      { id: 'billing', label: 'Billing', icon: CreditCard },
      { id: 'privacy', label: 'Privacy', icon: Lock },
   ];
   
   return (
      <Fragment>
         <Header title="Settings" subTitle="Configure membership levels and pricing" />

         {/* Tabs Navigation */}
         <div className="flex border-b border-gray-200 -mb-px">
            {tabDatas.map(tab => (
            <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`
                  px-5 py-3 text-sm font-semibold flex items-center space-x-2 transition-colors duration-150
                  ${activeTab === tab.id 
                     ? 'text-[#FF884D] border-b-2 border-[#FF884D]' 
                     : 'text-gray-500 hover:text-gray-700'
                  }
               `}
            >
               <tab.icon size={16} /><span>{tab.label}</span>
            </button>
            ))}
         </div>

         <div className="tab-content border-b border-gray-200 mb-8">
            {activeTab === 'profile' && <Profile />}
            {activeTab === 'security' && <Notification />}
            {activeTab === 'billing' && <Notification />}
            {activeTab === 'privacy' && <Notification />}
         </div>

      </Fragment>
   );
}
