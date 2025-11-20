'use client';
import { useApiClient } from "@/lib/apiClient";
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
   const router = useRouter();
   const api = useApiClient();
   const { setTokens, setUser } = useAuth();
   const [form, setForm] = useState({ email: '', password: '' });
   const [error, setError] = useState('');
   const [showPassword, setShowPassword] = useState(false);

   const handleSubmit = async (e) => {
      e.preventDefault();

      try {
         const res = await api.post("/auth/login", form);
         console.log('res', res);
         if (res.data.accessToken) {
            setTokens(res.data.accessToken, res.data.tokenHash);
            setUser(res.data.user);
            router.push("/dashboard");
         } else {
            const data = await res.json();
            setError(data.message);
            return;
         }
      } catch (err) {
         setError('Something went wrong');
      }
   };

   return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
         <div className="bg-white text-black p-6 rounded-lg shadow-md w-full max-w-sm">
         <h1 className="text-2xl font-semibold mb-4 text-center">
            Login
         </h1>
         <form onSubmit={handleSubmit} className="space-y-4">
            <input
               type="text"
               placeholder="Username"
               className="border p-2 w-full rounded"
               autoComplete='new-username'
               value={form.email}
               onChange={(e) =>
               setForm({ ...form, email: e.target.value })
               }
               required
            />
            <div className="relative">
               <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  autoComplete='new-password'
                  className="border p-2 w-full rounded"
                  value={form.password}
                  onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                  }
                  required
               />
               <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
               >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
               </span>
               {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            <button
               type="submit"
               className="bg-blue-600 text-white w-full py-2 rounded"
            >
               Login
            </button>
         </form>
         </div>
      </div>
   );
}
