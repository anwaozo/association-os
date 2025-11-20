'use client';
import { useState } from 'react';
import { FaCircleXmark } from 'react-icons/fa6';

export default function ContactAddPage({ isOpen, onClose, onAddContact }) {
   if (!isOpen) return null;
   const [errors, setErrors] = useState({});

   const validateForm = (data) => {
      let newErrors = {};
      const emailRegex = /\S+@\S+\.\S+/;
      const phoneRegex = /^[6-9][0-9]{9}$/;

      if (!data.firstName || !data.firstName.trim()) {
         newErrors.firstName = 'First Name is required.';
      }
      if (!data.lastName || !data.lastName.trim()) {
         newErrors.lastName = 'Last Name is required.';
      }
      if (!data.email || !data.email.trim()) {
         newErrors.email = 'Email is required.';
      } else if (!emailRegex.test(data.email)) {
         newErrors.email = 'Please enter a valid email address.';
      }
      if (!data.phone || !data.phone.trim()) {
         newErrors.phone = 'Phone Number is required.';
      } else if (!phoneRegex.test(data.phone)) {
         newErrors.phone = 'Please enter a valid phone number.';
      } else if (data.phone.length !=10) {
         newErrors.phone = 'Mobile Number must be 10 Digits';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const contactData = Object.fromEntries(formData.entries());
      if (validateForm(contactData)) {
         onAddContact(contactData); 
         e.target.reset();
      }
   };

   const getInputClasses = (fieldName) => {
      return `w-full p-3 border rounded-lg bg-gray-50 focus:ring-orange-500 focus:border-orange-500 ${
         errors[fieldName] ? 'border-red-500' : 'border-gray-200'
      }`;
   };

   return (
      <div 
         className="fixed inset-0 z-50 flex items-center justify-center p-4" 
         onClick={(e) => {
               if (e.target.id === 'contactModalBackdrop') onClose();
         }}
      >
         {/* Modal Backdrop Overlay */}
         <div id="contactModalBackdrop" className="absolute inset-0 bg-opacity-70"></div>

         {/* Modal Content */}
         <div className="bg-white w-full max-w-lg mx-auto rounded-xl shadow-2xl relative z-10 p-8 border border-gray-200 transform transition-all duration-300 scale-100 ease-out">
            {/* Header and Close Button */}
            <div className="flex justify-between items-start mb-6">
               <div>
                  <h2 className="text-2xl font-bold text-gray-900">Add New Contact</h2>
                  <p className="text-gray-500 mt-1">Enter contact information to add to your database</p>
               </div>
               {/* Close Button (X icon) */}
               <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                  <FaCircleXmark />
               </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit}>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {/* First Name */}
                  <div>
                     <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                     <input 
                        type="text" 
                        id="firstName" 
                        name="firstName" 
                        placeholder="First name" 
                        className={getInputClasses('firstName')}
                        onFocus={() => setErrors(prev => ({...prev, firstName: null}))}
                     />
                     {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  {/* Last Name */}
                  <div>
                     <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                     <input 
                        type="text" 
                        id="lastName" 
                        name="lastName" 
                        placeholder="Last name" 
                        className={getInputClasses('lastName')}
                        onFocus={() => setErrors(prev => ({...prev, lastName: null}))}
                     />
                     {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                  </div>
               </div>

               {/* Email */}
               <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                     type="email" 
                     id="email" 
                     name="email" 
                     placeholder="Email address" 
                     className={getInputClasses('email')}
                     onFocus={() => setErrors(prev => ({...prev, email: null}))}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
               </div>

               {/* Phone */}
               <div className="mb-6">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input 
                     type="tel" 
                     id="phone" 
                     maxLength={10}
                     name="phone" 
                     placeholder="Phone number" 
                     className={getInputClasses('phone')}
                     onFocus={() => setErrors(prev => ({...prev, phone: null}))} 
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
               </div>

               {/* Status Dropdown */}
               <div className="mb-8">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select id="status" name="status" className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-orange-500 focus:border-orange-500 appearance-none">
                     <option value="3">Contact</option>
                     <option value="2">Member</option>
                  </select>
               </div>

               {/* Action Buttons */}
               <div className="flex items-center justify-end space-x-3">
                  <button type="submit" className="px-6 py-2 text-white bg-[#FF7A2C] rounded-lg transition font-medium shadow-md">Add Contact</button>
                  <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium">Cancel</button>
               </div>
            </form>
         </div>
      </div>
   );
}
