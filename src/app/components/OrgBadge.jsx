'use client';

// Organization logo, or its initials on the brand color when there is no logo.
export default function OrgBadge({ org, size = 32 }) {
   const name = org?.name || 'AssociationOS';
   const initials = name
      .split(/\s+/)
      .filter((w) => /^[A-Za-z0-9]/.test(w) && !['of', 'the', 'and', '&'].includes(w.toLowerCase()))
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('');

   if (org?.logoUrl) {
      return (
         // eslint-disable-next-line @next/next/no-img-element
         <img
            src={org.logoUrl}
            alt={`${name} logo`}
            width={size}
            height={size}
            className="rounded-md object-contain bg-white shrink-0"
            style={{ width: size, height: size }}
         />
      );
   }
   return (
      <div
         aria-label={`${name} logo`}
         className="rounded-md flex items-center justify-center text-white font-semibold shrink-0"
         style={{ width: size, height: size, backgroundColor: org?.primaryColor || '#1F3864', fontSize: Math.round(size * 0.4) }}
      >
         {initials || 'A'}
      </div>
   );
}
