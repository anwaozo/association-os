'use client';
import { useState, useEffect } from 'react';
import { CircleX } from 'lucide-react';

export default function ContactAddPage({ isOpen, onClose, onAddContact, onUpdateContact, mode = "add", contact = null }) {
   if (!isOpen) return null;
   const [errors, setErrors] = useState({});
   const [formValues, setFormValues] = useState({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      status: "3"
   });

   useEffect(() => {
      if (mode === "edit" && contact) {
         const [firstName = "", lastName = ""] = contact.name?.split(" ") || [];
         setFormValues({
            firstName,
            lastName,
            email: contact.email || "",
            phone: contact.phone || "",
            status: String(contact.role || "3"),
         });
      } else {
         setFormValues({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            status: "3",
         });
      }

      setErrors({});
   }, [mode, contact, isOpen]);

   const validateForm = (data) => {
      let newErrors = {};
      const emailRegex = /\S+@\S+\.\S+/;
      const phoneRegex = /^[6-9][0-9]{9}$/;

      if (!data.firstName.trim()) newErrors.firstName = 'First Name is required.';
      if (!data.lastName.trim()) newErrors.lastName = 'Last Name is required.';
      if (!data.email.trim()) newErrors.email = 'Email is required.';
      else if (!emailRegex.test(data.email)) newErrors.email = 'Invalid email.';

      if (!data.phone.trim()) newErrors.phone = 'Phone Number is required.';
      else if (!phoneRegex.test(data.phone)) newErrors.phone = 'Invalid mobile number.';
      else if (data.phone.length !== 10) newErrors.phone = 'Mobile Number must be 10 digits';

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      if (!validateForm(formValues)) return;
      if (mode === "edit") {
         onUpdateContact(formValues);
      } else {
         onAddContact(formValues);
      }
   };

   const getInputClasses = (fieldName) => {
      return `w-full p-3 border rounded-lg bg-gray-50 focus:ring-orange-500 focus:border-orange-500 ${
         errors[fieldName] ? 'border-red-500' : 'border-gray-200'
      }`;
   };

   return (
      <div 
         className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" 
         onClick={(e) => {
            if (e.target.id === 'contactModalBackdrop') onClose();
         }}
      >
         <div id="contactModalBackdrop" className="absolute inset-0 bg-opacity-70"></div>

         <div className="bg-white w-full max-w-lg mx-auto rounded-xl shadow-2xl relative z-10 p-8 border border-gray-200 transform transition-all duration-300 scale-100 ease-out">
            <div className="flex justify-between items-start mb-6">
               <div>
                  <h2 className="text-2xl font-bold text-gray-900">{mode === "add" ? "Add New Contact" : "Edit Contact"}</h2>
                  <p className="text-gray-500 mt-1">{mode === "add"
                        ? "Enter contact information"
                        : "Update contact information"}</p>
               </div>
               <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                  <CircleX className="w-6 h-6" />
               </button>
            </div>

            <form onSubmit={handleSubmit}>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {/* First Name */}
                  <div>
                     <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                     <input 
                        type="text" 
                        id="firstName" 
                        name="firstName"
                        value={formValues.firstName}
                        placeholder="First name" 
                        className={getInputClasses('firstName')}
                        onFocus={() => setErrors(prev => ({...prev, firstName: null}))}
                        onChange={(e) => setFormValues({ ...formValues, firstName: e.target.value })}
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
                        value={formValues.lastName}
                        placeholder="Last name" 
                        className={getInputClasses('lastName')}
                        onFocus={() => setErrors(prev => ({...prev, lastName: null}))}
                        onChange={(e) => setFormValues({ ...formValues, lastName: e.target.value })}
                     />
                     {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                  </div>
               </div>

               <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                     type="email" 
                     id="email" 
                     name="email" 
                     value={formValues.email}
                     placeholder="Email address" 
                     className={getInputClasses('email')}
                     onFocus={() => setErrors(prev => ({...prev, email: null}))}
                     onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
               </div>

               <div className="mb-6">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input 
                     type="tel" 
                     id="phone" 
                     maxLength={10}
                     name="phone" 
                     value={formValues.phone}
                     placeholder="Phone number" 
                     className={getInputClasses('phone')}
                     onFocus={() => setErrors(prev => ({...prev, phone: null}))} 
                     onChange={(e) => setFormValues({ ...formValues, phone: e.target.value })}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
               </div>

               {/* Status Dropdown */}
               <div className="mb-8">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select 
                     name="status" 
                     value={formValues.status} 
                     onChange={(e) => setFormValues({ ...formValues, status: e.target.value })}
                     className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-orange-500 focus:border-orange-500 appearance-none">
                     <option value="3">Contact</option>
                     <option value="2">Member</option>
                  </select>
               </div>

               {/* Action Buttons */}
               <div className="flex items-center justify-end space-x-3">
                  <button type="submit" className="px-6 py-2 text-white bg-[#FF7A2C] rounded-lg transition font-medium shadow-md">{mode === "add" ? "Add Contact" : "Update Contact"}</button>
                  <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium">Cancel</button>
               </div>
            </form>
         </div>
      </div>
   );
}
