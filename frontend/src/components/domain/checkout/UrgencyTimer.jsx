import React from "react";
import { FaClock } from "react-icons/fa";

const UrgencyTimer = ({ time = "09:58" }) => (
  <div className="bg-[#FF6B35] text-white py-2 sticky top-20 z-40 shadow-md">
    <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-2">
      <FaClock className="size-4" />
      <p className="text-sm font-semibold uppercase tracking-wider">
        Your tickets are held for: <span className="font-bold">{time}</span>
      </p>
    </div>
  </div>
);

export default UrgencyTimer;
