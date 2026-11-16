// Event dates are stored as calendar dates (midnight UTC). Format them in UTC
// so a Houston user doesn't see the day before.
export const formatToReadableDate = (isoString) => {
   if (!isoString) return '';
   const date = new Date(isoString);
   if (Number.isNaN(date.getTime())) return '';
   return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      timeZone: "UTC",
   });
};

// Accepts "HH:MM" (how event times are stored) or an ISO timestamp.
export const formatToTime = (value) => {
   if (!value) return '';
   let h, m;
   const hhmm = /^(\d{1,2}):(\d{2})/.exec(String(value));
   if (hhmm && !String(value).includes('T')) {
      h = Number(hhmm[1]);
      m = Number(hhmm[2]);
   } else {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return '';
      h = date.getUTCHours();
      m = date.getUTCMinutes();
   }
   const suffix = h >= 12 ? 'PM' : 'AM';
   const h12 = h % 12 === 0 ? 12 : h % 12;
   return `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
};

const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const getEventStatus = (eventDate) => {
   const today = ymd(new Date()); // local calendar day
   const date = new Date(eventDate).toISOString().slice(0, 10); // event's calendar day

   if (today < date) return "Upcoming";
   if (today > date) return "Completed";
   return "Ongoing";
};
