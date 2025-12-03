'use client';
import { Fragment, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Header from '@/app/components/Header';
import Payment from '@/app/settings/Payment';
import Notification from '@/app/settings/Notification';
import { WalletCards, Bell} from 'lucide-react';


export default function SettingsPage() {
   const { user, role, logout } = useAuth();
   const [activeTab, setActiveTab] = useState('payments');
   const isAdmin = user?.role;

   const tabDatas = [
      { id: 'payments', label: 'Payments', icon: WalletCards },
      { id: 'notifications', label: 'Notifications', icon: Bell },
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

         <div className="tab-content">
            {activeTab === 'payments' && <Payment />}
            {activeTab === 'notifications' && <Notification />}
         </div>
      </Fragment>
   );
}
