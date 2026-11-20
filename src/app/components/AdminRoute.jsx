'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/app/components/ProtectedRoute';

// Logged-in organization admins only. Members are sent to their home page.
export default function AdminRoute({ children }) {
   const { state } = useAuth();
   const router = useRouter();
   const isAdmin = state?.user?.role === 1;

   useEffect(() => {
      if (state.isAuthenticated && !state.isLoading && !isAdmin) router.replace('/dashboard');
   }, [state.isAuthenticated, state.isLoading, isAdmin, router]);

   return <ProtectedRoute>{isAdmin ? children : null}</ProtectedRoute>;
}
