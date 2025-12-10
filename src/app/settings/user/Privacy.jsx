'use client';
import { Fragment, useState } from 'react';
import InputField from '@/app/components/forms/InputField';
import { CreditCardIcon, Plus, Download } from 'lucide-react';
import ToggleSwitch from '@/app/components/forms/ToggleSwitch';

export default function Privacy() {
   
   const [showInDirectory, setShowInDirectory] = useState(true);
   const [showEmail, setShowEmail] = useState(true);
   const [showPhone, setShowPhone] = useState(true);
   const [emailNotifications, setEmailNotifications] = useState(true);
   const [smsNotifications, setSmsNotifications] = useState(true);

   return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
         <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Privacy Settings</h3>
            <p className="text-sm text-gray-600">Control what information is visible in the member directory</p>
         </div>
          
         <div className="space-y-2">
            <ToggleSwitch
               label="Show in Member Directory"
               description="Allow other members to see your profile"
               enabled={showInDirectory}
               setEnabled={setShowInDirectory}
            />
            <ToggleSwitch
               label="Show Email Address"
               description="Display your email in your public profile"
               enabled={showEmail}
               setEnabled={setShowEmail}
            />
            <ToggleSwitch
               label="Show Phone Number"
               description="Display your phone number in your public profile"
               enabled={showPhone}
               setEnabled={setShowPhone}
            />
            <ToggleSwitch
               label="Email Notifications"
               description="Receive updates about events and news"
               enabled={emailNotifications}
               setEnabled={setEmailNotifications}
            />
            <ToggleSwitch
               label="SMS Notifications"
               description="Receive text reminders for events"
               enabled={smsNotifications}
               setEnabled={setSmsNotifications}
            />
         </div>
      </div>
   );
}