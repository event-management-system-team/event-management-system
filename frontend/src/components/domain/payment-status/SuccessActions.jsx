import React from "react";
import { FaDownload, FaTicket } from "react-icons/fa6";

const SuccessActions = ({ onGoMyTickets, exportToImage, isExporting }) => (
  <div className="flex flex-col sm:flex-row gap-4 mt-12 w-full max-w-md">
    <button
      onClick={exportToImage}
      disabled={isExporting}
      className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#8aa9b2] text-[#8aa9b2] font-bold rounded-lg transition-colors ${isExporting
        ? "opacity-50 cursor-wait bg-[#8aa9b2]/10"
        : "hover:bg-[#8aa9b2]/5"
        }`}
    >

      {isExporting ? (
        <>
          <span className="animate-spin border-2 border-[#8aa9b2] border-t-transparent rounded-full w-4 h-4"></span>
          Downloading...
        </>
      ) : (
        <>
          <FaDownload /> Download Ticket
        </>
      )}
    </button>

    <button
      onClick={onGoMyTickets}
      disabled={isExporting}
      className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#8aa9b2] text-white font-bold rounded-lg shadow-lg transition-colors ${isExporting ? "opacity-50 cursor-wait" : "hover:opacity-90"
        }`}
    >
      <FaTicket /> My Tickets
    </button>
  </div>
);

export default SuccessActions;