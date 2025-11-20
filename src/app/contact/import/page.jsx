'use client';
import { useState, useRef } from 'react';
import { FaCircleXmark, FaDownload, FaCheck, FaUpload } from 'react-icons/fa6';

export default function ContactImportPage({ isOpen, onClose, onBulkImport }) {
   if (!isOpen) return null;
   const [errors, setErrors] = useState({});
   const [file, setFile] = useState(null);
   const [parsedData, setParsedData] = useState([]);
   const [isLoading, setIsLoading] = useState(false);
   const fileInputRef = useRef(null);

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

   const parseCSV = (csvText) => {
      // Simple line split (handles basic CSV, ignores complex quotes/commas)
      const lines = csvText.split('\n').filter(line => line.trim() !== '');
      if (lines.length === 0) return [];

      // Expected header format: firstName,lastName,email,phone,status (case-insensitive)
      const header = lines[0].toLowerCase().split(',').map(h => h.trim());
      const expectedHeader = ['firstname', 'lastname', 'email', 'phone', 'status'];

      // Basic validation: Check if header matches expected columns (just check length for simplicity)
      if (header.length < 5) {
         console.error("CSV header is invalid or missing columns.");
         return null; // Return null to indicate a failure
      }
      
      const contacts = [];
      for (let i = 1; i < lines.length; i++) {
         const values = lines[i].split(',').map(v => v.trim());
         if (values.length === header.length) {
            const contact = {
               firstName: values[0] || 'N/A',
               lastName: values[1] || 'N/A',
               email: values[2],
               phone: values[3] || 'N/A',
               status: values[4] || 'Contact',
            };
            // Basic email validation on import
            if (contact.email && contact.email.includes('@')) {
               contacts.push(contact);
            }
         }
      }
      return contacts;
   };

   const handleFileChange = (e) => {
      const selectedFile = e.target.files[0];
      if (selectedFile) {
         setFile(selectedFile);
         setParsedData([]); // Clear previous data

         const reader = new FileReader();
         reader.onloadstart = () => setIsLoading(true);
         reader.onload = (event) => {
            const text = event.target.result;
            const data = parseCSV(text);
            if (data) {
               setParsedData(data);
            } else {
               // Note: In a real app, use a custom message box, not alert()
               console.error('Error parsing CSV file. Please check file format.');
            }
            setIsLoading(false);
         };
         reader.onerror = () => {
            // Note: In a real app, use a custom message box, not alert()
            console.error('Error reading file.');
            setIsLoading(false);
         };
         reader.readAsText(selectedFile);
      }
   };

   const handleImportClick = () => {
      if (parsedData.length > 0) {
         onBulkImport(parsedData);
      } else {
            // Note: In a real app, use a custom message box, not alert()
         console.error('No valid contacts to import.');
      }
   };

   const handleDownloadTemplate = () => {
      const csvContent = "firstName,lastName,email,phone,status\nJohn,Doe,john@example.com,(555) 123-4567,Active\nJane,Smith,jane@example.com,(555) 987-6543,Contact";
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'contact_import_template.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
               if (e.target.id === 'importModalBackdrop') onClose();
         }}
      >
         <div id="importModalBackdrop" className="absolute inset-0 bg-opacity-70"></div>

         <div className="bg-white w-full max-w-2xl mx-auto rounded-xl shadow-2xl relative z-10 p-8 border border-gray-200 transform transition-all duration-300 scale-100 ease-out">
               
               {/* Header */}
               <div className="flex justify-between items-start mb-6 border-b pb-4">
                  <div>
                     <h2 className="text-2xl font-bold text-gray-900">Bulk Contact Import (CSV)</h2>
                     <p className="text-gray-500 mt-1">Upload a CSV file to import multiple contacts simultaneously.</p>
                  </div>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                     <FaCircleXmark />
                  </button>
               </div>

               {/* Instructions */}
               <div className="mb-6 space-y-4">
                  <p className="font-semibold text-gray-700">1. Prepare your data</p>
                  <ul className="text-sm text-gray-600 list-disc list-inside space-y-1 ml-4">
                     <li>Your file must be a comma-separated values (.csv) file.</li>
                     <li>It must contain the following columns in the **first row**: <code className="font-mono text-xs bg-gray-100 p-1 rounded">firstName</code>, <code className="font-mono text-xs bg-gray-100 p-1 rounded">lastName</code>, <code className="font-mono text-xs bg-gray-100 p-1 rounded">email</code>, <code className="font-mono text-xs bg-gray-100 p-1 rounded">phone</code>, <code className="font-mono text-xs bg-gray-100 p-1 rounded">status</code>.</li>
                     <li><code className="font-mono text-xs bg-gray-100 p-1 rounded">email</code> is required for each entry.</li>
                  </ul>
                  <button 
                     onClick={handleDownloadTemplate}
                     className="flex items-center text-sm px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium border border-gray-300"
                  >
                     <FaDownload className="w-4 h-4 mr-1" />
                     Download Template CSV
                  </button>
               </div>

               {/* File Upload Area */}
               <div 
                  className="p-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-orange-500 transition"
                  onClick={() => fileInputRef.current.click()}
               >
                  <input 
                     ref={fileInputRef}
                     type="file" 
                     accept=".csv" 
                     onChange={handleFileChange} 
                     className="hidden"
                  />
                  
                  {file ? (
                     <div className="flex items-center justify-center text-center text-green-700">
                           <FaCheck className="w-5 h-5 mr-2" />
                           <span className="font-semibold">{file.name}</span>
                     </div>
                  ) : (
                     <div className="text-center">
                           <FaUpload className="w-10 h-10 mx-auto text-gray-400" />
                           <p className="mt-2 text-sm text-gray-600">Drag and drop your CSV file here, or <span className="text-orange-600 font-medium">click to browse</span></p>
                           <p className="text-xs text-gray-500 mt-1">Maximum file size: 5MB</p>
                     </div>
                  )}
               </div>

               {/* Summary / Status */}
               <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  {isLoading ? (
                     <p className="text-center text-orange-600 font-medium">Processing file... Please wait.</p>
                  ) : parsedData.length > 0 ? (
                     <p className="font-medium text-gray-700 flex items-center">
                           <FaCheck className="w-4 h-4 text-green-600 mr-1" />
                           File ready: <span className="font-bold ml-1 text-green-700">{parsedData.length} contacts</span> found for import.
                     </p>
                  ) : file && !isLoading ? (
                        <p className="font-medium text-gray-700 flex items-center">
                           <FaCircleXmark className="w-4 h-4 text-red-600 mr-1" />
                           File selected, but no valid contacts found. Check format.
                     </p>
                  ) : (
                     <p className="text-sm text-gray-500">Select a file above to see the import summary.</p>
                  )}
               </div>


               {/* Action Buttons */}
               <div className="flex justify-end space-x-4 mt-8">
                  <button type="button" onClick={onClose} className="px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium">
                     Cancel
                  </button>
                  <button 
                     type="button" 
                     onClick={handleImportClick} 
                     disabled={parsedData.length === 0 || isLoading}
                     className={`px-4 py-3 text-white rounded-lg transition font-medium shadow-md ${
                           parsedData.length > 0 && !isLoading 
                              ? 'bg-orange-600 hover:bg-orange-700' 
                              : 'bg-orange-400 cursor-not-allowed opacity-70'
                     }`}
                  >
                     Import {parsedData.length} Contacts
                  </button>
               </div>
         </div>
      </div>
   );
}