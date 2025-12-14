export const formatToReadableDate = (isoString) => {
   const date = new Date(isoString);
   return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
   });
};

export const formatToTime = (isoString) => {
   const date = new Date(isoString);
   const h = String(date.getUTCHours()).padStart(2, "0");
   const m = String(date.getUTCHours()).padStart(2, "0");
   return `${h}:${m}`;
};

export const getEventStatus = (eventDate) => {
   const today = new Date();
   const date = new Date(eventDate);

   today.setHours(0, 0, 0, 0);
   date.setHours(0, 0, 0, 0);

   if (today < date) return "Upcoming";
   if (today > date) return "Completed";
   return "Ongoing";
};