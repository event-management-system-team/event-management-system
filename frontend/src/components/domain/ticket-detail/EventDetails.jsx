import React from 'react';
import { Calendar, Clock, MapPin, ExternalLink } from 'lucide-react';

const InfoItem = ({ icon: Icon, label, value, fullWidth }) => (
  <div className={`flex items-start gap-3 ${fullWidth ? 'col-span-2' : ''}`}>
    <div className="p-2.5 bg-[#F1F0E8] rounded-xl text-[#89A8B2]">
      <Icon size={20} />
    </div>
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase">{label}</p>
      <p className="font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const EventDetails = ({ ticket, user }) => {
  if (!ticket) return null;

  const orderId = ticket.orderCode;
  
  let formattedDate = "N/A";
  let formattedTime = "N/A";
  if (ticket.eventStartDate) {
    const dateObj = new Date(ticket.eventStartDate);
    formattedDate = dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
    formattedTime = dateObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  }

  const avatarUrl = user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'User')}&background=89A8B2&color=fff`;

  return (
    <div className="md:w-[60%] border-r border-gray-100 flex flex-col">
      <div className="relative h-64 overflow-hidden">
        <div className={`w-full h-full bg-cover bg-center`} style={{ backgroundImage: `url('${ticket.eventBannerUrl || 'https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=2070'}')` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-6 left-8">
          <span className="bg-[#89A8B2] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded mb-3 inline-block">{ticket.ticketTypeName || 'TICKET'}</span>
          <h1 className="text-3xl font-black text-white leading-tight">{ticket.eventName}</h1>
        </div>
      </div>

      <div className="p-8 flex-grow">
        <div className="mb-10">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Event Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InfoItem icon={Calendar} label="Date" value={formattedDate} />
            <InfoItem icon={Clock} label="Time" value={formattedTime} />
            <InfoItem icon={MapPin} label="Venue" value={ticket.eventLocation} fullWidth />
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 mb-10">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Ticket Holder</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4 w-full sm:w-auto overflow-hidden">
              <img src={avatarUrl} className="size-12 shrink-0 rounded-full border border-gray-100 object-cover" alt="holder" />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-lg truncate">{user?.full_name || 'User'}</p>
                <p className="text-sm text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
            <div className="sm:text-right shrink-0 bg-gray-50 sm:bg-transparent p-3 sm:p-0 rounded-xl w-full sm:w-auto border border-gray-100 sm:border-none">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest sm:text-xs mb-1 sm:mb-0">Order Summary</p>
              <p className="font-mono font-bold text-gray-800 text-sm sm:text-base break-all sm:break-normal">ID: {orderId}</p>
            </div>
          </div>
        </div>

        {ticket.eventLocation && (
          <div className="bg-[#F1F0E8] rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Location Preview</h3>
              <a 
                className="text-[#89A8B2] text-sm font-bold flex items-center gap-1 hover:underline" 
                href={`https://maps.google.com/maps?q=${encodeURIComponent(ticket.eventLocation)}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Open in Maps <ExternalLink size={14} />
              </a>
            </div>
            <div className="w-full h-64 md:h-80 rounded-xl overflow-hidden relative border border-slate-200 shadow-inner">
              <iframe
                title="Event Location Map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://maps.google.com/maps?q=${encodeURIComponent(ticket.eventLocation)}&z=16&output=embed`}
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;