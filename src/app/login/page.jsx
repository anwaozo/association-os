'use client';
import { useApiClient } from "@/lib/apiClient";
import { useAuth } from '@/context/AuthContext';
import { useState, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Eye, 
  EyeOff 
} from 'lucide-react';
import Header from '@/app/header';
import Link from 'next/link';

export default function LoginPage() {
   const router = useRouter();
   const api = useApiClient();
   const { setTokens, setUser } = useAuth();
   const [form, setForm] = useState({ email: '', password: '' });
   const [error, setError] = useState('');
   const [showPassword, setShowPassword] = useState(false);
   const [userType, setUserType] = useState('member');
   const [loading, setLoading] = useState(false);

   const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
         const res = await api.post("/auth/login", form);
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
      setLoading(false);
   };

   return (
      <Fragment>
         <Header />
         <div className="pt-20">
            <div className="bg-gray-200 flex-grow flex items-center pt-10 justify-center py-20 px-4 sm:px-6 lg:px-8 ">
               <div className="max-w-md w-full pt-5 space-y-5 text-center">
                  <h1 className="text-2xl font-bold text-gray-900">Welcome back to Friar Society</h1>
                  <p className="text-md text-gray-600 mb-10">
                     Log into your account and track all activities <br /> in your society
                  </p>

                  <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                     <div className="flex p-1 bg-gray-100 rounded-lg mb-8">
                     <button
                        className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all duration-200
                           ${userType === 'member' 
                           ? 'bg-white shadow text-gray-900' 
                           : 'text-gray-600 hover:bg-gray-200'
                           }`}
                        onClick={() => setUserType('member')}
                     >
                        I&apos;m a member
                     </button>
                     <button
                        className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all duration-200
                           ${userType === 'admin' 
                           ? 'bg-white shadow text-gray-900' 
                           : 'text-gray-600 hover:bg-gray-200'
                           }`}
                        onClick={() => setUserType('admin')}
                     >
                        I&apos;m an admin
                     </button>
                     </div>

                     <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div>
                           <label htmlFor="email" className="sr-only">Email address</label>
                           <p className="text-left text-sm font-medium text-gray-700 mb-2">Email</p>
                           <input
                              id="email"
                              name="email"
                              type="email"
                              autoComplete='new-username'
                              value={form.email}
                              onChange={(e) =>
                                 setForm({ ...form, email: e.target.value })
                              }
                              required
                              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-orange focus:border-primary-orange sm:text-sm"
                              placeholder="Your email address"
                           />
                        </div>

                        <div>
                           <label htmlFor="password" className="sr-only">Password</label>
                           <p className="text-left text-sm font-medium text-gray-700 mb-2">Password</p>
                           <div className="relative">
                              <input
                              id="password"
                              name="password"
                              type={showPassword ? 'text' : 'password'}
                              autoComplete="new-password"
                              value={form.password}
                              onChange={(e) =>
                                 setForm({ ...form, password: e.target.value })
                              }
                              required
                              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-orange focus:border-primary-orange sm:text-sm pr-10"
                              placeholder="Your password"
                              />
                              <button
                                 type="button"
                                 onClick={togglePasswordVisibility}
                                 className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                              >
                              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                              </button>
                           </div>
                        </div>

                        <div className="flex items-center justify-between">
                           <div className="flex items-center">
                              <label htmlFor="remember-me" className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" id="remember-me" className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-orange/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF7A2C]"></div>
                              <span className="ml-3 text-sm font-medium text-gray-900">Remember me</span>
                              </label>
                           </div>

                           <Link href="" className="text-sm font-medium text-[#FF7A2C] hover:underline">
                              Forgot Password
                           </Link>
                        </div>

                        <div>
                           <button
                              type="submit"
                              disabled={loading}
                              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-[#FF7A2C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-orange"
                           >
                              {loading ? (
                                 <span className="loader w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                              ) : 
                                 "Login"
                              }
                           </button>
                        </div>
                     </form>

                     <p className="mt-6 text-center text-sm text-gray-600">
                     Don&apos;t have an account?{' '}
                     <Link href="/" className="font-medium text-[#FF7A2C] hover:underline">
                        Create One
                     </Link>
                     </p>
                  </div>
               </div>
            </div>
         </div>

         {/*<div className="flex items-center justify-center min-h-screen bg-gray-50">
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
                     {showPassword ? <EyeOff /> : <Eye />}
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
         </div>*/ }
      </Fragment>
   );
}
