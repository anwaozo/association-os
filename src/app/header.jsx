/* eslint-disable @next/next/no-img-element */
'use client';
import Link from 'next/link';

// Public nav for the landing, login, sign-up and invite pages.
// Matches apperr.com/associationos.
export const APPERR_ICON = 'https://cdn.prod.website-files.com/674c57b8bc8863cb7e9c6a4b/6909d78f697140a651fa2f61_ApperrDesigns_Icon_White_RGB-1.png';
export const PUBLIC_FONT = "'Satoshi', 'Instrument Sans', Arial, sans-serif";
const SALES_MAIL = 'mailto:info@apperr.com?subject=To%20Apperr%20Sales%20Team';

export function PublicFont() {
   return <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap" precedence="default" />;
}

export default function Header() {
   return (
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
         <Link href="/" className="flex items-center gap-3" aria-label="AssociationOS home">
            <img src={APPERR_ICON} alt="Apperr" className="h-9 w-auto" />
            <span className="hidden text-lg font-bold text-[#0F1215] sm:inline">AssociationOS</span>
         </Link>
         <div className="flex items-center gap-4 sm:gap-6">
            <a href={SALES_MAIL} className="hidden font-bold text-[#1A1B1F] hover:underline md:inline">Talk to Sales</a>
            <Link href="/login" className="font-bold text-[#1A1B1F] hover:underline">Log in</Link>
            <Link href="/signup" className="rounded-full bg-[#1A1B1F] px-4 py-2.5 text-sm font-medium text-white hover:bg-black sm:px-5">
               Register
            </Link>
         </div>
      </nav>
   );
}

// Page frame for the public auth pages: lavender background, nav, Satoshi type.
export function PublicShell({ children }) {
   return (
      <div className="min-h-screen bg-[#F4F4FF] text-[#0F1215]" style={{ fontFamily: PUBLIC_FONT }}>
         <PublicFont />
         <Header />
         {children}
      </div>
   );
}
