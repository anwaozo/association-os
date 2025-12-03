'use client';
import { useState } from 'react';
import InputField from '@/app/components/forms/InputField';
import MultiSelect from '@/app/components/forms/MultiSelect';
import { FaChevronLeft, FaEnvelope, FaChevronDown, FaFileAlt, FaEye } from 'react-icons/fa';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { Mail } from 'lucide-react';

export default function MessageAddPage() {
   const [isOpen, setIsOpen] = useState(true);
   const [errors, setErrors] = useState({});
   const [notificationType, setNotificationType] = useState('Email');

   const options = [
      { value: 'mobile', label: 'Mobile Phones' },
      { value: 'accessories', label: 'Accessories' }, 
      { value: 'repairs', label: 'Repairs' },
      { value: 'warranty', label: 'Warranty Services' },
   ];
   const [selected, setSelected] = useState(['mobile']);

   const notificationTypes = [{id:1, value:'Email'}, {id:2, value:'SMS'}];
   const templates = [{id:1, value:'Welcome Template'}, {id:2, value:'Event Reminder'}];
   const audienceTypes = [{id:'All Members', value:'All Members'}, {id:'Active Members', value:'Active Members'}, {id:'Past Due', value:'Past Due'}, {id:'Event Attendees', value:'Event Attendees'}, {id:'Student Tier', value:'Student Tier'}, {id:'Professional Tier', value:'Professional Tier'}, {id:'Monthly Professional Tier', value:'Monthly Professional Tier'}, {id:'Patron Tier', value:'Patron Tier'}, {id:'Custom Selection', value:'Custom Selection'}];

   const composeMessageFormInitialState = {
      notification_type: '',
      template: '',
      audience: '',
      subject: '',
      message: ''
   };
   const [composeMessageForm, setComposeMessageForm] = useState(composeMessageFormInitialState);

   const handleTemplateChange = (e) => {
      const template = MOCK_TEMPLATES.find(t => t.label === e.target.value);
      setSelectedTemplate(template);
      setSubject(template.subject);
      setMessageBody(template.body);
   };

   const onBack = () => {
      window.history.back();
   }

   const handleSend = () => {
      // Mock send logic
      console.log({
         type: notificationType,
         audience: audience,
         subject: subject,
         body: messageBody
      });
      // On successful send, return to the main log page
      onCancel(); 
      console.log('Message sent successfully (mock action)!');
   };


   // Shows the first three lines of the message body for preview
   const previewBody = composeMessageForm.message.split('\n').slice(0, 3).join('\n'); 
   
   return (
      <ProtectedRoute>
         <div className="space-y-6">
            {/* Breadcrumb / Back Link */}
            <nav className="flex items-center space-x-2 text-sm text-black-500 font-medium">
               <button onClick={onBack} className="flex items-center hover:text-[#FF884D] transition">
                  <Mail className="w-5 h-4 mr-0.5" /> Messages
               </button>
               <span><FaChevronLeft /></span>
               <span className="text-gray-900 truncate max-w-xs">Compose Message</span>
            </nav>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6">
               <div className="flex flex-wrap items-center space-x-4 mb-4 sm:mb-0">
                  <h1 className="text-3xl font-bold text-gray-900">Compose New Message</h1>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
               {/* Form Section (Takes 2/3 width on large screens) */}
               <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-x-6 gap-y-5">
                        
                     {/* Notification Type */}
                     <InputField
                        label="Notification Type"
                        name="notification_type"
                        type="select"
                        values={notificationTypes}
                        placeholder=""
                        error={errors?.notification_type}
                        onFocus={() => setErrors(prev => ({ ...prev, notification_type: null }))}
                     />
                     <InputField
                        label="Template"
                        name="template"
                        type="select"
                        values={templates}
                        placeholder=""
                        error={errors?.template}
                        onFocus={() => setErrors(prev => ({ ...prev, template: null }))}
                     />
                     <InputField
                        label="Audience"
                        name="audience"
                        type="select"
                        values={audienceTypes}
                        placeholder=""
                        error={errors?.audience}
                        onFocus={() => setErrors(prev => ({ ...prev, audience: null }))}
                        onChange={(e) => setComposeMessageForm({ ...composeMessageForm, audience: e.target.value })}
                     />
                     {composeMessageForm.audience === 'Custom Selection' && (
                        <MultiSelect
                           label="Recipient(s) Name"
                           name="recipients"
                           options={options}
                           value={selected}
                           onChange={setSelected}
                           placeholder="Search your recipient name"
                        />
                     )}
                     {composeMessageForm.audience === 'Event Attendees' && (
                        <MultiSelect
                           label="Event Title"
                           name="event_title"
                           options={options}
                           value={selected}
                           onChange={setSelected}
                           placeholder="Search your recipient name"
                        />
                     )}
                     <InputField
                        label="Subject"
                        name="subject"
                        type="text"
                        placeholder="eg., All Members"
                        error={errors?.subject}
                        onFocus={() => setErrors(prev => ({ ...prev, subject: null }))}
                        onChange={(e) => setComposeMessageForm({ ...composeMessageForm, subject: e.target.value })}
                     />
                     <InputField
                        label="Message"
                        name="message"
                        type="textarea"
                        placeholder="eg., Write your message here..."
                        error={errors?.message}
                        onFocus={() => setErrors(prev => ({ ...prev, message: null }))}
                        onChange={(e) => setComposeMessageForm({ ...composeMessageForm, message: e.target.value })}
                     />

                     {/* Image Upload */}
                     <div className="mt-5 flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                           <label htmlFor="file-upload" 
                                 className="flex-1 w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 bg-gray-50 text-gray-700 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 transition-colors text-sm font-medium">
                              <FaFileAlt className="w-4 h-4 mr-2" /> Choose file
                              <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                           </label>
                           <span className="text-gray-500 text-sm">No file chosen</span>
                           <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium whitespace-nowrap">
                              + Add Attachment
                           </button>
                     </div>

                  </div>
               </div>

               {/* Preview Panel (Takes 1/3 width on large screens) */}
               <div className="lg:col-span-2">
                  <div className="sticky top-6 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                     <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        Preview
                     </h3>
                     
                     <div className="border border-gray-300 bg-orange-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-600 mb-2">To: {composeMessageForm.audience || audienceTypes[0].value}</p>
                        <h4 className="text-base font-semibold text-gray-900 mb-3 border-b pb-2 border-gray-200">
                           {composeMessageForm.subject || 'No Subject'}
                        </h4>
                        <div className="text-sm text-gray-800 whitespace-pre-line">
                           {composeMessageForm.message ? previewBody : 'No message body.'}
                        </div>
                        {composeMessageForm.message.split('\n').length > 3 && (
                           <p className="text-xs text-gray-500 mt-2">
                                 [Message preview truncated. Full message visible on mobile.]
                           </p>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </ProtectedRoute>
   );
}
