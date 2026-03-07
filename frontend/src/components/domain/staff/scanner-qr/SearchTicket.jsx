import React, { useState } from 'react';
import { Search, CheckCircle2, AlertCircle, UserCheck } from 'lucide-react';
import PopUpInfoTicket from './PopUpInfoTicket';

const SearchTicket = ({ tickets, searchKeyword, handleSearch, onCheckIn, isCheckingIn }) => {
    const [keyword, setKeyword] = useState(searchKeyword);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSearch(keyword);
    }

    const handleTicketClick = (ticket) => {
        setSelectedTicket(ticket);
        setIsModalVisible(true);
    };

    const handleCheckIn = (ticket) => {
        onCheckIn(ticket.ticketId)
        setIsModalVisible(false);
    };

    const renderAttendeeStatus = (attendee) => {
        if (attendee.status === 'CHECKED_IN') {
            return (
                <div className="flex flex-col items-end shrink-0 gap-1">
                    <span className="bg-green-100 text-green-700 text-[10px] font-extrabold px-2 py-1 rounded-md flex items-center gap-1">
                        <CheckCircle2 size={12} /> CHECKED IN
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium">
                        {attendee.checkInTime ? new Date(attendee.checkInTime).toLocaleTimeString() : ''}
                    </span>
                    {attendee.scannedBy && (
                        <span className="text-[8px] text-slate-400 italic flex items-center gap-1">
                            <UserCheck size={10} /> by {attendee.scannedBy}
                        </span>
                    )}
                </div>
            );
        }

        if (attendee.status === 'ERROR') {
            return (
                <div className="flex flex-col items-end shrink-0 gap-1">
                    <span className="bg-red-100 text-red-700 text-[10px] font-extrabold px-2 py-1 rounded-md flex items-center gap-1">
                        <AlertCircle size={12} /> {attendee.message || 'INVALID'}
                    </span>
                </div>
            );
        }

        return (
            <div className="ml-auto shrink-0">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleTicketClick(attendee);
                    }}
                    className="bg-[#89A8B2] hover:bg-[#6c8a94] text-white text-[11px] font-bold px-4 py-1.5 rounded-lg transition-colors shadow-sm shadow-[#89A8B2]/30"
                >
                    CHECK IN
                </button>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex flex-col flex-1 min-h-[300px] lg:min-h-0 transition-all">
            <div className="flex items-center justify-between mb-4 px-1 shrink-0">
                <h2 className="text-[#2C3E50] text-base font-extrabold tracking-tight">Attendee List</h2>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                    {tickets.length} Results
                </span>
            </div>

            <div className="w-full relative z-30 shrink-0 mb-4">
                <div className="flex w-full items-center rounded-xl bg-slate-50 h-11 border border-slate-200 focus-within:border-[#89A8B2]/50 focus-within:ring-2 focus-within:ring-[#89A8B2]/10 transition-all">
                    <div className="text-[#89A8B2] flex items-center justify-center pl-3 pr-2">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full h-full rounded-r-xl border-none bg-transparent text-[#2C3E50] placeholder:text-slate-400 focus:ring-0 focus:outline-none text-sm font-medium"
                        placeholder="Search by name, email or ticket code..."
                    />
                </div>
            </div>

            <div className="w-full flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                {tickets.map((attendee) => {
                    let bgClass = "hover:bg-slate-50 border-transparent hover:border-slate-200";
                    if (attendee.status === 'CHECKED_IN') bgClass = "bg-green-50/50 border-green-100 hover:border-green-200";
                    if (attendee.status === 'ERROR') bgClass = "bg-red-50/50 border-red-100 hover:border-red-200";

                    return (
                        <div
                            key={attendee.ticketId}
                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${bgClass}`}
                            onClick={() => handleTicketClick(attendee)}
                        >
                            {attendee.avatarUrl ? (
                                <div className={`size-10 rounded-full bg-cover bg-center shrink-0 shadow-sm border border-white ${attendee.status === 'ERROR' ? 'grayscale opacity-70' : ''}`}
                                    style={{ backgroundImage: `url(${attendee.avatarUrl})` }}>
                                </div>
                            ) : (
                                <div className="size-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm shrink-0 border border-white shadow-sm">
                                    {attendee.customerName ? attendee.customerName.split(' ').map(n => n[0]).join('') : '?'}
                                </div>
                            )}

                            <div className="flex flex-col min-w-0 flex-1">
                                <span className={`text-sm font-bold truncate ${attendee.status === 'ERROR' ? 'text-slate-500 line-through decoration-red-400' : 'text-[#2C3E50]'}`}>
                                    {attendee.customerName}
                                </span>
                                <span className="text-[10px] text-slate-400 truncate mb-1">{attendee.email}</span>

                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-bold text-slate-500 bg-slate-200/50 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                        {attendee.ticketCode}
                                    </span>
                                    <span className="text-[9px] font-bold text-[#89A8B2] bg-[#89A8B2]/10 px-1.5 py-0.5 rounded">
                                        {attendee.ticketType}
                                    </span>
                                </div>
                            </div>


                            {renderAttendeeStatus(attendee)}
                        </div>
                    );
                })}

                {tickets.length === 0 && (
                    <div className="text-center py-10 text-slate-400 text-sm italic">
                        No tickets found matching your search.
                    </div>
                )}
            </div>

            <PopUpInfoTicket
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                ticketData={selectedTicket}
                onCheckIn={handleCheckIn}
            />
        </div>
    );
};

export default SearchTicket;