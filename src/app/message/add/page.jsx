'use client';
import { useState } from 'react';
import InputField from '@/app/components/forms/InputField';
import MultiSelect from '@/app/components/forms/MultiSelect';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { Mail, Paperclip, ChevronLeft, X } from 'lucide-react';

export default function MessageAddPage() {
   const [errors, setErrors] = useState({});
   const [attachments, setAttachments] = useState([{ file: null }]);

   const handleFileChange = (e, index) => {
      const newFiles = [...attachments];
      newFiles[index].file = e.target.files[0];
      setAttachments(newFiles);
   };

   const addAttachment = () => {
      setAttachments([...attachments, { file: null }]);
   };

   const removeAttachment = (index) => {
      const updated = attachments.filter((_, i) => i !== index);
      setAttachments(updated);
   };

   const options = [
      { value: 'mobile', label: 'Mobile Phones' },
      { value: 'accessories', label: 'Accessories' }, 
      { value: 'repairs', label: 'Repairs' },
      { value: 'warranty', label: 'Warranty Services' },
   ];
   const [selected, setSelected] = useState(['mobile']);

   const notificationTypes = [
      { id: "Email", value: "Email" },
      { id: "SMS",   value: "SMS" }
   ];

   const templates = [
      { id: "Blank Template",  value: "Blank Template" },
      { id: "Welcome Email",   value: "Welcome Email" },
      { id: "Due Receipt",     value: "Due Receipt" },
      { id: "Due Reminder",    value: "Due Reminder" },
      { id: "New Event",       value: "New Event" },
      { id: "Event Reminder",  value: "Event Reminder" }
   ];

   const audienceTypes = [
      { id: "All Members",             value: "All Members" },
      { id: "Active Members",          value: "Active Members" },
      { id: "Past Due",                value: "Past Due" },
      { id: "Event Attendees",         value: "Event Attendees" },
      { id: "Student Tier",            value: "Student Tier" },
      { id: "Professional Tier",       value: "Professional Tier" },
      { id: "Monthly Professional Tier", value: "Monthly Professional Tier" },
      { id: "Patron Tier",             value: "Patron Tier" },
      { id: "Custom Selection",        value: "Custom Selection" }
   ];


   const composeMessageFormInitialState = {
      notification_type: '',
      template: '',
      audience: '',
      event_title: '',
      recipients: '',
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

   const validateForm = (data) => {
      let newErrors = {};

      if (!data.notification_type || !data.notification_type.trim()) {
         newErrors.notification_type = 'Notification Type is required.';
      }
      if (!data.template || !data.template.trim()) {
         newErrors.template = 'Template is required.';
      }
      if (!data.audience || !data.audience.trim()) {
         newErrors.audience = 'Audience is required.';
      }
      if(data.audience === 'Custom Selection'){
         if (!composeMessageForm.recipients.length) {
            newErrors.recipients = 'Recipients is required.';
         }
      }
      if(data.audience === 'Event Attendees'){
         if (!composeMessageForm.event_title.length) {
            newErrors.event_title = 'Event Title is required.';
         }
      }
      if (!data.subject || !data.subject.trim()) {
         newErrors.subject = 'Subject is required.';
      }
      if (!data.message || !data.message.trim()) {
         newErrors.message = 'Message is required.';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const send_now = () => {
      if (validateForm(composeMessageForm)) {
         console.log('composeMessageForm', 'send Now', composeMessageForm);
      }
   }

   const save_template = () => {
      if (validateForm(composeMessageForm)) {
         console.log('composeMessageForm', 'save_template', composeMessageForm);
      }
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
            <nav className="flex items-center space-x-2 text-sm text-black-500 font-medium">
               <button onClick={onBack} className="flex items-center hover:text-[var(--brand)] transition">
                  <Mail className="w-5 h-4 mr-1" /> Messages
               </button>
               <span><ChevronLeft /></span>
               <span className="text-gray-900 truncate max-w-xs">Compose Message</span>
            </nav>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6">
               <div className="flex flex-wrap items-center space-x-4 mb-4 sm:mb-0">
                  <h1 className="text-3xl font-bold text-gray-900">Compose New Message</h1>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
               <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-x-6 gap-y-5">
                     <InputField
                        label="Notification Type"
                        name="notification_type"
                        type="select"
                        values={notificationTypes}
                        placeholder=""
                        error={errors?.notification_type}
                        onFocus={() => setErrors(prev => ({ ...prev, notification_type: null }))}
                        onChange={(e) => setComposeMessageForm({ ...composeMessageForm, notification_type: e.target.value })}
                     />
                     <InputField
                        label="Template"
                        name="template"
                        type="select"
                        values={templates}
                        placeholder=""
                        error={errors?.template}
                        onFocus={() => setErrors(prev => ({ ...prev, template: null }))}
                        onChange={(e) => setComposeMessageForm({ ...composeMessageForm, template: e.target.value })}
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
                           placeholder="Search your recipient name"
                           onFocus={() => setErrors(prev => ({ ...prev, recipients: null }))}
                           onChange={(selectedValues) =>
                              setComposeMessageForm({
                                 ...composeMessageForm,
                                 recipients: selectedValues
                              })
                           }
                           error={errors.recipients}
                        />
                     )}
                     {composeMessageForm.audience === 'Event Attendees' && (
                        <MultiSelect
                           label="Event Title"
                           name="event_title"
                           options={options}
                           value={selected}
                           placeholder="Event Title"
                           onFocus={() => setErrors(prev => ({ ...prev, event_title: null }))}
                           onChange={(selectedValues) =>
                              setComposeMessageForm({
                                 ...composeMessageForm,
                                 event_title: selectedValues
                              })
                           }
                           error={errors.event_title}
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

                     <div className="mt-5">
                        {attachments.map((att, index) => (
                           <div key={index} className="flex items-center mb-3">
                              <label
                                 className="flex-1 inline-flex items-center px-4 py-2 border border-gray-300 bg-gray-50 
                                 text-gray-700 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 transition-colors 
                                 text-sm font-medium"
                              >
                                 <Paperclip className="w-4 h-4 mr-2" />
                                 {att.file ? att.file.name : "Choose file"}
                                 <input
                                    type="file"
                                    className="sr-only"
                                    onChange={(e) => handleFileChange(e, index)}
                                 />
                              </label>

                              {attachments.length > 1 && (
                                 <button
                                    onClick={() => removeAttachment(index)}
                                    className="ml-2 text-red-500 hover:text-red-700"
                                 >
                                    <X className="w-5 h-5" />
                                 </button>
                              )}
                           </div>
                        ))}

                        <button
                           onClick={addAttachment}
                           className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mt-2"
                        >
                           + Add Attachment
                        </button>
                     </div>
                     <div className="flex items-center justify-end space-x-3">
                        <button type="submit" onClick={send_now} className="px-6 py-2 text-white bg-[var(--brand)] rounded-lg transition font-medium shadow-md">Send Now</button>
                        <button type="button" onClick={save_template} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium">Save as template</button>
                     </div>
                  </div>
               </div>

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
