'use client';
import { Fragment, useState } from 'react';
import InputField from '@/app/components/forms/InputField';

export default function SettingsPage() {
   const profileData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '(555) 123-4567',
    location: 'New York, NY',
    jobTitle: 'Senior Product Manager',
    company: 'Tech Corp',
    industry: 'Technology',
    linkedIn: 'https://linkedin.com/in/...',
    website: 'https://...',
    bio: 'Tell other members about yourself...',
    areasOfExpertise: 'Product Management, Technology, Leadership',
  };
   return (
      <div className="space-y-8">
         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center gap-6">
         <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-3xl font-bold text-gray-700 flex-shrink-0">
            SJ 
         </div>
         <div>
            <div className="flex items-center gap-2 mb-1">
               <h3 className="text-xl font-bold text-gray-900">John Doe</h3>
               <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
               Professional Member
               </span>
            </div>
            <p className="text-gray-600 mb-2">Senior Product Manager at Tech Corp</p>
            <button className="text-sm font-medium text-primary-orange hover:underline">
               Change Profile Picture
            </button>
         </div>
         </div>

         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
         <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Information</h3>
         <p className="text-sm text-gray-600 mb-6">Manage your profile information and privacy settings</p>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <InputField label="First Name" id="firstName" value={profileData.firstName} />
            <InputField label="Last Name" id="lastName" value={profileData.lastName} />
            <InputField label="Email Address" id="email" type="email" value={profileData.email} readOnly />
            <InputField label="Phone Number" id="phone" type="tel" value={profileData.phone} />
            <InputField label="Location" id="location" value={profileData.location} className="md:col-span-2" />
         </div>
         </div>

         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
         <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional Information</h3>
         <p className="text-sm text-gray-600 mb-6">Share your professional background with other members</p>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <InputField label="Job Title" id="jobTitle" value={profileData.jobTitle} />
            <InputField label="Company" id="company" value={profileData.company} />
            <InputField label="Industry" id="industry" value={profileData.industry} />
            <InputField 
               label="LinkedIn URL" 
               id="linkedIn" 
               value={profileData.linkedIn} 
               placeholder="https://linkedin.com/in/..."
            />
            <InputField 
               label="Personal Website" 
               id="website" 
               value={profileData.website} 
               placeholder="https://..."
            />
            <div className="md:col-span-2"> {/* Bio spans full width */}
               <InputField label="Bio" type="textarea" id="bio" value={profileData.bio} rows={3} />
            </div>
            <div className="md:col-span-2"> {/* Areas of Expertise spans full width */}
               <InputField 
               label="Areas of Expertise (comma-separated)" 
               type="textarea"
               id="areasOfExpertise" 
               value={profileData.areasOfExpertise} 
               rows={2} 
               />
            </div>
         </div>
         </div>
      </div>
   );
}