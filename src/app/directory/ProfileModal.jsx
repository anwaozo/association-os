
import { Phone, Mail, Linkedin, Globe, X, MapPin, Building2} from 'lucide-react';

export default function ProfileModal ({ member, onClose }) {

   const handleModalClick = (e) => {
      e.stopPropagation();
   };

   const getInitials = (fullName) => {
      const parts = fullName.split(' ');
      if (parts.length === 1) return parts[0][0];
      return parts.slice(0, 2).map(n => n[0]).join('');
   };

   return (
      <div 
         className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" 
         onClick={onClose}
      >
         <div 
            className="bg-white rounded-lg shadow-2xl w-full max-w-lg p-8 overflow-y-auto max-h-[90vh]"
            onClick={handleModalClick}
         >
            <button 
               className="ml-auto top-4 right-4 text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100 transition" 
               onClick={onClose} 
               aria-label="Close profile"
            >
               <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-6">
               <div className="flex items-center justify-center h-20 w-20 rounded-full bg-gray-200 text-lg font-semibold text-gray-700">
                  {getInitials(member.name)}
               </div> 
               <div className="space-y-1">
                  <h2 className="text-xl font-semibold text-gray-900">{member.name}</h2>
                  <p className="text-sm text-gray-600">{member.membership?.name || (member.role === 2 ? 'Member' : 'Contact')}</p>
                  <div className="flex items-center text-sm text-gray-500">
                     <Mail size={14} className="mr-1" /> {member.email}
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                     <Phone size={14} className="mr-1" /> {member.phone}
                  </div>
               </div>
            </div>

            {member.about &&
            <div className="pt-4 border-t border-gray-200">
               <h3 className="text-base font-semibold text-gray-800 mb-2">About</h3>
               <p className="text-sm text-gray-700 leading-relaxed">{member.about}</p>
            </div> }

            {member.tags?.length > 0 &&
            <div className="pt-4 border-t border-gray-200 mt-4">
               <h3 className="text-base font-semibold text-gray-800 mb-3">Areas of Expertise</h3>
               <div className="flex flex-wrap gap-2">
                  {(member.tags || []).map((tag, index) => (
                     <span key={index} className="px-3 py-1 text-xs font-medium text-primary-orange bg-orange-100 rounded-full border border-orange-200">
                        {tag}
                     </span>
                  ))}
               </div>
            </div>
            }

            <div className="pt-4 border-t border-gray-200 mt-4">
               <h3 className="text-base font-semibold text-gray-800 mb-3">Contact & Links</h3>
               
               <a href={`mailto:${member.email}`} className="flex items-center w-full py-2 px-3 mb-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  <Mail className="w-5 h-5 mr-3" /> Send Email
               </a>
               {member.phone && (
                  <a href={`tel:${member.phone}`} className="flex items-center w-full py-2 px-3 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                     <Phone className="w-5 h-5 mr-3" /> Call {member.phone}
                  </a>
               )}
            </div>

            <p className="text text-gray-500 mt-6">
               Member since {member.createdAt ? new Date(member.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
            </p>
         </div>
      </div>
   );
};