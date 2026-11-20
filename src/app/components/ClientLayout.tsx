'use client';
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useApiClient } from "@/lib/apiClient";
import { SHOW_PREVIEW } from "@/lib/features";

// Routes that only exist as sample-data previews. (None right now.)
const PREVIEW_ROUTES: string[] = [];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
   const pathname = usePathname();
   const router = useRouter();
   const { state, setOrganization } = useAuth();
   const api = useApiClient();
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

   // Apply the organization's brand color everywhere.
   useEffect(() => {
      const color = state?.organization?.primaryColor;
      if (color) document.documentElement.style.setProperty("--brand", color);
      document.title = state?.organization?.name ? `${state.organization.name} | AssociationOS` : "AssociationOS";
   }, [state?.organization]);

   // Refresh branding once per session in case an admin changed it.
   useEffect(() => {
      if (!state?.isAuthenticated) return;
      api.get("/organizations/current", { silent: true } as never)
         .then((res) => res?.data && setOrganization(res.data))
         .catch(() => {});
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [state?.isAuthenticated]);

   // Admins of a brand-new organization finish the welcome setup first.
   useEffect(() => {
      const org = state?.organization;
      if (state?.isAuthenticated && state?.user?.role === 1 && org && org.onboardedAt === null
         && !pathname.startsWith("/welcome") && !pathname.startsWith("/invite")) {
         router.replace("/welcome");
      }
   }, [state?.isAuthenticated, state?.user, state?.organization, pathname, router]);

   // Screens that still use sample data are off unless preview is enabled.
   const isPreviewRoute = PREVIEW_ROUTES.some((r) => pathname.startsWith(r));
   useEffect(() => {
      if (isPreviewRoute && !SHOW_PREVIEW) router.replace("/dashboard");
   }, [isPreviewRoute, router]);

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
      "/message",
      "/platform"
   ];

   const showSidebar = routesWithSidebar.some((r) => pathname.startsWith(r));
   const isDashboard = pathname.startsWith('/dashboard');

   if (isPreviewRoute && !SHOW_PREVIEW) return null;

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
