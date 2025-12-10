'use client';
import { Fragment, useState } from 'react';
import InputField from '@/app/components/forms/InputField';

export default function Security() {
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
         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Security</h3>
            <p className="text-sm text-gray-600 mb-6">Manage your password and security settings</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
               <InputField label="Current Password" id="currentPassword" type="password" />
               <InputField label="New Password" id="newPassword" type="password" />
               <InputField label="Confirm New Password" id="confirmNewPassword" type="password" />
            </div>
         </div>
         
      </div>
   );
}