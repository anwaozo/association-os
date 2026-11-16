import Link from 'next/link';
import Header from '@/app/header';
import { Users, Calendar, Layers, HandCoins, ShieldCheck, LayoutDashboard } from 'lucide-react';

const features = [
   { icon: Users, title: 'Members and contacts', body: 'One database for members, prospects and sponsors, with CSV import and a member directory.' },
   { icon: Calendar, title: 'Events and RSVPs', body: 'Create events, set capacity and pricing, and let members RSVP from their portal.' },
   { icon: Layers, title: 'Membership tiers', body: 'Monthly or annual tiers with benefits, renewal dates and membership history.' },
   { icon: HandCoins, title: 'Fundraising campaigns', body: 'Launch campaigns with goals and suggested donation amounts.' },
   { icon: LayoutDashboard, title: 'Leadership dashboard', body: 'Members, upcoming events, renewals due and recent activity at a glance.' },
   { icon: ShieldCheck, title: 'Your data stays yours', body: 'Each organization gets its own private workspace and branding.' },
];

export default function Home() {
   return (
      <>
         <Header />
         <main className="pt-20 bg-white text-gray-900">
            <section className="bg-gradient-to-b from-[#EEF2F8] to-white">
               <div className="max-w-6xl mx-auto px-6 py-24 text-center">
                  <p className="text-sm font-semibold tracking-wide text-[#1F3864] uppercase mb-4">For chambers, associations and nonprofits</p>
                  <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                     The operating system for membership organizations
                  </h1>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
                     Members, events, dues and campaigns in one place, so your staff spends less time on spreadsheets
                     and more time serving members.
                  </p>
                  <Link href="/login" className="inline-flex items-center px-7 py-3 text-base font-medium rounded-lg text-white bg-[#1F3864] hover:opacity-90">
                     Log in to your organization
                  </Link>
               </div>
            </section>

            <section className="max-w-6xl mx-auto px-6 py-20">
               <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {features.map(({ icon: Icon, title, body }) => (
                     <div key={title} className="p-6 rounded-xl border border-gray-100 shadow-sm">
                        <Icon className="text-[#1F3864] mb-4" size={28} />
                        <h3 className="font-semibold text-lg mb-2">{title}</h3>
                        <p className="text-gray-600 text-sm">{body}</p>
                     </div>
                  ))}
               </div>
            </section>

            <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-500">
               © {new Date().getFullYear()} AssociationOS by Apperr
            </footer>
         </main>
      </>
   );
}
