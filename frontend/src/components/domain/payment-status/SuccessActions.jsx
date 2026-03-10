import React from "react";
import { FaDownload, FaTicket } from "react-icons/fa6";

const SuccessActions = ({ onGoMyTickets }) => (
  <div className="flex flex-col sm:flex-row gap-4 mt-12 w-full max-w-md">
    <button
      onClick={() => window.print()}
      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#8aa9b2] text-[#8aa9b2] font-bold rounded-lg hover:bg-[#8aa9b2]/5 transition-colors"
    >
      <FaDownload /> Download PDF
    </button>
    <button
      onClick={onGoMyTickets}
      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#8aa9b2] text-white font-bold rounded-lg hover:opacity-90 transition-colors shadow-lg"
    >
      <FaTicket /> My Tickets
    </button>
  </div>
);

export default SuccessActions;