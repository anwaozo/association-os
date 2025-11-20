'use client';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function useFetchUser() {

   const data = {id:1, name:'Vicky', email:'v.vickysp@gmail.com', role:1};

   const { token, setUserData } = useAuth();

   useEffect(() => {
      if (!token) return;

      async function fetchUser() {
         try {
            /*const res = await fetch('/api/me', {
               headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();*/
            setUserData(data);
         } catch (error) {
            console.error('Failed to fetch user data', error);
         }
      }

      fetchUser();
   }, [token, setUserData]);
}
