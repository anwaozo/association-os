'use client';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutGrid, 
  Users, 
  Calendar, 
  Layers, 
  DollarSign, 
  Bell, 
  Settings, 
  LogOut, 
  Menu,
  Mail
} from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen }) {
   const { state, logout } = useAuth();
   const user = state?.user;
   const pathname = usePathname();
   const router = useRouter();

   const menuItems = user?.role === 1 ? [
      { name: 'Dashboard', icon: <LayoutGrid size={18} />, href: '/dashboard' },
      { name: 'Contacts & Members', icon: <Users size={18} />, href: '/contact' },
      { name: 'Events', icon: <Calendar size={18} />, href: '/event' },
      { name: 'Membership Tiers', icon: <Layers size={18} />, href: '/membership' },
      { name: 'Fundraising', icon: <DollarSign size={18} />, href: '/fundraising' },
      { name: 'Notifications', icon: <Bell size={18} />, href: '/notification' },
      { name: 'Messages', icon: <Mail size={18} />, href: '/message' },
      { name: 'Settings', icon: <Settings size={18} />, href: '/settings' },
   ] : (user?.role === 2 ? [
      { name: 'Home', icon: <FaHome />, href: '/dashboard' },
      { name: 'Events', icon: <FaCalendarAlt />, href: '/event' },
      { name: 'Directory', icon: <FaUsers />, href: '/directory' },
      { name: 'Settings', icon: <FaCog />, href: '/settings' },
   ] : []);

   return (
      <aside
         className={`${
            isOpen ? 'w-64' : 'w-12'
         } bg-[#F3F3F3] border-r border-gray-700 p-2 
         flex flex-col justify-between
         h-screen`}
      >
         <div>
            <div className="flex justify-between mb-5">
               {isOpen && 
                  <div className="flex items-center space-x-2">
                     <img src="/logo.png" alt="logo" width="17%" /> 
                     <div className="text-sm">The Friar Society</div> 
                  </div>
               }
               <button 
                  onClick={() => setIsOpen(!isOpen)} 
                  className="flex space-x-3 p-1.5 text-gray-700 items-center justify-between hover:text-blue-600 ">
                  <Menu size={20} />
               </button>
            </div>

            <nav className="space-y-1">
            {menuItems.map((item, i) => {
               const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
               return (
                  <Link
                     key={i}
                     href={item.href}
                     className={`flex items-center space-x-3 p-1.5 rounded-lg transition-all ${
                        isActive
                           ? "bg-gray-700 text-white" 
                           : "text-gray-800 hover:bg-gray-700 hover:text-white"
                     }`}
                  >
                     <span className="text-lg">{item.icon}</span>
                     {isOpen && <span className="font-medium text-sm">{item.name}</span>}
                  </Link>
               );
            })}
            </nav>
         </div>

         <div className="mt-4">
            <hr className="border-t border-gray-300 mb-2" />
            <a style={{cursor: 'pointer'}} onClick={logout} className="flex items-center space-x-3 p-1.5 rounded-lg text-gray-900 hover:bg-gray-700 hover:text-white transition-all">
               <span className="text-lg"><LogOut size={18} /></span>
               {isOpen && <span className="font-medium">Logout</span>}
            </a>
         </div>
      </aside>
   );
}