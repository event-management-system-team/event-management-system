import React from "react";

const TicketSkeleton = () => (
  <div className="w-full bg-white rounded-xl shadow-xl flex flex-col md:flex-row overflow-hidden animate-pulse">
    <div className="flex-[3] p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start">
      <div className="w-full md:w-48 aspect-[3/4] bg-gray-200 rounded-lg" />
      <div className="flex flex-col gap-4 flex-1 w-full">
        <div className="h-5 bg-gray-200 rounded w-24" />
        <div className="h-8 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-2/5" />
      </div>
    </div>
    <div className="flex-1 p-8 md:p-10 flex flex-col items-center justify-center bg-gray-50 gap-4">
      <div className="w-32 h-32 bg-gray-200 rounded-lg" />
      <div className="h-4 bg-gray-200 rounded w-20" />
      <div className="h-6 bg-gray-200 rounded w-28" />
    </div>
  </div>
);

export default TicketSkeleton;