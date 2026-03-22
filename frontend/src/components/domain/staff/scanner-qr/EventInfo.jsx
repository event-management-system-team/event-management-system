import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

const EventInfo = ({ eventInfo }) => {
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="bg-[#2C3E50] rounded-3xl p-6 shadow-lg border border-[#34495E] relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-[#89A8B2]/30 rounded-full blur-2xl"></div>

            <h2 className="text-white/60 text-xs font-extrabold uppercase tracking-wider mb-1">Current Event</h2>
            <h3 className="text-white text-lg font-bold leading-tight mb-4 relative z-10">{eventInfo.eventName}</h3>

            <div className="flex flex-col gap-3 text-sm text-white/80 font-medium">
                <div className="flex items-start gap-2">
                    <Calendar size={16} className="text-[#4ECDC4] shrink-0 mt-0.5 truncate" />
                    <span>{formatTime(eventInfo?.startDate)} {formatDate(eventInfo?.startDate)} - {formatTime(eventInfo?.endDate)} {formatDate(eventInfo?.endDate)}</span>
                </div>
                <div className="flex items-start gap-2">
                    <MapPin size={16} className="text-[#89A8B2] shrink-0 mt-0.5" />
                    <span className="break-words line-clamp-2 leading-snug truncate">{eventInfo?.location}</span>
                </div>
            </div>
        </div>
    );
};

export default EventInfo;