import { useParams, useOutletContext, useSearchParams } from 'react-router-dom';
import { Ticket, Star, Mic } from 'lucide-react';
import ScannerCamera from '../../components/domain/staff/scanner-qr/ScannerCamera';
import SearchTicket from '../../components/domain/staff/scanner-qr/SearchTicket';
import EventInfo from '../../components/domain/staff/scanner-qr/EventInfo';
import CheckInStats from '../../components/domain/staff/scanner-qr/CheckInStats';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useState } from 'react';
import staffService from '../../services/staff.service'
import LoadingState from '../../components/common/LoadingState';
import EmptyState from '../../components/common/EmptyState';


// Mock data (Nên tách ra 1 file constant hoặc fetch từ useQuery)
const mockAttendees = [
    { id: '839210', name: 'Sarah Miller', type: 'VIP Access', status: 'CHECKED_IN', time: 'Just now', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80' },
    { id: '839112', name: 'David Mitchell', type: 'General Admission', status: 'PENDING', time: '', avatar: null },
    { id: '839005', name: 'James Wilson', type: 'General Admission', status: 'ERROR', time: '10:45 AM', errorMsg: 'ALREADY SCANNED', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80' },
    { id: '839441', name: 'Emma Thompson', type: 'Press', status: 'PENDING', time: '', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80' }
];

const ticketStats = [
    { type: 'General Admission', icon: Ticket, total: 800, checkedIn: 320, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { type: 'VIP Access', icon: Star, total: 300, checkedIn: 85, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
    { type: 'Press / Media', icon: Mic, total: 100, checkedIn: 45, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
];

const ScanQRPage = () => {

    const { data } = useOutletContext();
    const { eventSlug } = useParams();

    const [searchParams, setSearchParams] = useSearchParams();

    const searchKeyword = searchParams.get('keyword') || '';
    const [keyword, setKeyword] = useState(searchKeyword);

    const { data: tickets, isLoading, isError } = useQuery({
        queryKey: ['event', 'tickets', searchKeyword],
        queryFn: () => staffService.searchEventTickets(eventSlug, searchKeyword),
        placeholderData: keepPreviousData
    })

    if (isLoading) return <LoadingState />
    if (!tickets || isError) return <EmptyState className='h-[600px]' />

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (keyword.trim()) params.append('keyword', keyword.trim());
        setSearchParams(params);
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSearch();
    }


    return (
        <div className="flex-1 flex flex-col lg:flex-row gap-6 h-full w-full overflow-y-auto lg:overflow-hidden bg-[#E5E1DA] p-4 md:p-6 lg:p-8 font-sans">

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
                @keyframes scan { 0% { top: 10%; } 50% { top: 90%; } 100% { top: 10%; } }
                .scanner-line { animation: scan 3s ease-in-out infinite; }
            `}</style>

            <div className="flex-1 flex flex-col gap-6 min-w-0 transition-all duration-300">
                <ScannerCamera />
                <SearchTicket
                    tickets={tickets}
                    handleKeyDown={handleKeyDown}
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                    setKeyword={setKeyword}
                    keyword={keyword}
                />
            </div>

            <aside className="w-full lg:w-80 flex flex-col shrink-0 h-fit lg:h-full gap-6">
                <EventInfo
                    eventInfo={data?.eventInfo} />
                <CheckInStats ticketStats={ticketStats} />
            </aside>

        </div>
    );
};

export default ScanQRPage;