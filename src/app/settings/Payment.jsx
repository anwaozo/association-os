import {useState} from 'react';
import ToggleSwitch from '@/app/components/forms/ToggleSwitch';

export default function Payment() {

   const [isRenewal, setIsRenewal] = useState(false);
   const [paymentReceipt, setPaymentReceipt] = useState(false);
   const [paymentPlan, setPaymentPlan] = useState(false);
   
   return (
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
         
         <h2 className="text-2xl font-semibold mb-6">Stripe Integration</h2>
         <p className="text-gray-600 mb-6">Connect your Stripe account for payments</p>
         
         {/* Connected to Stripe Card */}
         <div className="bg-green-50 border border-green-300 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between">
               <div className="flex items-center">
                  <span className="text-green-500 mr-3">🟢</span>
                  <div>
                  <p className="font-semibold text-green-800">Connected to Stripe</p>
                  <p className="text-sm text-green-700">Account: acct_1Abc...xyz</p>
                  </div>
               </div>
               <span className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  Active
               </span>
            </div>
         </div>

         {/* Stripe Publishable Key */}
         <div className="mb-8">
            <label htmlFor="publishable-key" className="block text-lg font-medium text-gray-900 mb-2">
               Stripe Publishable Key
            </label>
            <input
               id="publishable-key"
               type="password"
               defaultValue="**********" // Placeholder for saved key
               className="w-full border border-gray-300 p-3 rounded-lg focus:ring-orange-500 focus:border-orange-500"
            />
            <p className="mt-2 text-sm text-gray-500">
               Your Stripe keys are securely stored
            </p>
         </div>

         {/* Toggle Switches */}
         <div className="divide-y divide-gray-100">
            <ToggleSwitch
               label="Enable Automatic Renewals"
               description="Auto-charge members on renewal dates"
               enabled={isRenewal}
               setEnabled={setIsRenewal}
            />
            <ToggleSwitch
               label="Send Payment Receipts"
               description="Email receipts after successful payments"
               enabled={paymentReceipt}
               setEnabled={setPaymentReceipt}
            />
            <ToggleSwitch
               label="Allow Payment Plans"
               description="Enable monthly payment options"
               enabled={paymentPlan}
               setEnabled={setPaymentPlan}
            />
         </div>

         {/* Footer Actions */}
         <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button className="text-red-600 hover:text-red-800 font-medium p-2">
               Disconnect Stripe
            </button>
            <button className="bg-[#FF7A2C] text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors">
               Save Changes
            </button>
         </div>
      </div>
   );
}