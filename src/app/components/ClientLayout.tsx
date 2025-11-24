'use client';
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
   const pathname = usePathname();
   const [isOpen, setIsOpen] = useState(true);

   useEffect(() => {
      const handleResize = () => {
         if (window.innerWidth < 768) setIsOpen(false);
         else setIsOpen(true);
      };
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
   }, []);

   const routesWithSidebar = [
      "/dashboard",
      "/settings",
      "/event",
      "/membership",
      "/contact",
      "/directory",
      "/fundraising",
      "/campaign",
      "/notification",
      "/message"
   ];

   const showSidebar = routesWithSidebar.some((r) => pathname.startsWith(r));
   const isDashboard = pathname.startsWith('/dashboard');

   return (
      <>
         {showSidebar ? (
         <div className="flex h-screen bg-white text-gray-800">
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

            <main className={`flex-1 p-6 overflow-y-auto w-full min-w-0 relative ${isDashboard ? 'dashboard-main-bg' : ''}`}>
               {children}
            </main>
         </div>
         ) : (
         children
         )}
      </>
   );
}
