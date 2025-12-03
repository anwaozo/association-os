import {useState} from 'react';
import ToggleSwitch from '@/app/components/forms/ToggleSwitch';
import InputField from '@/app/components/forms/InputField';
import { FaEnvelope } from 'react-icons/fa';
import { FaMessage } from 'react-icons/fa6';
import { Mail} from 'lucide-react';

export default function Notification() {

   const [enableSMS, setEnableSMS] = useState(false);

   return (
      <div className="space-y-8">
         <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center mb-6">
               <span className="text-xl mr-2"><Mail /></span>
               <h2 className="text-xl font-semibold text-gray-900">
                  Email Provider (Postmark, SendGrid, etc.)
               </h2>
            </div>
            
            <div className="space-y-4">
               <InputField label="Email Service" value="Postmark" />
               <InputField label="API Key" value="************" type="password" />
               <InputField label="From Email Address" value="noreply@friarsociety.org" readOnly={true} />
               <InputField label="From Name" value="The Friar Society" />
            </div>

            {/* Save Changes Button */}
            <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
               <button className="bg-[#FF7A2C] text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors">
                  Save Changes
               </button>
            </div>
         </div>
         
         {/* --- 📱 SMS Provider (Twilio) Section --- */}
         <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center mb-6">
               <span className="text-xl mr-2"><Mail /></span>
               <h2 className="text-xl font-semibold text-gray-900">
                  SMS Provider (Twilio)
               </h2>
            </div>
            
            <div className="space-y-4">
               <InputField label="Account SID" value="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" readOnly={true} />
               <InputField label="API Key" value="************" type="password" />
               <InputField label="Auth Token" value="Enter your Twilio auth token" />
               <InputField label="Phone Number" value="+1 (555) 123-4567" readOnly={true} />
            </div>

            {/* SMS Notification Toggle */}
            <div className="py-4 border-t border-b border-gray-100 mb-6">
               <ToggleSwitch
                  label="Enable SMS Notifications"
                  description="Send event reminders via SMS"
                  enabled={enableSMS}
                  setEnabled={setEnableSMS}
               />
            </div>

            {/* Save Changes Button */}
            <div className="flex justify-end pt-4">
               <button className="bg-[#FF7A2C] text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors">
                  Save Changes
               </button>
            </div>
         </div>
      </div>
   );
}