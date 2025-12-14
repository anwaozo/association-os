'use client';
import { useState, useEffect } from 'react';
import Header from '@/app/components/Header';
import StatsCard from '@/app/components/StatsCard';
import ContactAddPage from '@/app/contact/add/page';
import ContactImportPage from '@/app/contact/import/page';
import { useApiClient } from "@/lib/apiClient";
import DataTable from '@/app/components/DataTable';

import ProtectedRoute from '@/app/components/ProtectedRoute';
import { useToast } from "@/app/components/toast/ToastContext";
import { Download, Plus, Upload, MoreVertical, Mail, Phone, Pencil, Send, Trash2, Search, Info
} from 'lucide-react';

export default function ContactPage() {
   const api = useApiClient();
   const { showToast } = useToast();
   const [contacts, setContacts] = useState([]);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isImportModalOpen, setIsImportModalOpen] = useState(false);
   const [successMessage, setSuccessMessage] = useState(null);
   const [activeMenuId, setActiveMenuId] = useState(0);
   const [searchTerm, setSearchTerm] = useState('');
   const [statusFilter, setStatusFilter] = useState('All');
   const [modalMode, setModalMode] = useState("add");
   const [selectedContact, setSelectedContact] = useState(null);

   const toggleMenu = (id) => {
      setActiveMenuId(activeMenuId === id ? null : id);
   };

   const stats = [
      { title: 'Total Contacts', value: contacts.length, color: 'bg-green-200'},
      { title: 'Active Members', value: 28, color: 'bg-red-200'},
      { title: 'Past Due', value: 8, color: 'bg-violet-200'},
      { title: 'Prospects', value: 15, color: 'bg-blue-200'},
   ];

   const columns = [
      { key: "id", label: "ID" },
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "role", label: "Role" },
   ];

   const getStatusStyles = (status) => {
      switch (status) {
         case 'Active': return 'bg-green-100 text-green-700';
         case 'Past Due': return 'bg-red-100 text-red-700';
         case 'Lapsed': return 'bg-yellow-100 text-yellow-700';
         case 'Contact': return 'bg-blue-100 text-blue-700';
         default: return 'bg-gray-100 text-gray-700';
      }
   };

   const actions = [
      {
         label: "Edit",
         icon: <Pencil />,
         onClick: (row) => alert(`Edit user: ${row.id}`),
         color: 'black',
      },
      {
         label: "Send Mail",
         icon: <Send />,
         onClick: (row) => alert(`Send mail to: ${row.id}`),
         color: 'black',
      },
      {
         label: "Deactivate",
         icon: <Trash2 />,
         onClick: (row) => alert(`Deactivate user: ${row.id}`),
         color: 'red',
      },
   ];

   const data = [
      { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
      { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Editor" },
      { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "User" },
      { id: 4, name: "Sara Lee", email: "sara@example.com", role: "Editor" },
      { id: 5, name: "John Doe", email: "john@example.com", role: "Admin" },
      { id: 6, name: "Jane Smith", email: "jane@example.com", role: "Editor" },
      { id: 7, name: "Mike Johnson", email: "mike@example.com", role: "User" },
      { id: 8, name: "Sara Lee", email: "sara@example.com", role: "Editor" },
   ];

   const formatToReadableDate = (isoString) => {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", {
         month: "short",
         day: "2-digit",
         year: "numeric",
      });
   };

   useEffect(() => {
      const fetchContacts = async () => {
         const res = await api.get("/contacts");
         if (res.data) {
            setContacts(res.data);
         }
      };
      fetchContacts();
   }, []);

   /** Contact Add New Model Start */
   const openContactAddModal = () => {
      setModalMode("add");
      setSelectedContact(null);
      setIsModalOpen(true);
   };

   const handleAddContact = async (contactData) => {
      const newContact = {
         name: `${contactData.firstName} ${contactData.lastName}`,
         email: contactData.email,
         phone: contactData.phone,
         role: contactData.status
      };

      try {
         const res = await api.post("/auth/register", newContact);
         if(res.status === 200) {
            showToast(`Contact ${newContact.name} added successfully!`);
            setIsModalOpen(false);
            const list = await api.get("/contacts");
            setContacts(list.data);
         } 
      } catch (err) {
      }
   };

   const handleUpdateContact = async (updatedData) => {
      const newContact = {
         name: `${updatedData.firstName} ${updatedData.lastName}`,
         email: updatedData.email,
         phone: updatedData.phone,
         role: updatedData.status
      };
      try {
         await api.put(`/auth/register/${selectedContact.id}`, newContact);
         showToast("Contact updated successfully!", "success");
         const res = await api.get("/contacts");
         setContacts(res.data);
         setIsModalOpen(false);
      } catch (err) {
         showToast("Failed to update contact", "error");
      }
   };

   /** Contact Add New Model End */

   /** Contact Import Model Start */
   const openContactImportModal = () => setIsImportModalOpen(true);

   const handleBulkImport = async (newContacts) => {
      const currentMaxId = contacts.reduce((max, contact) => Math.max(max, contact.id), 0);
      let nextId = currentMaxId + 1;

      const formattedNewContacts = newContacts.map(c => ({
         name: `${c.firstName} ${c.lastName}`,
         email: c.email,
         phone: c.phone,
         role: c.status
      }));

      try {
         const res = await api.post("/auth/bulk_register", { users: formattedNewContacts }, {timeout: 0});
         if(res.status === 200) {
            showToast(`Contact ${formattedNewContacts.length} contacts imported successfully!`);
            setIsModalOpen(false);
            const list = await api.get("/contacts");
            setContacts(list.data);
         } 
      } catch (err) {
         console.error(err);
         showToast("Failed to import contacts", "error");
         return;
      }
      
      setIsImportModalOpen(false);

      setTimeout(() => {
         setSuccessMessage(null);
      }, 3000);
   };
   /** Contact Import Model End */

   const filteredContacts = contacts.filter(contact => {
      const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase());
      //const contactStatus = getContactStatus(contact.date);
      const matchesStatus = statusFilter === "All";
      return matchesSearch && matchesStatus;
   });

   return (
      <ProtectedRoute>
         <Header title="Contacts & Members" subTitle="Manage your organization's contacts and membership" />

         {/* Stats Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((item, i) => (
            <StatsCard key={i} title={item.title} value={item.value} color={item.color} icon={item.icon} />
            ))}
         </div>

         <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
               <div>
                  <h2 className="text-xl font-semibold mb-2">All Contacts</h2>
                  <p className="text-gray-400 mb-4 md:mb-0">View and manage all contacts and members</p>
               </div>

               <div className="flex gap-3">
                  <button className="flex items-center gap-2 bg-[#FF7A2C] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors" onClick={openContactAddModal}>
                     <Plus className="mr-1" /> Add Contact
                  </button>
                     
                  <button className="flex items-center gap-2 border border-gray-300 text-slate-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors" onClick={openContactImportModal}>
                     <Upload className="mr-1" />
                     Import CSV
                  </button>
               </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center mt-10 mb-6 gap-4">
               <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                     type="text" 
                     placeholder="Search by name, number or email..." 
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 border-none rounded-md text-sm focus:ring-2 focus:ring-gray-200 outline-none placeholder-gray-400"
                  />
               </div>

               <div className="flex items-center space-x-3 w-full md:w-auto">
                  <button className="flex items-center px-4 py-2 bg-white text-black border border-gray-600 rounded-lg">
                     All Status
                     <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </button>
                     
                  <button className="flex items-center gap-2 border border-gray-300 text-slate-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                     <Download size={16} />Download
                  </button>
               </div>
            </div>

            {filteredContacts.length > 0 ? (
            <div className="overflow-x-auto">
               <table className="min-w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-semibold">
                     <tr>
                        <th className="p-4 w-10"><input type="checkbox" className="rounded border-gray-300" /></th>
                        <th className="px-6 py-3 text-left">Name</th>
                        <th className="px-6 py-3 text-left">Contact</th>
                        <th className="px-6 py-3 text-left">Status</th>
                        <th className="px-6 py-3 text-left">Tier</th>
                        <th className="px-6 py-3 text-left">Join Date</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                     </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100 text-sm text-gray-800">
                     {filteredContacts.map(contact => (
                     <tr key={contact.id} className="hover:bg-gray-50">
                        <td className="p-4"><input type="checkbox" className="rounded border-gray-300" /></td>
                        <td className="px-6 py-4 font-medium">{contact.name}</td>
                        <td className="px-6 py-4">
                           <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2 text-slate-600">
                                 <Mail size={14} className="text-slate-400" /> {contact.email}
                              </div>
                              {contact.phone && (
                                 <div className="flex items-center gap-2 text-slate-500">
                                    <Phone size={14} className="text-slate-400" /> {contact.phone}
                                 </div>
                              )}
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                              {contact.role === 2 ? 'Member': 'Contact'}
                           </span>
                        </td>
                        <td className="px-6 py-4">{contact.membershipId ? contact?.membership?.name: ''}</td>
                        <td className="px-6 py-4">{formatToReadableDate(contact.createdAt)}</td>
                        <td className="px-6 py-4 text-right relative">
                           <button 
                              onClick={() => toggleMenu(contact.id)}
                              className="p-1 rounded hover:bg-gray-200 text-slate-400 hover:text-slate-600"
                           >
                              <MoreVertical size={18} />
                           </button>

                           {activeMenuId === contact.id && (
                              <div className="absolute right-12 top-8 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-10 py-1">
                                 <button 
                                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-gray-50 flex items-center gap-3"
                                    onClick={() => {
                                       setModalMode("edit");
                                       setSelectedContact(contact);
                                       setIsModalOpen(true);
                                       setActiveMenuId(null);
                                    }}
                                 >
                                    <Pencil size={14} /> Edit
                                 </button>
                                 <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-gray-50 flex items-center gap-3">
                                    <Send size={14} /> Invite Contact
                                 </button>
                                 <div className="h-px bg-gray-100 my-1"></div>
                                 <button className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-3">
                                    <Trash2 size={14} /> Delete Contact
                                 </button>
                              </div>
                           )}
                        </td>
                     </tr>
                     ))}
                  </tbody>
               </table>
            </div>
            ) : (
               <div className="text-center p-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-lg font-medium text-gray-700">No contacts match your current filters.</p>
                  <p className="text-sm text-gray-500 mt-1">Try adjusting the search term or status filter.</p>
               </div>
            )}
         </div>

         {/* <DataTable name="All Contacts" columns={columns} data={data} actions={actions} /> */}

         <ContactAddPage 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAddContact={handleAddContact}
            onUpdateContact={handleUpdateContact}
            mode={modalMode}
            contact={selectedContact}
         />
         <ContactImportPage 
            isOpen={isImportModalOpen}
            onClose={() => setIsImportModalOpen(false)}
            onBulkImport={handleBulkImport}
         />
      </ProtectedRoute>
   );
}
