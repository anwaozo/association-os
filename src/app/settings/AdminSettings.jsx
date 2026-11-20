'use client';
import { Fragment, useEffect, useState } from 'react';
import Header from '@/app/components/Header';
import Payment from '@/app/settings/Payment';
import Notification from '@/app/settings/Notification';
import OrganizationSettings from '@/app/settings/OrganizationSettings';
import MyProfile from '@/app/settings/MyProfile';
import SettingsTabs from '@/app/settings/SettingsTabs';
import { WalletCards, Bell, Building2, CircleUser } from 'lucide-react';
import { SHOW_PREVIEW } from '@/lib/features';

export default function AdminSettings() {
   const [activeTab, setActiveTab] = useState('organization');

   // Deep links such as /settings?tab=payments (Stripe sends admins back here).
   useEffect(() => {
      const tab = new URLSearchParams(window.location.search).get('tab');
      if (tab === 'payments' || tab === 'profile') setActiveTab(tab);
   }, []);

   const tabs = [
      { id: 'organization', label: 'Organization', icon: Building2 },
      { id: 'profile', label: 'My Profile', icon: CircleUser },
      { id: 'payments', label: 'Payments', icon: WalletCards },
      SHOW_PREVIEW && { id: 'notifications', label: 'Notifications', icon: Bell },
   ].filter(Boolean);

   return (
      <Fragment>
         <Header title="Settings" subTitle="Your organization's branding and your account" />
         <SettingsTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
         <div className="tab-content">
            {activeTab === 'organization' && <OrganizationSettings />}
            {activeTab === 'profile' && <MyProfile />}
            {activeTab === 'payments' && <Payment />}
            {activeTab === 'notifications' && <Notification />}
         </div>
      </Fragment>
   );
}
