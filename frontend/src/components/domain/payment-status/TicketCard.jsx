import React from 'react';
import { IoCalendarClearOutline } from "react-icons/io5";
import { MdOutlineLocationOn } from "react-icons/md";
import { MdOutlineConfirmationNumber } from "react-icons/md";
import { QRCodeSVG } from 'qrcode.react';

const TicketCard = ({ event }) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-xl flex flex-col md:flex-row overflow-hidden relative border border-gray-200">
      {/* Thông tin sự kiện */}
      <div className="flex-[3] p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-48 aspect-[3/4] bg-center bg-cover rounded-lg shadow-sm" style={{backgroundImage: `url(${event.image})`}}></div>
        <div className="flex flex-col gap-4 flex-1">
          <div>
            <span className="bg-[#8aa9b2]/10 text-[#8aa9b2] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Confirmed</span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#131516] mt-3">{event.title}</h2>
          </div>
          <div className="flex flex-col gap-3 mt-2 text-[#6a787c]">
            <div className="flex items-center gap-3"><IoCalendarClearOutline className="text-[#8aa9b2] text-sm" /> <p className="font-medium">{event.date}</p></div>
            <div className="flex items-center gap-3"><MdOutlineLocationOn className="text-[#8aa9b2] text-sm" /> <p className="font-medium">{event.location}</p></div>
            <div className="flex items-center gap-3"><MdOutlineConfirmationNumber className="text-[#8aa9b2] text-sm" /> <p className="font-medium">{event.tickets}</p></div>
          </div>
        </div>
      </div>

      {/* Đường vạch đứt và lỗ đục (Desktop) */}
      <div className="hidden md:flex flex-col items-center justify-between py-4 relative">
        <div className="w-6 h-6 bg-[#E5E1DA] rounded-full -mt-7 shadow-inner"></div>
        <div className="flex-1 border-l-2 border-dashed border-gray-300 my-2"></div>
        <div className="w-6 h-6 bg-[#E5E1DA] rounded-full -mb-7 shadow-inner"></div>
      </div>

      {/* QR Code Section */}
      <div className="flex-1 p-8 md:p-10 flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex items-center justify-center">
          {event.qrCode ? (
            <QRCodeSVG value={event.qrCode} size={128} />
          ) : (
            <div className="w-32 h-32 bg-gray-200 animate-pulse rounded"></div>
          )}
        </div>
        <p className="text-[#6a787c] text-xs font-semibold uppercase tracking-widest mb-1">Ticket ID</p>
        <p className="text-[#131516] font-bold text-lg">{event.ticketId}</p>
      </div>
    </div>
  );
};

export default TicketCard;