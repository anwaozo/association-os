'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
   const navLinks = [
      { name: 'About', href: '/dashboard' },
      { name: 'Events', href: '#' },
      { name: 'Our Alumni', href: '#' },
      { name: 'Contact Us', href: '#' },
      { name: 'Donate', href: '#' },
   ];
   return (
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
               <div className="flex-shrink-0">
                  <a href="/">
                     <div className="flex items-center space-x-2">
                        <img src="/logo.png" alt="logo" title="Logo" className="w-[50px] max-w-full" />
                     </div>
                  </a>
               </div>

               {/* Desktop Navigation and Actions (Hidden on Mobile) */}
               <nav className="hidden lg:flex items-center space-x-10">
                  
                  {/* Nav Links */}
                  {navLinks.map((link) => (
                     <Link
                        key={link.name}
                        href={link.href}
                        className="text-base font-medium text-gray-700 hover:text-orange-600 transition duration-150 ease-in-out"
                     >
                        {link.name}
                     </Link>
                  ))}

                  <a
                     href="login"
                     className="text-base font-medium text-orange-600 hover:text-orange-700 transition duration-150 ease-in-out"
                  >
                     Login
                  </a>

                  <button
                     type="button"
                     className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-[#FF884D] hover:bg-[#FF7733] transition duration-150 ease-in-out transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                     Join Now
                  </button>
               </nav>

               <div className="lg:hidden">
                  <button
                     type="button"
                     onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                     className="p-2 rounded-md text-gray-800 hover:text-orange-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
                  >
                     {mobileMenuOpen ? (
                        // Close Icon (X)
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           fill="none"
                           viewBox="0 0 24 24"
                           strokeWidth={2}
                           stroke="currentColor"
                           className="h-6 w-6"
                        >
                           <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                     ) : (
                        // Hamburger Icon
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           fill="none"
                           viewBox="0 0 24 24"
                           strokeWidth={2}
                           stroke="currentColor"
                           className="h-6 w-6"
                        >
                           <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                     )}
                  </button>
               </div>
            </div>
         </div>

         {mobileMenuOpen && (
            <div className="lg:hidden bg-white border-t border-gray-200 shadow-md">
               <div className="px-6 py-4 space-y-3">
                  {navLinks.map((link) => (
                  <Link
                     key={link.name}
                     href={link.href}
                     onClick={() => setMobileMenuOpen(false)} // close menu on click
                     className="block text-base font-medium text-gray-700 hover:text-orange-600"
                  >
                     {link.name}
                  </Link>
                  ))}

                  <hr className="my-3 border-gray-200" />

                  <Link
                  href="/login"
                  className="block text-base font-medium text-orange-600 hover:text-orange-700"
                  onClick={() => setMobileMenuOpen(false)}
                  >
                  Login
                  </Link>

                  <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center px-6 py-3 w-full text-base font-medium rounded-xl shadow-sm text-white bg-[#FF884D] hover:bg-[#FF7733] transition duration-150 ease-in-out"
                  >
                  Join Now
                  </Link>
               </div>
            </div>
         )}

      </header>
   )
}