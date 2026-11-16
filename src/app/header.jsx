'use client';
import Link from 'next/link';
import { PRODUCT_NAME } from '@/lib/features';

// Public header for the landing and login pages.
export default function Header() {
   return (
      <header className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
               <Link href="/" className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-md bg-[#1F3864] text-white flex items-center justify-center font-bold">A</div>
                  <span className="text-lg font-semibold text-gray-900">{PRODUCT_NAME}</span>
               </Link>
               <Link
                  href="/login"
                  className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-lg text-white bg-[#1F3864] hover:opacity-90"
               >
                  Log in
               </Link>
            </div>
         </div>
      </header>
   );
}
