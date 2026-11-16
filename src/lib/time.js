export const greeting = (d = new Date()) => {
   const h = d.getHours();
   if (h < 12) return 'Good morning';
   if (h < 18) return 'Good afternoon';
   return 'Good evening';
};

export const timeAgo = (iso) => {
   if (!iso) return '';
   const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
   if (s < 60) return 'just now';
   const m = Math.floor(s / 60);
   if (m < 60) return `${m} min ago`;
   const h = Math.floor(m / 60);
   if (h < 24) return `${h} hour${h === 1 ? '' : 's'} ago`;
   const d = Math.floor(h / 24);
   if (d < 30) return `${d} day${d === 1 ? '' : 's'} ago`;
   return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const daysUntil = (iso) => Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000));
