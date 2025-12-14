'use client';
import { useState, useEffect } from 'react';
import { CircleX } from 'lucide-react';
import InputField from '@/app/components/forms/InputField';
import ToggleSwitch from '@/app/components/forms/ToggleSwitch';
import ProtectedRoute from '@/app/components/ProtectedRoute';

export default function MembershipAddPage({ isOpen, onClose, onSave, onUpdateTier, mode = "add", tier = null }) {
   if (!isOpen) return null;
   const [errors, setErrors] = useState({});
   const [formValues, setFormValues] = useState({
      name: "",
      price: "",
      billing_cadence: "",
      benefits: "",
   });
   const [autoRenew, setAutoRenew] = useState(true);
   const billing_cadences = [{id:'Monthly', value:'Monthly'}, {id:'Annual', value:'Annual'}];

   useEffect(() => {
      if (mode === "edit" && tier) {
         setFormValues({
            name: tier.name,
            price: tier.price,
            billing_cadence: tier.billing_cadence,
            benefits: benefitsArray(tier.benefits),
         });
         setAutoRenew(tier.auto_renewal);
      } else {
         setFormValues({
            name: "",
            price: "",
            billing_cadence: "",
            benefits: "",
         });
      }
      setErrors({});
   }, [mode, tier, isOpen]);

   const validateForm = (data) => {
      let newErrors = {};

      if (!data.name.trim()) newErrors.name = "Tier Name is required";
      if (!data.price) newErrors.price = "Price is required";
      if (!data.billing_cadence) newErrors.billing_cadence = "Billing cadence is required";

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      if (!validateForm(formValues)) return;
      const membershipData = {
         ...formValues,
         benefits: benefitsArray(formValues.benefits), 
         auto_renewal: autoRenew,
      };
      console.log('membershipData', membershipData)
      if (mode === "edit") onUpdateTier(membershipData);
      else onSave(membershipData);
   };
   
   const benefitsArray = (benefits = "") => {
      if (Array.isArray(benefits)) return benefits;
      if (typeof benefits !== "string") return [];
      
      return benefits
         .split("\n")
         .map(line => line.trim())
         .filter(line => line !== "");
   };

   return (
      <ProtectedRoute>
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl p-6 md:p-8 transform transition-all duration-300 scale-100 opacity-100 border border-gray-200">
                  <div className="flex justify-between items-start border-b border-gray-200 pb-4 mb-6">
                     <div>
                        <h2 className="text-2xl font-bold text-gray-900"> {mode === "edit" ? "Edit Membership Tier" : "Create Membership Tier"}</h2>
                        <p className="text-gray-600 text-sm mt-1">Define a new membership level for your society</p>
                     </div>
                     <button onClick={onClose} className="text-gray-600 hover:text-gray-900 transition p-1 rounded-full hover:bg-gray-100">
                        <CircleX className="w-6 h-6" />
                     </button>
                  </div>

                  <form onSubmit={handleSubmit}>
                     <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                        <InputField
                           label="Tier Name"
                           name="name"
                           type="text"
                           value={formValues.name}
                           placeholder="e.g., Golden Membership"
                           error={errors?.name}
                           onFocus={() => setErrors(prev => ({ ...prev, name: null }))}
                           onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                        />

                        <div className="grid grid-cols-2 gap-4">
                           <InputField
                              label="Price"
                              name="price"
                              type="number"
                              value={formValues.price}
                              placeholder="Tier Price"
                              error={errors?.price}
                              onFocus={() => setErrors(prev => ({ ...prev, name: null }))}
                              onChange={(e) => setFormValues({ ...formValues, price: e.target.value })}
                           />
                           <InputField
                              label="Billing Cadence"
                              name="billing_cadence"
                              type="select"
                              values={billing_cadences}
                              placeholder=""
                              error={errors?.billing_cadence}
                              onFocus={() => setErrors(prev => ({ ...prev, billing_cadence: null }))}
                              onChange={(e) => setFormValues({ ...formValues, billing_cadence: e.target.value })}
                           />
                        </div>

                        <InputField
                           label="Benefits"
                           name="benefits"
                           type="textarea"
                           value={formValues.benefits}
                           placeholder="List the benefits of this tier"
                           error={errors?.benefits}
                           onFocus={() => setErrors(prev => ({ ...prev, benefits: null }))}
                           onChange={(e) => setFormValues({ ...formValues, benefits: e.target.value })}
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
                           className="px-4 py-2 border border-gray-300 text-gray-800 font-medium rounded-xl hover:bg-gray-100 transition duration-150 shadow-sm cursor-pointer"
                        >
                           Cancel
                        </button>
                        <button
                           className="px-4 py-2 bg-[#FF7A2C] rounded-lg text-white font-medium rounded-lg transition shadow-md cursor-pointer"
                        >
                           {mode === "edit" ? "Update Tier" : "Create Tier"}
                        </button>
                     </div>
                  </form>
            </div>
         </div>
      </ProtectedRoute>
   );
}
