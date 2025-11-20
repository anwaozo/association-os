'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }) {
   const { state } = useAuth();
   const router = useRouter();

   useEffect(() => {
      if (!state.isLoading && !state.isAuthenticated) {
         router.push('/login');
      }
   }, [state.isAuthenticated, state.isLoading, router]);

   if (state.isLoading) return <p>Loading...</p>;

   if (!state.isAuthenticated) return null;

   return children;
}
