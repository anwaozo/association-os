'use client';
import { Fragment, useState } from 'react';

export default function SettingsPage() {
   return (
      <div className="flex items-center space-x-6">
         <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-light text-gray-600 border border-gray-300">
         SJ
         </div>
         <div>
         <div className="flex items-center">
            <h3 className="text-xl font-semibold text-gray-900 mr-2">John Doe</h3>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">Professional Member</span>
         </div>
         <p className="text-gray-600">Senior Product Manager at Tech Corp</p>
         <button className="text-sm text-indigo-600 hover:text-indigo-800 mt-1 font-medium">Change Profile Picture</button>
         </div>
      </div>
   );
}