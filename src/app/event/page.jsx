'use client';
import { useAuth } from '@/context/AuthContext';
import AdminEvent from '@/app/event/AdminEvent';
import UserEvent from '@/app/event/UserEvent';
import ProtectedRoute from '@/app/components/ProtectedRoute';

export default function EventPage() {
   const { state } = useAuth();
   const isAdmin = state?.user?.role;

   return (
      <ProtectedRoute>
         {isAdmin === 1 ? <AdminEvent /> : <UserEvent />}
      </ProtectedRoute>
   );
}