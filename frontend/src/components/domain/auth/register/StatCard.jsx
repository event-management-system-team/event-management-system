import React from "react";

export const StatCard = ({ icon, text }) => {
  return (
    <div className="rounded-full glass-effect p-3 flex items-center gap-2 text-left">
      <span className="material-symbols-outlined text-[#FF6B35]">{icon}</span>
      <p className="text-md text-white">{text}</p>
    </div>
  );
};
