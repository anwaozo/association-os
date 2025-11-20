'use client';
import { useState } from 'react';
import { FaCircleXmark } from 'react-icons/fa6';
import InputField from '@/app/components/forms/InputField';
import TagInput from '@/app/components/forms/TagInput';
import ToggleSwitch from '@/app/components/forms/ToggleSwitch';

export default function CampaignAddPage({ isOpen, onClose, onSave }) {
   if (!isOpen) return null;
   const [errors, setErrors] = useState({});
    
   // Controlled state for toggles
   const [enableRSVP, setEnableRSVP] = useState(true);
   const [isPublic, setIsPublic] = useState(false);
   const [isAnonymous, setIsAnonymous] = useState(false);
   const [isEmailNotifiy, setIsEmailNotifiy] = useState(false);
   const [isRecurring, setIsRecurring] = useState(false);

   const validateForm = (data) => {
      let newErrors = {};
      const emailRegex = /\S+@\S+\.\S+/;
      const phoneRegex = /^[6-9][0-9]{9}$/;

      if (!data.title || !data.title.trim()) {
         newErrors.title = 'Title is required.';
      }
      if (!data.date || !data.date.trim()) {
         newErrors.date = 'Date is required.';
      }
      if (!data.timeFrom || !data.timeFrom.trim()) {
         newErrors.timeFrom = 'Time From is required.';
      }
      if (!data.timeTo || !data.timeTo.trim()) {
         newErrors.timeTo = 'Time To is required.';
      }
      if (!data.location || !data.location.trim()) {
         newErrors.location = 'Location is required.';
      }
      if (!data.capacity || !data.capacity.trim()) {
         newErrors.capacity = 'Capacity is required.';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const campaignData = Object.fromEntries(formData.entries());
      if (validateForm(campaignData)) {
         onSave(campaignData); 
         e.target.reset();
      }
   };

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
         {/* Changed bg-gray-900 to bg-white, shadow-2xl, border-gray-800 to border-gray-200, ring-1 ring-gray-200 added for definition */}
         <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl p-6 md:p-8 transform transition-all duration-300 scale-100 opacity-100 border border-gray-200">
               
               {/* Header: Changed border-gray-700 to border-gray-200 */}
               <div className="flex justify-between items-start border-b border-gray-200 pb-4 mb-6">
                  <div>
                     {/* Changed text-white to text-gray-900 */}
                     <h2 className="text-2xl font-bold text-gray-900">Create New Campaign</h2>
                     {/* Changed text-gray-400 to text-gray-600 */}
                     <p className="text-gray-600 text-sm mt-1">Launch a new fundraising initiative for your organization</p>
                  </div>
                  {/* Changed text-gray-400 to text-gray-600, hover:bg-gray-800 to hover:bg-gray-100 */}
                  <button onClick={onClose} className="text-gray-600 hover:text-gray-900 transition p-1 rounded-full hover:bg-gray-100">
                     <FaCircleXmark className="w-6 h-6" />
                  </button>
               </div>

               {/* Form Body */}
               <form onSubmit={handleSubmit}>
                  <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                     {/* Campaign Name */}
                     <InputField
                        label="Campaign Name"
                        name="name"
                        type="text"
                        placeholder="e.g., Annual Fund"
                        error={errors?.name}
                        onFocus={() => setErrors(prev => ({ ...prev, name: null }))}
                     />

                     <div className="grid grid-cols-2 gap-4">
                        <InputField
                           label="Fundraising Goal ($)"
                           name="goal"
                           type="number"
                           placeholder="eg., $12500"
                           error={errors?.goal}
                           onFocus={() => setErrors(prev => ({ ...prev, goal: null }))}
                        />
                        <InputField
                           label="End Date"
                           name="end_date"
                           type="date"
                           placeholder=""
                           error={errors?.end_date}
                           onFocus={() => setErrors(prev => ({ ...prev, end_date: null }))}
                        />
                     </div>

                     <InputField
                        label="Suggested Donation Amounts"
                        name="donation_amounts"
                        type="text"
                        placeholder=""
                        error={errors?.donation_amounts}
                        onFocus={() => setErrors(prev => ({ ...prev, donation_amounts: null }))}
                     />

                     <TagInput placeholder="Add a tag and press Enter" />

                     <div className="grid grid-cols-2 gap-4">
                        <InputField
                           label="Capacity"
                           name="capacity"
                           type="number"
                           placeholder=""
                           error={errors?.capacity}
                           onFocus={() => setErrors(prev => ({ ...prev, capacity: null }))}
                        />
                        <InputField
                           label="Price (Optional)"
                           name="price"
                           type="number"
                           placeholder=""
                           error={errors?.price}
                           onFocus={() => setErrors(prev => ({ ...prev, price: null }))}
                        />
                     </div>

                     <InputField
                        label="Campaign Description"
                        name="description"
                        type="textarea"
                        placeholder="Describe the purpose and impact of this campaign..."
                        error={errors?.description}
                        onFocus={() => setErrors(prev => ({ ...prev, description: null }))}
                        info="This will be shown to potential donors"
                     />

                     {/* Toggles */}
                     <ToggleSwitch
                        label="Allow Custom Amount"
                        description="Let donors enter their own amount"
                        enabled={enableRSVP}
                        setEnabled={setEnableRSVP}
                     />
                     <ToggleSwitch
                        label="Make Campaign Public"
                        description="Display on your public donation page"
                        enabled={isPublic}
                        setEnabled={setIsPublic}
                     />
                     <ToggleSwitch
                        label="Allow Anonymous Donations"
                        description="Let donors give without sharing their name"
                        enabled={isAnonymous}
                        setEnabled={setIsAnonymous}
                     />
                     <ToggleSwitch
                        label="Email Notifications"
                        description="Get notified when donations are received"
                        enabled={isEmailNotifiy}
                        setEnabled={setIsEmailNotifiy}
                        input="text"
                        error={errors?.notify_email}
                        onFocus={() => setErrors(prev => ({ ...prev, notify_email: null }))}
                     />
                     <ToggleSwitch
                        label="Allow Recurring Donations"
                        description="Enable monthly recurring contributions"
                        enabled={isRecurring}
                        setEnabled={setIsRecurring}
                     />

                     <InputField
                        label="Thank You Message"
                        name="thank_you_message"
                        type="textarea"
                        placeholder="Describe the purpose and impact of this campaign..."
                        error={errors?.thank_you_message}
                        onFocus={() => setErrors(prev => ({ ...prev, thank_you_message: null }))}
                        info="This message will be shown after a successful donation"
                     />
                  </div>

                  {/* Footer Buttons: Changed border-gray-700 to border-gray-200, Cancel button updated */}
                  <div className="mt-8 flex justify-end space-x-4 pt-4 border-t border-gray-200">
                     <button
                        onClick={onClose}
                        // Cancel Button: border-gray-300, text-gray-800, hover:bg-gray-100
                        className="px-6 py-3 border border-gray-300 text-gray-800 font-medium rounded-xl hover:bg-gray-100 transition duration-150 shadow-sm"
                     >
                        Cancel
                     </button>
                     <button
                        className="px-6 py-3 bg-[#FF884D] hover:bg-[#FF7733] text-white font-medium rounded-xl shadow-lg transition duration-150 transform hover:scale-[1.01]"
                     >
                        Create Campaign
                     </button>
                  </div>
               </form>
         </div>
      </div>
   );
}
