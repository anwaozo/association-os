'use client';
import { useAuth } from '@/context/AuthContext';

import AdminDashboard from '@/app/dashboard/AdminDashboard';
import UserDashboard from '@/app/dashboard/UserDashboard';
import ProtectedRoute from '@/app/components/ProtectedRoute';

export default function DashboardPage() {
   const { state } = useAuth();
   const isAdmin = state?.user?.role;

   return (
      <ProtectedRoute>
         {isAdmin === 1 ?
            <AdminDashboard />
         : <UserDashboard /> }
      </ProtectedRoute>
   );
}
