'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from "next/navigation";
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
  Mail,
  ShieldCheck,
  HeartHandshake
} from 'lucide-react';
import OrgBadge from '@/app/components/OrgBadge';
import { useApiClient } from '@/lib/apiClient';

export default function Sidebar({ isOpen, setIsOpen }) {
   const { state, logout } = useAuth();
   const user = state?.user;
   const org = state?.organization;
   const pathname = usePathname();
   const api = useApiClient();
   const [unread, setUnread] = useState(0);

   // Unread activity badge for admins. Refreshes every minute and on navigation.
   useEffect(() => {
      if (user?.role !== 1) return;
      let stop = false;
      const load = () => api.get('/notifications/unread-count', { silent: true })
         .then((r) => !stop && setUnread(r.data?.count || 0))
         .catch(() => {});
      load();
      const t = setInterval(load, 60000);
      const onSeen = () => setUnread(0);
      window.addEventListener('aos:notifications-seen', onSeen);
      return () => { stop = true; clearInterval(t); window.removeEventListener('aos:notifications-seen', onSeen); };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [user?.role, pathname]);

   const adminItems = [
      { name: 'Dashboard', icon: <LayoutGrid size={18} />, href: '/dashboard' },
      { name: 'Contacts & Members', icon: <Users size={18} />, href: '/contact' },
      { name: 'Events', icon: <Calendar size={18} />, href: '/event' },
      { name: 'Membership Tiers', icon: <Layers size={18} />, href: '/membership' },
      { name: 'Fundraising', icon: <DollarSign size={18} />, href: '/fundraising' },
      { name: 'Notifications', icon: <Bell size={18} />, href: '/notification', badge: unread },
      { name: 'Messages', icon: <Mail size={18} />, href: '/message' },
      { name: 'Settings', icon: <Settings size={18} />, href: '/settings' },
   ];

   const memberItems = [
      { name: 'Home', icon: <LayoutGrid size={18} />, href: '/dashboard' },
      { name: 'Events', icon: <Calendar size={18} />, href: '/event' },
      { name: 'Directory', icon: <Users size={18} />, href: '/directory' },
      { name: 'Give', icon: <HeartHandshake size={18} />, href: '/fundraising/give' },
      { name: 'Settings', icon: <Settings size={18} />, href: '/settings' },
   ];

   const baseItems = user?.role === 1 ? adminItems : (user?.role === 2 || user?.role === 3 ? memberItems : []);
   const menuItems = user?.isPlatformAdmin
      ? [{ name: 'Platform Console', icon: <ShieldCheck size={18} />, href: '/platform' }, ...baseItems]
      : baseItems;

   return (
      <aside
         className={`${
            isOpen ? 'w-64' : 'w-12'
         } bg-[#F3F3F3] border-r border-gray-200 p-2
         flex flex-col justify-between
         h-screen shrink-0`}
      >
         <div>
            <div className="flex justify-between items-center mb-5 gap-2">
               {isOpen &&
                  <div className="flex items-center gap-2 min-w-0">
                     <OrgBadge org={org} size={32} />
                     <div className="text-sm font-semibold leading-tight truncate" title={org?.name}>{org?.name || 'AssociationOS'}</div>
                  </div>
               }
               <button
                  aria-label="Toggle menu"
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex p-1.5 text-gray-700 items-center hover:text-[var(--brand)]">
                  <Menu size={20} />
               </button>
            </div>

            <nav className="space-y-1">
            {menuItems.map((item) => {
               const isActive = pathname === item.href || pathname.startsWith(item.href + '/') || (item.href === '/fundraising' && pathname.startsWith('/campaign'));
               return (
                  <Link
                     key={item.href}
                     href={item.href}
                     className={`flex items-center space-x-3 p-1.5 rounded-lg transition-all border-l-4 ${
                        isActive
                           ? "bg-[#EAEAEA] text-black border-[var(--brand)]"
                           : "text-gray-800 hover:bg-[#EAEAEA] hover:text-black border-transparent"
                     }`}
                  >
                     <span className="text-lg relative">
                        {item.icon}
                        {!isOpen && item.badge > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500" />}
                     </span>
                     {isOpen && <span className="font-medium text-sm flex-1">{item.name}</span>}
                     {isOpen && item.badge > 0 && (
                        <span className="ml-auto min-w-5 h-5 px-1.5 rounded-full bg-red-500 text-white text-xs font-semibold flex items-center justify-center" aria-label={`${item.badge} unread`}>
                           {item.badge > 99 ? '99+' : item.badge}
                        </span>
                     )}
                  </Link>
               );
            })}
            </nav>
         </div>

         <div className="mt-4">
            {isOpen && user && (
               <div className="px-1.5 pb-2 text-xs text-gray-500 truncate" title={user.email}>
                  {user.name || user.email}
               </div>
            )}
            <hr className="border-t border-gray-300 mb-2" />
            <button type="button" onClick={logout} className="w-full flex items-center space-x-3 p-1.5 rounded-lg text-gray-900 hover:bg-gray-700 hover:text-white transition-all">
               <span className="text-lg"><LogOut size={18} /></span>
               {isOpen && <span className="font-medium">Logout</span>}
            </button>
         </div>
      </aside>
   );
}
