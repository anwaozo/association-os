'use client';
import { useState, useEffect } from 'react';
import { CircleX } from 'lucide-react';
import InputField from '@/app/components/forms/InputField';
import ToggleSwitch from '@/app/components/forms/ToggleSwitch';

export default function EventAddPage({ isOpen, onClose, onSave, onUpdateEvent, mode = "add", event = null }) {
   if (!isOpen) return null;
   const [errors, setErrors] = useState({});
   const [isRSVP, setIsRSVP] = useState(true);
   const [isPublic, setIsPublic] = useState(false);
   const [formValues, setFormValues] = useState({
      title: "",
      date: "",
      start_time: "",
      end_time: "",
      location: "",
      capacity: "",
      price: "",
      description: "",
   });

   useEffect(() => {
      if (mode === "edit" && event) {
         const formatDate = (iso) =>
            iso ? iso.split("T")[0] : "";

         const formatTime = (iso) =>
            iso ? iso.split("T")[1].substring(0, 5) : "";

         setFormValues({
            title: event.title,
            date: formatDate(event.date),
            start_time: event.start_time,
            end_time: event.end_time,
            location: event.location,
            capacity: event.capacity,
            price: event.price,
            description: event.description,
         });
         setIsRSVP(event.isRSVP);
         setIsPublic(event.isPublic);
      } else {
         setFormValues({
            title: "",
            date: "",
            start_time: "",
            end_time: "",
            location: "",
            capacity: "",
            price: "",
            description: "",
            isRSVP: "",
            isPublic: "",
         });
      }
      setErrors({});
   }, [mode, event, isOpen]);

   const validateForm = (data) => {
      let newErrors = {};
      if (!data.title.trim()) newErrors.title = "Title is required";
      if (!data.date) newErrors.date = "Date is required";
      if (!data.start_time) newErrors.start_time = "Start time is required";
      if (!data.end_time) newErrors.end_time = "End time is required";
      if (!data.location.trim()) newErrors.location = "Location is required";
      if (!data.capacity) newErrors.capacity = "Capacity is required";

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      if (!validateForm(formValues)) return;
      const eventData = {
         ...formValues,
         isRSVP,
         isPublic
      };
      if (mode === "edit") onUpdateEvent(eventData);
      else onSave(eventData);
      
   };

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
         <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl p-6 md:p-8 transform transition-all duration-300 scale-100 opacity-100 border border-gray-200">
            <div className="flex justify-between items-start border-b border-gray-200 pb-4 mb-6">
               <div>
                  <h2 className="text-2xl font-bold text-gray-900">{mode === "edit" ? "Edit Event" : "Create New Event"}</h2>
                  <p className="text-gray-600 text-sm mt-1">Fill in the event details and settings</p>
               </div>
               <button onClick={onClose} className="text-gray-600 hover:text-gray-900 transition p-1 rounded-full hover:bg-gray-100">
                  <CircleX className="w-6 h-6" />
               </button>
            </div>

            <form onSubmit={handleSubmit}>
               <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                  <InputField
                     label="Event Title"
                     name="title"
                     type="text"
                     value={formValues.title}
                     placeholder="e.g., Annual Gala Dinner"
                     onFocus={() => setErrors(prev => ({ ...prev, title: null }))}
                     onChange={(e) => setFormValues({ ...formValues, title: e.target.value })}
                     error={errors?.title}
                  />

                  <div className="grid grid-cols-3 gap-4">
                     <InputField
                        label="Date"
                        name="date"
                        type="date"
                        value={formValues.date}
                        placeholder="date"
                        error={errors?.date}
                        onFocus={() => setErrors(prev => ({ ...prev, date: null }))}
                        onChange={(e) => setFormValues({ ...formValues, date: e.target.value })}
                     />
                     <InputField
                        label="Time (From)"
                        name="start_time"
                        type="time"
                        value={formValues.start_time}
                        placeholder=""
                        error={errors?.start_time}
                        onFocus={() => setErrors(prev => ({ ...prev, start_time: null }))}
                        onChange={(e) => setFormValues({ ...formValues, start_time: e.target.value })}
                     />
                     <InputField
                        label="Time (To)"
                        name="end_time"
                        type="time"
                        value={formValues.end_time}
                        placeholder=""
                        error={errors?.end_time}
                        onFocus={() => setErrors(prev => ({ ...prev, end_time: null }))}
                        onChange={(e) => setFormValues({ ...formValues, end_time: e.target.value })}
                     />
                  </div>

                  <label className="block">
                     <InputField
                        label="Location / Link"
                        name="location"
                        type="text"
                        value={formValues.location}
                        placeholder="e.g., Grand Hall or https://zoom.us/..."
                        error={errors?.location}
                        onFocus={() => setErrors(prev => ({ ...prev, location: null }))}
                        onChange={(e) => setFormValues({ ...formValues, location: e.target.value })}
                     />
                  </label>

                  <div className="grid grid-cols-2 gap-4">
                     <InputField
                        label="Capacity"
                        name="capacity"
                        type="number"
                        value={formValues.capacity}
                        placeholder="e.g., 50"
                        error={errors?.capacity}
                        onFocus={() => setErrors(prev => ({ ...prev, capacity: null }))}
                        onChange={(e) => setFormValues({ ...formValues, capacity: e.target.value })}
                     />
                     <InputField
                        label="Price (Optional)"
                        name="price"
                        type="number"
                        value={formValues.price}
                        placeholder="Leave empty if free"
                        error={errors?.price}
                        onFocus={() => setErrors(prev => ({ ...prev, price: null }))}
                        onChange={(e) => setFormValues({ ...formValues, price: e.target.value })}
                     />
                  </div>

                  <InputField
                     label="Event Description"
                     name="description"
                     type="textarea"
                     value={formValues.description}
                     placeholder="Write something about this event"
                     error={errors?.description}
                     onFocus={() => setErrors(prev => ({ ...prev, description: null }))}
                     onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
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
                     className="px-4 py-2 border border-gray-300 text-gray-800 font-medium rounded-xl hover:bg-gray-100 transition duration-150 shadow-sm cursor-pointer"
                  >
                     Cancel
                  </button>
                  <button
                     className="px-4 py-2 bg-[var(--brand)] rounded-lg text-white font-medium rounded-lg transition shadow-md cursor-pointer"
                  >
                     {mode === "edit" ? "Update Event" : "Create Event"}
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
}
