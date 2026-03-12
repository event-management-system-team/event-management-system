import { MapPin, QrCode, Info } from "lucide-react";
import { Link } from "react-router-dom";

const TicketCard = ({
  startDate,
  bannerUrl,
  eventName,
  location,
  ticketCount,
  status,
  eventSlug,
}) => {
  const dateObj = new Date(startDate);
  const month = dateObj.toLocaleString("en-US", { month: "short" });
  const day = dateObj.getDate();

  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "bg-[#FF6B35]/10 text-[#FF6B35] border-[#FF6B35]/20";
      case "APPROVED":
      case "CONFIRMED":
        return "bg-[#4ECDC4]/10 text-[#4ECDC4] border-[#4ECDC4]/20";
      case "REJECTED":
      case "CANCELLED":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 duration-300 flex flex-col h-full">
      <div className="relative aspect-[16/9] w-full overflow-hidden shrink-0">
        <img
          className="w-full h-full object-cover"
          src={bannerUrl}
          alt={eventName}
        />
        <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-white px-2 py-1 md:px-3 md:py-1 rounded-lg text-center shadow-md">
          <span className="block text-[9px] md:text-[10px] font-bold text-gray-500 uppercase leading-none mb-1">
            {month}
          </span>
          <span className="block text-lg md:text-xl font-black text-gray-900 leading-none">
            {day}
          </span>
        </div>

        {status && (
          <div className={`absolute top-3 right-3 md:top-4 md:right-4 px-2 py-1 rounded text-[9px] md:text-[10px] font-bold uppercase truncate max-w-[100px] md:max-w-none border ${getStatusStyle(status)}`}>
            {status}
          </div>
        )}
      </div>

      <div className="p-4 md:p-5 flex flex-col flex-1 gap-3">
        <h3 className="text-base md:text-lg font-extrabold text-gray-900 line-clamp-2 md:line-clamp-1 h-[48px] md:h-auto break-words">
          {eventName}
        </h3>

        <div className="flex items-start md:items-center gap-2 text-xs md:text-sm text-gray-500 font-medium h-auto md:h-5">
          <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5 md:mt-0" />
          <span className="line-clamp-2 md:line-clamp-1 break-words">
            {location}
          </span>
        </div>

        <div className="bg-gray-100 w-fit px-2 py-1 md:px-3 md:py-1 rounded-md text-[10px] md:text-xs font-bold text-gray-600 mt-auto">
          {ticketCount} Tickets
        </div>

        <div className={`flex flex-col sm:flex-row gap-2 mt-2 ${['PENDING', 'CANCELLED', 'REJECTED'].includes(status?.toUpperCase()) ? 'invisible pointer-events-none' : ''}`}>
          <Link
            to={`/attendee/tickets/${eventSlug}`}
            className="w-full sm:flex-1 bg-[#8aa8b2] hover:bg-[#7a97a1] text-white py-2 md:py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs md:text-sm font-bold transition-colors"
            tabIndex={['PENDING', 'CANCELLED', 'REJECTED'].includes(status?.toUpperCase()) ? -1 : 0}
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
