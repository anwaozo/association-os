/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';

// Public landing page. Mirrors apperr.com/associationos (same copy, colors,
// type and imagery), with the buttons wired into this app: register an
// organization, log in, or book a demo with Apperr.

const CDN = 'https://cdn.prod.website-files.com/674c57b8bc8863cb7e9c6a4b';
const DEMO_URL = 'https://apperr.com/book-a-demo';
const SALES_MAIL = 'mailto:info@apperr.com?subject=To%20Apperr%20Sales%20Team';
const PARTNER_MAIL = 'mailto:info@apperr.com?subject=Partnering%20with%20Apperr%20-%20AssociationOS';

const features = [
   {
      title: 'Member Directory & Portal',
      body: 'Manage member profiles, renewals, and access levels with a secure, searchable member directory and personalized member portal.',
      img: `${CDN}/6909d998f5672d996ed421f4_Membership-final.gif`,
      alt: 'Member directory display',
   },
   {
      title: 'Chapter & Event Management',
      body: 'Plan and manage conferences, webinars, and chapter activities with automated registration, ticketing, and reminders.',
      img: `${CDN}/6909deaa5f6d173ab7a596da_Events-final.gif`,
      alt: 'Chapter and event management display',
   },
   {
      title: 'Dues and Payments (Stripe)',
      body: 'Collect membership dues, donations, and event fees using secure Stripe payment integration with clear transaction tracking.',
      img: `${CDN}/6909d894a70b90f472024188_Payments%20final.gif`,
      alt: 'Dues display',
   },
   {
      title: 'Email & SMS Automation',
      body: 'Engage members with automated email and SMS communication, including newsletters, event alerts, and renewal reminders: All built into the system.',
      img: `${CDN}/6909dabe06eb22ad3854354a_Messages%20final.gif`,
      alt: 'Email and SMS display',
   },
   {
      title: 'Fundraising & Sponsorships',
      body: 'Track donors, manage sponsorships, and run fundraising campaigns with real-time performance analytics.',
      img: `${CDN}/6909d863678689c3b543e2b7_Fundraising%20final1.gif`,
      alt: 'Fundraising display',
   },
   {
      title: 'Analytics Dashboard',
      body: 'Access real-time analytics on member growth, engagement, and financial performance in one centralized dashboard.',
      img: `${CDN}/6911acc3b7bb863e2b1ebf41_Analytics%20final%20(1)%20(1)%20(2).gif`,
      alt: 'Analytics display',
   },
];

const benefits = [
   'Save hours weekly on administrative tasks',
   'Boost member engagement and retention',
   'All association data in one secure dashboard',
];

const ink = 'text-[#0F1215]';
const accent = 'text-[#6460FF]';
const pillDark =
   'inline-flex items-center justify-center rounded-full bg-[#1A1B1F] px-7 py-3.5 font-medium text-white transition hover:bg-black';
const pillLight =
   'inline-flex items-center justify-center rounded-full border border-[#E4E4EF] bg-white px-7 py-3.5 font-medium text-[#0F1215] transition hover:bg-[#F4F4FF]';

function Eyebrow({ children }: { children: React.ReactNode }) {
   return (
      <span className="inline-block rounded-full bg-[#E9E8FF] px-4 py-1.5 text-sm font-medium text-[#6460FF]">
         {children}
      </span>
   );
}

function BrowserBar({ url }: { url: string }) {
   return (
      <div className="mt-6 flex items-center gap-3 rounded-full border border-[#E4E4EF] bg-white px-4 py-2.5 text-xs text-gray-500 shadow-sm">
         <span className="h-3 w-3 rounded-full border border-gray-400" />
         <span className="flex-1 truncate text-center">🔒 {url}</span>
      </div>
   );
}

export default function Home() {
   return (
      <div className={`${ink} bg-white`} style={{ fontFamily: "'Satoshi', 'Instrument Sans', Arial, sans-serif" }}>
         {/* Satoshi is the apperr.com typeface (free, from Fontshare). */}
         <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap" precedence="default" />

         {/* Nav + hero */}
         <section className="bg-[#F4F4FF]">
            <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
               <Link href="/" className="flex items-center gap-3" aria-label="AssociationOS home">
                  <img src={`${CDN}/6909d78f697140a651fa2f61_ApperrDesigns_Icon_White_RGB-1.png`} alt="Apperr" className="h-9 w-auto" />
                  <span className="hidden text-lg font-bold sm:inline">AssociationOS</span>
               </Link>
               <div className="flex items-center gap-4 sm:gap-6">
                  <a href={SALES_MAIL} className="hidden font-bold text-[#1A1B1F] hover:underline md:inline">Talk to Sales</a>
                  <Link href="/login" className="font-bold text-[#1A1B1F] hover:underline">Log in</Link>
                  <Link href="/signup" className="rounded-full bg-[#1A1B1F] px-4 py-2.5 text-sm font-medium text-white hover:bg-black sm:px-5">
                     Register
                  </Link>
               </div>
            </nav>

            <div className="mx-auto max-w-5xl px-4 pb-0 pt-14 text-center sm:px-6 md:pt-20">
               <h1 className="text-[34px] leading-[1.15] sm:text-5xl md:text-[56px]">
                  <span className="block font-bold">The All-in-One Association Management</span>
                  <span className="block font-medium">Software for Modern Associations.</span>
               </h1>
               <p className="mt-8 text-lg">Manage members, events, payments, and communication securely.</p>
               <p className={`mt-1 text-xl font-bold ${accent}`}>All in one association management platform.</p>
               <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link href="/signup" className={pillDark}>Register your organization</Link>
                  <a href={DEMO_URL} className={pillLight}>Get a Free Demo</a>
               </div>
               <img
                  src={`${CDN}/6909d78f697140a651fa2f5c_Rectangle-157.png`}
                  alt="AssociationOS dashboard on a tablet"
                  className="mx-auto mt-14 w-full max-w-4xl"
               />
            </div>
         </section>

         {/* Intro */}
         <section className="bg-[radial-gradient(#E4E4EF_1px,transparent_1px)] [background-size:18px_18px] px-4 py-20 text-center sm:px-6">
            <Eyebrow>Feature Overview</Eyebrow>
            <h2 className="mx-auto mt-5 max-w-4xl text-3xl font-bold text-[#333] md:text-4xl">
               Open-Source Association Management Software by Apperr
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-[#333]">
               AssociationOS is a powerful association management software built for associations, chambers of commerce,
               and nonprofits to manage their entire ecosystem from one secure platform. Hosted at{' '}
               <strong>association.apperr.com</strong>, it delivers enterprise-level reliability with flexible customization.
            </p>
         </section>

         {/* Licensing */}
         <section className="bg-[#FAFAFF] px-4 py-20 sm:px-6">
            <div className="mx-auto max-w-5xl text-center">
               <Eyebrow>Licensing &amp; Implementation</Eyebrow>
               <h2 className="mt-5 text-3xl font-bold md:text-5xl">Choose the Right Deployment Model</h2>
               <p className="mt-4 text-lg font-medium md:text-xl">
                  AssociationOS is available through <strong>flexible licensing options:</strong>
               </p>
               <div className="mt-12 grid gap-6 text-center md:grid-cols-2">
                  <div className="rounded-2xl border border-[#E4E4EF] bg-gradient-to-b from-white to-[#F4F4FF] p-8">
                     <h3 className="text-2xl font-medium md:text-[32px] md:leading-tight">Open Source License:</h3>
                     <p className="mt-4 text-lg">
                        Deploy on your own server or preferred cloud host with <strong>full control and transparency.</strong>
                     </p>
                     <BrowserBar url="myorganization.com" />
                  </div>
                  <div className="rounded-2xl border border-[#E4E4EF] bg-gradient-to-b from-white to-[#F4F4FF] p-8">
                     <h3 className="text-2xl font-medium md:text-[32px] md:leading-tight">CTO-as-a-Service Program:</h3>
                     <p className="mt-4 text-lg">
                        Let Apperr manage setup, customization, hosting, and support: Ideal for organizations without internal
                        technical teams.
                     </p>
                     <BrowserBar url="association.apperr.com/myorganization" />
                  </div>
               </div>
               <p className="mx-auto mt-10 max-w-2xl text-lg">
                  Our implementation team ensures smooth onboarding, data migration, and member training so your organization
                  gets value from day one.
               </p>
               <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <a href={DEMO_URL} className={pillDark}>Get a Free Demo</a>
                  <a href={PARTNER_MAIL} className={pillLight}>Partner with Apperr</a>
               </div>
            </div>
         </section>

         {/* Features */}
         <section className="px-4 py-20 sm:px-6">
            <div className="mx-auto max-w-6xl">
               <Eyebrow>Feature Overview</Eyebrow>
               <h2 className="mt-5 text-4xl font-bold leading-tight md:text-5xl">
                  <span className="text-[#1C2126]">Powerful Tools for</span>
                  <br />
                  <span className={accent}>Every Association</span>
               </h2>

               <div className="mt-12 space-y-8">
                  {features.map((f, i) => (
                     <div
                        key={f.title}
                        className={`grid items-center gap-6 rounded-2xl border border-[#E4E4EF] bg-gradient-to-b from-white to-[#F4F4FF] p-5 md:gap-10 md:p-8 ${i % 2 ? 'md:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]' : 'md:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)]'}`}
                     >
                        <div className={i % 2 ? 'md:order-2' : ''}>
                           <h3 className="text-2xl font-bold">{f.title}</h3>
                           <p className="mt-3 text-lg leading-relaxed">{f.body}</p>
                        </div>
                        <img
                           src={f.img}
                           alt={f.alt}
                           loading="lazy"
                           className={`aspect-[3/2] w-full rounded-[10px] border border-[#E4E4EF] bg-white object-cover shadow-sm ${i % 2 ? 'md:order-1' : ''}`}
                        />
                     </div>
                  ))}
               </div>

               <div className="mt-14 grid gap-4 sm:grid-cols-3">
                  {benefits.map((b) => (
                     <div key={b} className={`rounded-2xl border border-[#E4E4EF] px-6 py-5 text-center text-xl font-medium ${accent}`}>
                        {b}
                     </div>
                  ))}
               </div>

               <p className="mx-auto mt-14 max-w-3xl text-center text-xl md:text-2xl">
                  Need advanced automation or technical leadership for your association? Explore our{' '}
                  <a href="https://apperr.com/ai-agents" className="underline">AI Systems &amp; Automation</a> and{' '}
                  <a href="https://apperr.com/cto-solution" className="underline">CTO as a Service</a> solutions.
               </p>

               <figure className="mt-14 rounded-2xl border border-[#E4E4EF] bg-[radial-gradient(#EDEDF5_1px,transparent_1px)] [background-size:18px_18px] p-8 md:p-10">
                  <blockquote className="max-w-3xl text-xl md:text-[28px] md:leading-snug">
                     “Track donors, manage sponsorship packages, and streamline fundraising campaigns with real-time analytics.”
                  </blockquote>
                  <figcaption className="mt-5 text-base">
                     <strong>Samad Mandibu,</strong> CEO &amp; Co-founder
                     <span className="block font-medium">Association OS</span>
                  </figcaption>
               </figure>
            </div>
         </section>

         {/* CTA + footer */}
         <footer className="bg-[linear-gradient(135deg,#2F3BFF_0%,#5B5BFF_45%,#3A2EE8_100%)] px-4 pt-16 text-white sm:px-6">
            <div className="mx-auto max-w-6xl">
               <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
                  <h2 className="max-w-2xl text-3xl font-bold leading-tight md:text-5xl">
                     Ready to Power Your Association with AssociationOS?
                  </h2>
                  <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
                     <Link href="/signup" className="whitespace-nowrap rounded-full bg-white px-7 py-3.5 text-lg font-medium text-[#6460FF] hover:bg-[#F4F4FF]">
                        Register your organization
                     </Link>
                     <a href={DEMO_URL} className="whitespace-nowrap rounded-full border border-white/70 px-7 py-3.5 text-lg font-medium text-white hover:bg-white/10">
                        Book a Free Demo
                     </a>
                  </div>
               </div>
               <div className="mt-14 flex flex-col items-start justify-between gap-6 border-t border-white/30 py-8 sm:flex-row sm:items-center">
                  <img
                     src={`${CDN}/6909d78f697140a651fa2f92_ApperrDesigns_SecondaryLogoVert_White_RGB-(1)-1.png`}
                     alt="Apperr Designs"
                     className="h-16 w-auto"
                  />
                  <div className="text-left text-base sm:text-right">
                     <p>Association OS is a licensed software product by Apperr.</p>
                     <p>Apperr Designs © {new Date().getFullYear()}</p>
                  </div>
               </div>
            </div>
         </footer>
      </div>
   );
}
