"use client";
import React from "react";

export default function EventBadge({ date }) {
  
  const getEventStatus = (eventDate) => {
    const today = new Date();
    const d = new Date(eventDate);

    // Remove time for accurate date comparison
    today.setHours(0, 0, 0, 0);
    d.setHours(0, 0, 0, 0);

    if (today < d) return "Upcoming";
    if (today > d) return "Completed";
    return "Ongoing";
  };

  const status = getEventStatus(date);

  let styles = "";

  switch (status) {
    case "Upcoming":
      styles = "bg-orange-500/10 text-orange-600 border border-orange-200";
      break;
    case "Ongoing":
      styles = "bg-blue-500/10 text-blue-600 border border-blue-200";
      break;
    default:
      styles = "bg-gray-500/10 text-gray-600 border border-gray-200";
      break;
  }

  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${styles}`}>
      {status}
    </span>
  );
}
