'use client';
import { Fragment, useState } from 'react';
import Header from '@/app/components/Header';
import MyProfile from '@/app/settings/MyProfile';
import Security from '@/app/settings/user/Security';
import Billing from '@/app/settings/user/Billing';
import Privacy from '@/app/settings/user/Privacy';
import SettingsTabs from '@/app/settings/SettingsTabs';
import { CircleUser, LockKeyhole, Copyright, CreditCard } from 'lucide-react';
import { SHOW_PREVIEW } from '@/lib/features';

export default function UserSettings() {
   const [activeTab, setActiveTab] = useState('profile');

   const tabs = [
      { id: 'profile', label: 'Profile', icon: CircleUser },
      SHOW_PREVIEW && { id: 'security', label: 'Security', icon: LockKeyhole },
      SHOW_PREVIEW && { id: 'billing', label: 'Billing', icon: CreditCard },
      SHOW_PREVIEW && { id: 'privacy', label: 'Privacy', icon: Copyright },
   ].filter(Boolean);

   return (
      <Fragment>
         <Header title="Settings" subTitle="Manage your profile and password" />
         <SettingsTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
         <div className="tab-content">
            {activeTab === 'profile' && <MyProfile />}
            {activeTab === 'security' && <Security />}
            {activeTab === 'billing' && <Billing />}
            {activeTab === 'privacy' && <Privacy />}
         </div>
      </Fragment>
   );
}
