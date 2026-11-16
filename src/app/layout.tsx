import type { Metadata } from "next";
// Self-hosted font: no network fetch at build time.
import "@fontsource/instrument-sans/400.css";
import "@fontsource/instrument-sans/500.css";
import "@fontsource/instrument-sans/600.css";
import "@fontsource/instrument-sans/700.css";
import "./globals.css";
import { AuthProvider } from '@/context/AuthContext';
import ClientLayout from "@/app/components/ClientLayout";
import { ToastProvider } from "@/app/components/toast/ToastContext";


export const metadata: Metadata = {
  title: "AssociationOS",
  description: "The operating system for membership organizations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <meta name="viewport" content="width=device-width, initial-scale=1" />
         <body
         className="antialiased"
         >
            <ToastProvider>
               <AuthProvider>
                  <ClientLayout>
                     {children}
                  </ClientLayout>
               </AuthProvider>
            </ToastProvider>
         </body>
      </html>
   );
}
