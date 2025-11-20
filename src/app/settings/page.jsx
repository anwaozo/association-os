'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import AdminSettings from '@/app/settings/AdminSettings';
import UserSettings from '@/app/settings/UserSettings';
import ProtectedRoute from '@/app/components/ProtectedRoute';

export default function SettingsPage() {
   const { user, role, logout } = useAuth();
   const isAdmin = user?.role;
   
   return (
      <ProtectedRoute>
         {isAdmin === 1 ? <AdminSettings /> : <UserSettings />}
      </ProtectedRoute>
   );
}
