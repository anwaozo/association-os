'use client';
import { useState } from 'react';
import { FaCircleXmark } from 'react-icons/fa6';
import InputField from '@/app/components/forms/InputField';
import ToggleSwitch from '@/app/components/forms/ToggleSwitch';

export default function EventAddPage({ isOpen, onClose, onSave }) {
   if (!isOpen) return null;
   const [errors, setErrors] = useState({});

   const [formData, setFormData] = useState({
      title: '', date: '', start_time: '', end_time: '', location: '', capacity: 0, price: 0, description: '', isRSVP: true, isPublic: false
   });
    
    // Controlled state for toggles
    const [isRSVP, setIsRSVP] = useState(true);
    const [isPublic, setIsPublic] = useState(false);

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
      if (!data.start_time || !data.start_time.trim()) {
         newErrors.start_time = 'Time From is required.';
      }
      if (!data.end_time || !data.end_time.trim()) {
         newErrors.end_time = 'Time To is required.';
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
      const eventData = Object.fromEntries(formData.entries()); console.log(eventData);
      if (validateForm(eventData)) {
         eventData.isRSVP = isRSVP;
         eventData.isPublic = isPublic;
         onSave(eventData); 
         //e.target.reset();
      }
   };

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
         <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl p-6 md:p-8 transform transition-all duration-300 scale-100 opacity-100 border border-gray-200">
            <div className="flex justify-between items-start border-b border-gray-200 pb-4 mb-6">
               <div>
                  <h2 className="text-2xl font-bold text-gray-900">Create New Event</h2>
                  <p className="text-gray-600 text-sm mt-1">Fill in the event details and settings</p>
               </div>
               <button onClick={onClose} className="text-gray-600 hover:text-gray-900 transition p-1 rounded-full hover:bg-gray-100">
                  <FaCircleXmark className="w-6 h-6" />
               </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit}>
               <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                  <InputField
                     label="Event Title"
                     name="title"
                     type="text"
                     placeholder="e.g., Annual Gala Dinner"
                     error={errors?.title}
                     onFocus={() => setErrors(prev => ({ ...prev, title: null }))}
                  />

                  <div className="grid grid-cols-3 gap-4">
                     <InputField
                        label="Date"
                        name="date"
                        type="date"
                        placeholder="date"
                        error={errors?.date}
                        onFocus={() => setErrors(prev => ({ ...prev, date: null }))}
                     />
                     <InputField
                        label="Time (From)"
                        name="start_time"
                        type="time"
                        placeholder=""
                        error={errors?.start_time}
                        onFocus={() => setErrors(prev => ({ ...prev, start_time: null }))}
                     />
                     <InputField
                        label="Time (To)"
                        name="end_time"
                        type="time"
                        placeholder=""
                        error={errors?.end_time}
                        onFocus={() => setErrors(prev => ({ ...prev, end_time: null }))}
                     />
                  </div>

                  <label className="block">
                     <InputField
                        label="Location / Link"
                        name="location"
                        type="text"
                        placeholder="e.g., Grand Hall or https://zoom.us/..."
                        error={errors?.location}
                        onFocus={() => setErrors(prev => ({ ...prev, location: null }))}
                     />
                  </label>

                  <div className="grid grid-cols-2 gap-4">
                     <InputField
                        label="Capacity"
                        name="capacity"
                        type="number"
                        placeholder="e.g., 50"
                        error={errors?.capacity}
                        onFocus={() => setErrors(prev => ({ ...prev, capacity: null }))}
                     />
                     <InputField
                        label="Price (Optional)"
                        name="price"
                        type="number"
                        placeholder="Leave empty if free"
                        error={errors?.price}
                        onFocus={() => setErrors(prev => ({ ...prev, price: null }))}
                     />
                  </div>

                  <InputField
                     label="Event Description"
                     name="description"
                     type="textarea"
                     placeholder="Write something about this event"
                     error={errors?.description}
                     onFocus={() => setErrors(prev => ({ ...prev, description: null }))}
                  />

                  <ToggleSwitch
                     label="Enable RSVP"
                     description="Allow members to register for this event"
                     enabled={isRSVP}
                     setEnabled={setIsRSVP}
                  />
                  <ToggleSwitch
                     label="Public Event"
                     description="Show this event on the public landing page"
                     enabled={isPublic}
                     setEnabled={setIsPublic}
                  />
               </div>

               <div className="mt-8 flex justify-end space-x-4 pt-4 border-t border-gray-200">
                  <button
                     onClick={onClose}
                     // Cancel Button: border-gray-300, text-gray-800, hover:bg-gray-100
                     className="px-4 py-2 border border-gray-300 text-gray-800 font-medium rounded-xl hover:bg-gray-100 transition duration-150 shadow-sm"
                  >
                     Cancel
                  </button>
                  <button
                     className="px-4 py-2 bg-orange-600 rounded-lg text-white font-medium rounded-lg transition shadow-md"
                  >
                     Create Event
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
}
