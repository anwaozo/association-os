'use client';
import { useState } from 'react';
import { FaCircleXmark } from 'react-icons/fa6';
import InputField from '@/app/components/forms/InputField';
import ToggleSwitch from '@/app/components/forms/ToggleSwitch';
import ProtectedRoute from '@/app/components/ProtectedRoute';

export default function MembershipAddPage({ isOpen, onClose, onSave }) {
   if (!isOpen) return null;
   const [errors, setErrors] = useState({});
   const [autoRenew, setAutoRenew] = useState(true);
   const billing_cadences = [{id:1, value:'Monthly'}, {id:2, value:'Annual'}];

   const [formData, setFormData] = useState({
      name: '', price: '', billing_cadence: '', benefits: '', autoRenew: true
   });

   const validateForm = (data) => {
      let newErrors = {};
      const emailRegex = /\S+@\S+\.\S+/;
      const phoneRegex = /^[6-9][0-9]{9}$/;

      if (!data.name || !data.name.trim()) {
         newErrors.name = 'Tier Name is required.';
      }
      if (!data.price || !data.price.trim()) {
         newErrors.price = 'Price is required.';
      }
      if (!data.billing_cadence || !data.billing_cadence.trim()) {
         newErrors.billing_cadence = 'Billing cadence is required.';
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const membershipData = Object.fromEntries(formData.entries());
      if (validateForm(membershipData)) {
         membershipData.benefits = benefitsArray(membershipData.benefits);
         membershipData.auto_renewal = autoRenew;
         onSave(membershipData); 
         e.target.reset();
      }
   };
   
   const benefitsArray = (benefits = '') => {
      return benefits
      .split("\n")
      .map(line => line.trim())
      .filter(line => line !== "");
   }

   return (
      <ProtectedRoute>
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl p-6 md:p-8 transform transition-all duration-300 scale-100 opacity-100 border border-gray-200">
                  <div className="flex justify-between items-start border-b border-gray-200 pb-4 mb-6">
                     <div>
                        <h2 className="text-2xl font-bold text-gray-900">Create Membership Tier</h2>
                        <p className="text-gray-600 text-sm mt-1">Define a new membership level for your society</p>
                     </div>
                     <button onClick={onClose} className="text-gray-600 hover:text-gray-900 transition p-1 rounded-full hover:bg-gray-100">
                        <FaCircleXmark className="w-6 h-6" />
                     </button>
                  </div>

                  <form onSubmit={handleSubmit}>
                     <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                        <InputField
                           label="Tier Name"
                           name="name"
                           type="text"
                           placeholder="e.g., Golden Membership"
                           error={errors?.name}
                           onFocus={() => setErrors(prev => ({ ...prev, name: null }))}
                        />

                        <div className="grid grid-cols-2 gap-4">
                           <InputField
                              label="Price"
                              name="price"
                              type="number"
                              placeholder="Tier Price"
                              error={errors?.price}
                              onFocus={() => setErrors(prev => ({ ...prev, name: null }))}
                           />
                           <InputField
                              label="Billing Cadence"
                              name="billing_cadence"
                              type="select"
                              values={billing_cadences}
                              placeholder=""
                              error={errors?.billing_cadence}
                              onFocus={() => setErrors(prev => ({ ...prev, billing_cadence: null }))}
                           />
                        </div>

                        <InputField
                           label="Benefits"
                           name="benefits"
                           type="textarea"
                           placeholder="List the benefits of this tier"
                           error={errors?.benefits}
                           onFocus={() => setErrors(prev => ({ ...prev, benefits: null }))}
                        />

                        <ToggleSwitch
                           label="Auto Renewal"
                           description="Automatically renew memberships via Stripe"
                           enabled={autoRenew}
                           setEnabled={setAutoRenew}
                        />
                     </div>

                     <div className="mt-8 flex justify-end space-x-4 pt-4 border-t border-gray-200">
                        <button
                           onClick={onClose}
                           className="px-6 py-3 border border-gray-300 text-gray-800 font-medium rounded-xl hover:bg-gray-100 transition duration-150 shadow-sm"
                        >
                           Cancel
                        </button>
                        <button
                           className="px-6 py-3 bg-[#FF884D] hover:bg-[#FF7733] text-white font-medium rounded-xl shadow-lg transition duration-150 transform hover:scale-[1.01]"
                        >
                           Create Tier
                        </button>
                     </div>
                  </form>
            </div>
         </div>
      </ProtectedRoute>
   );
}
