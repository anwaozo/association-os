'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

import AdminDashboard from '@/app/dashboard/AdminDashboard';
import UserDashboard from '@/app/dashboard/UserDashboard';
import ProtectedRoute from '@/app/components/ProtectedRoute';

import { FaUserPlus, FaCalendar, FaEnvelope, FaDownload, FaDollarSign, FaDatabase, FaChartLine } from 'react-icons/fa';

export default function DashboardPage() {
   const { state } = useAuth();
   const isAdmin = state?.user?.role;

   const stats = [
      { title: 'Active Members', value: 312, color: 'green', icon: <FaUserPlus />, 'info': '93% of total' },
      { title: 'Past Due', value: 28, color: 'red', icon: <FaUserPlus />, 'info': '7% of total' },
      { title: 'Upcomming Events', value: 8, color: 'violet', icon: <FaCalendar />, 'info': 'Next 30 days' },
      { title: 'Funds Raised YTD', value: 15, color: 'blue', icon: <FaChartLine />, 'info': '85% of goal' },
   ];

   const actions = [
      {'title': 'Add Member', icon: <FaUserPlus />},
      {'title': 'Create Event', icon: <FaCalendar />},
      {'title': 'Send Message', icon: <FaEnvelope />},
      {'title': 'Import Contact', icon: <FaDownload />},
      {'title': 'Create Tier', icon: <FaDatabase />},
      {'title': 'Create Campaign', icon: <FaDollarSign />},
   ];

   return (
      <ProtectedRoute>
         {isAdmin === 1 ?
            <AdminDashboard stats={stats} actions={actions} />
         : <UserDashboard /> }
      </ProtectedRoute>
   );
}
