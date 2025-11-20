'use client';
import React, { useState, useMemo, Fragment } from 'react';
import Link from 'next/link';

export default function Home() {
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
   const navLinks = [
      { name: 'About', href: '/dashboard' },
      { name: 'Events', href: '#' },
      { name: 'Our Alumni', href: '#' },
      { name: 'Contact Us', href: '#' },
      { name: 'Donate', href: '#' },
   ];

   const watchwordItems = [
      { number: '01', title: 'HISTORY', content: 'The organization was founded in 1911 and became Co-Ed in 1972. Since its inception, Friars have met each semester to deliberate upon, honor, and recognize formally at a reunion breakfast its newest members of the organization.'},
      { number: '02', title: 'SERVICE', content: 'While there are no requirements upon being inducted into the organization to maintain a service-minded life, alumni on their own accord, continue to be active members in investment, philanthropic, and giving opportunities in the State of Texas and beyond.'},
      { number: '03', title: 'HONOR', content: 'Every Friar swears an oath upon induction to continue living with honor, dignity, decorum, and integrity as they navigate their lives and leadership opportunities after their time at The University of Texas at Austin is up.'}
   ];

   return (
      <Fragment>
         <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex items-center justify-between h-20">
                  
                  {/* Logo Area */}
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

         <section className="relative h-screen flex items-center justify-center text-center overflow-hidden ">
            {/* Background Image */}
            <div className="absolute inset-0 " 
               style={{ 
                  backgroundImage: 'url("main.png")',
               }}
            >
                {/* Overlay with subtle gradient for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent h-[800px] bg-[linear-gradient(0deg,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0.4)_100%),linear-gradient(0deg,rgba(251,94,2,0.3)_0%,rgba(251,94,2,0.3)_100%)]"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 px-4 max-w-4xl mx-auto text-white">
                {/* Top Text Bubble */}
                <div className="inline-block bg-black/60 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
                    <p className="text-sm font-light tracking-wide text-gray-200">
                        The oldest honor society at The University of Texas at Austin.
                    </p>
                </div>

                {/* Main Headline */}
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-6 text-shadow-lg">
                    HONORING EXCELLENCE IN <br className="hidden md:inline"/>SERVICE & SCHOLARSHIP
                </h1>

                {/* Description */}
                <p className="text-lg md:text-xl font-light leading-relaxed mb-10 text-gray-100 max-w-2xl mx-auto">
                    The Friar Society has existed since 1911 and is dedicated to recognizing students, faculty, and
                    staff who have made lasting and significant contributions to The University of Texas at Austin.
                </p>

                {/* Call-to-Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <button
                        type="button"
                        className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-xl shadow-lg text-white bg-[#FF884D] hover:bg-[#FF7733] transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                        Join Now
                    </button>
                    <button
                        type="button"
                        className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/60 text-lg font-semibold rounded-xl shadow-lg text-white bg-transparent hover:bg-white/10 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                    >
                        Learn More
                    </button>
                </div>
            </div>
            {/* Custom style for text shadow (could be in global CSS or a utility class if needed elsewhere) */}
            <style jsx>{`
                .text-shadow-lg {
                    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
                }
            `}</style>
         </section>

         <section className="bg-white">
            {/* Top Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
               <div className="flex flex-col md:flex-row justify-center items-center gap-10 text-black text-center md:text-left">
                  {["HISTORY", "SERVICE", "HONOR"].map((title, i) => (
                  <div key={i} className="flex items-center space-x-8">
                     <h2 className="text-3xl lg:text-7xl font-serif italic font-bold">
                        {title}
                     </h2>
                     {i !== 2 && <div className="h-20 w-px bg-black/30 hidden sm:block"></div>}
                  </div>
                  ))}
               </div>
            </div>

            {/* Orange Gradient Section */}
            <div className="bg-[#FF884D] relative w-full py-20 text-white ">
               <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                  {/* Title */}
                  <h3 className="text-4xl md:text-5xl font-extrabold leading-tight">
                     Founded in 1911, The Friar Society is UT Austin’s oldest honors society.
                  </h3>

                  {/* Description */}
                  <p className="text-lg leading-relaxed">
                     We recognize students, faculty, and staff who demonstrate{" "}
                     <strong>outstanding commitment to service, leadership, and academic excellence.</strong>{" "}
                     Here, tradition meets innovation; we cultivate purpose-driven impact.
                  </p>
               </div>
            </div>
         </section>

         <section className="bg-[#FFFBF7] py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
               {/* Watchword Header */}
               <div className="inline-block bg-[#FFEFE5] rounded-full px-5 py-2 mb-16 shadow-inner">
                  <p className="text-sm font-semibold text-[#FF884D] uppercase tracking-wider">
                     Our Watchword
                  </p>
               </div>

               {watchwordItems.map((watchwordItem, i) => (
                  <Fragment key={i}>
                     <div className="flex flex-col md:flex-row md:space-x-12 items-start py-8">
                        {/* Number */}
                        <div className="text-7xl md:text-8xl font-serif text-[#FF884D]/50 font-extrabold mb-4 md:mb-0 md:w-1/6 flex-shrink-0">
                           {watchwordItem.number}
                        </div>
                        
                        {/* Content */}
                        <div className="md:w-5/6">
                           <h3 className="text-3xl font-serif font-bold text-gray-900 border-b border-[#FF884D] inline-block mb-4">
                              {watchwordItem.title}
                           </h3>
                           <p className="text-lg text-gray-700 leading-relaxed">
                              {watchwordItem.content}
                           </p>
                        </div>
                     </div>
                     <hr className="my-10 border-t border-gray-200" />
                  </Fragment>
               ))}
            </div>
         </section>

         {/* 1. Call to Action Section (Image Background) */}
         <section className="relative py-32 md:py-48 flex items-center justify-center text-center overflow-hidden">
               {/* Background Image */}
               <div 
                  className="absolute inset-0" 
                  style={{ 
                     backgroundImage: "url('honor.png')", 
                  }}
               >
                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent h-[800px] bg-[linear-gradient(0deg,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0.4)_100%),linear-gradient(0deg,rgba(251,94,2,0.3)_0%,rgba(251,94,2,0.3)_100%)]"></div>
               </div>

               {/* Content Container */}
               <div className="relative z-10 px-4 max-w-4xl mx-auto text-white">
                  <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-8 font-serif">
                     More than an honor, it's a calling.
                  </h2>
                  <p className="text-lg md:text-xl font-light leading-relaxed mb-10 max-w-2xl mx-auto">
                     As a Friar, you don't just wear the title. You carry a responsibility to inspire, serve, and lead with integrity. Applications open twice yearly. We welcome diverse backgrounds and perspectives.
                  </p>
                  <button
                     type="button"
                     className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-xl shadow-lg text-white bg-[#FF884D] hover:bg-[#FF7733] transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                     Apply to Join the Friars
                  </button>
               </div>
         </section>

         {/* 2. Alumni Quote Section (Dark Footer) */}
         <section className="bg-black-900 py-20 px-4 sm:px-6 lg:px-8 text-white">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:space-x-12">
               {/* Quote */}
               <div className="lg:w-3/3 mb-10 lg:mb-0">
                  <blockquote className="text-2xl md:text-2xl font-light leading-snug">
                     "Mentorship is the soul of leadership—the commitment to pass on lessons learned and to give an azimuth, example, and hope. It portends badly for leadership, for the Friars, and for our Nation if we lose this capacity for empathy, listening respectfully, humility, and understanding. The good society is not a zero-sum game."
                  </blockquote>
               </div>

               {/* Attribution */}
               <div className="lg:w-2/3 pt-4 lg:pt-0">
                  <p className="text-3xl font-bold text-white">
                     Terry Quist – Friar Spring 1978
                     Adjunct Professor, Georgetown University
                  </p>
                  <p className="text-sm text-gray-500 mt-5">
                     Division Chief, N.G-J24 (Counterintelligence and Security) at National Guard Bureau Joint Intelligence Directorate (J2)
                  </p>
               </div>
            </div>
         </section>

         {/* Footer Section */}

         <footer className="bg-[#FF884D] text-white py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-end">
               {/* Left Side: Headline */}
               <div className="md:w-1/2 mb-8 md:mb-0">
                  <h2 className="text-4xl md:text-4xl font-serif font-bold leading-tight">
                  The oldest honor society at The University of Texas at Austin.
                  </h2>
               </div>

               {/* Right Side: Contact/Metadata */}
               <div className="md:w-1/2 text-left md:text-right space-y-4">
                  <p className="text-lg font-medium">
                  Division Chief, N.G-J24 (Counterintelligence and Security) at National Guard Bureau Joint Intelligence Directorate (J2)
                  </p>
               </div>
            </div>

            {/* Divider Line */}
            <div className="border-t border-white/30 mt-10 pt-6">
               <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
                  {/* Left: Copyright */}
                  <p>© The Friar Society &mdash; Established 1911. All rights reserved.</p>

                  {/* Right: Optional Links or Socials */}
                  <div className="flex space-x-4 mt-4 md:mt-0">
                  <a href="#" className="hover:underline">Privacy Policy</a>
                  <a href="#" className="hover:underline">Terms of Use</a>
                  </div>
               </div>
            </div>
         </footer>



      </Fragment>
   );
}
