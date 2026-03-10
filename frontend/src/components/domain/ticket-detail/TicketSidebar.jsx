import React, { useState } from 'react';
import { QrCode, Download, ArrowRightLeft, Laptop, Apple, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const TicketSidebar = ({ ticket, totalTickets, currentIndex, onNext, onPrev }) => {
  const [imgError, setImgError] = useState(false);

  if (!ticket) return null;

  // React to ticket change to reset imgError
  React.useEffect(() => {
    setImgError(false);
  }, [ticket]);

  return (
    <div className="md:w-[40%] bg-[#f7f7f7] p-8 flex flex-col justify-center items-center relative">
      <div className="w-full max-w-[320px] bg-white rounded-[28px] p-8 shadow-sm border border-gray-100 flex flex-col items-center">
        
        {totalTickets > 1 ? (
          <div className="w-full flex justify-between items-center mb-6">
            <button onClick={onPrev} className="p-1.5 bg-gray-50 rounded-full hover:bg-gray-100 text-gray-400 transition shadow-sm border border-gray-100">
              <ChevronLeft size={16} strokeWidth={3} />
            </button>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Entry Pass {currentIndex + 1}/{totalTickets}</p>
            <button onClick={onNext} className="p-1.5 bg-gray-50 rounded-full hover:bg-gray-100 text-gray-400 transition shadow-sm border border-gray-100">
              <ChevronRight size={16} strokeWidth={3} />
            </button>
          </div>
        ) : (
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Entry Pass</p>
        )}

        <div className="bg-white p-6 rounded-2xl border-2 border-gray-50 mb-8 w-full flex flex-col items-center shadow-inner min-h-[260px] justify-center">
          {ticket.qrCodeUrl && !imgError ? (
            <QRCodeSVG value={ticket.qrCodeUrl} size={128} />
          ) : (
            <QrCode size={180} strokeWidth={1.5} className="text-gray-900" />
          )}
          <p className="mt-4 font-mono font-bold text-gray-400 text-sm tracking-widest text-center">{ticket.ticketCode || 'VN-IMF-2024-X92'}</p>
        </div>

        <div className="w-full space-y-3">
          <button className="w-full bg-[#89A8B2] text-white font-bold py-3.5 rounded-xl hover:bg-[#89A8B2]/90 transition-all flex items-center justify-center gap-2">
            <Download size={18} /> Download
          </button>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500 mb-2">Need help with your ticket?</p>
        <a className="text-[#89A8B2] font-bold flex items-center justify-center gap-1 hover:underline" href="#">
          <HelpCircle size={16} /> Contact Organizer
        </a>
      </div>
    </div>
  );
};

export default TicketSidebar;