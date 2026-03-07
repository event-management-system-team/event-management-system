import { useParams, useOutletContext, useSearchParams } from 'react-router-dom';
import { Ticket, Star, Mic } from 'lucide-react';
import { message } from 'antd';
import ScannerCamera from '../../components/domain/staff/scanner-qr/ScannerCamera';
import SearchTicket from '../../components/domain/staff/scanner-qr/SearchTicket';
import EventInfo from '../../components/domain/staff/scanner-qr/EventInfo';
import CheckInStats from '../../components/domain/staff/scanner-qr/CheckInStats';
import { useQuery, keepPreviousData, useQueryClient, useMutation } from '@tanstack/react-query';
import staffService from '../../services/staff.service'
import LoadingState from '../../components/common/LoadingState';
import EmptyState from '../../components/common/EmptyState';


const ticketStats = [
    { type: 'General Admission', icon: Ticket, total: 800, checkedIn: 320, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { type: 'VIP Access', icon: Star, total: 300, checkedIn: 85, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
    { type: 'Press / Media', icon: Mic, total: 100, checkedIn: 45, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
];

const ScanQRPage = () => {

    const { data } = useOutletContext();
    const { eventSlug } = useParams();

    const [searchParams, setSearchParams] = useSearchParams();
    const queryClient = useQueryClient();

    const searchKeyword = searchParams.get('keyword') || '';


    const { data: tickets, isLoading: isTicketsLoading, isError: isTicketsError } = useQuery({
        queryKey: ['event', 'tickets', eventSlug, searchKeyword],
        queryFn: () => staffService.searchEventTickets(eventSlug, searchKeyword),
        placeholderData: keepPreviousData
    })

    const checkInMutation = useMutation({
        mutationFn: (request) => staffService.checkInAttendee(eventSlug, request),
        onSuccess: (response) => {
            message.success(`Check-in successful for: ${response.customerName}`);

            queryClient.invalidateQueries({ queryKey: ['event', 'tickets', eventSlug] });
        },
        onError: (error) => {
            message.error(error.response?.data?.message || 'Check-in failed!')
        }
    });

    const handleSearch = (keyword) => {
        const params = new URLSearchParams();
        if (keyword.trim()) params.append('keyword', keyword.trim());
        setSearchParams(params);
    }


    const handleSearchCheckIn = (ticketId) => {
        checkInMutation.mutate({ ticketId });
    }

    const handleScanCheckIn = (ticketCode) => {
        checkInMutation.mutate({ ticketCode });
    }

    const handleVerifyTicket = async (ticketCode) => {
        const data = await staffService.searchEventTickets(eventSlug, ticketCode);
        const ticket = data.find(t => t.ticketCode === ticketCode) || data[0];
        if (!ticket) {
            throw new Error("Invalid or non-existent ticket code!");
        }
        if (ticket.status === 'CHECKED_IN') {
            throw new Error("This ticket has already been checked in!");
        }
        return ticket;
    };

    if (isTicketsLoading) return <LoadingState />
    if (!tickets || isTicketsError) return <EmptyState className='h-[600px]' />



    return (
        <div className="flex-1 flex flex-col lg:flex-row gap-6 h-full w-full overflow-y-auto lg:overflow-hidden bg-[#E5E1DA] p-4 md:p-6 lg:p-8 font-sans">


            <div className="flex-1 flex flex-col gap-6 min-w-0 transition-all duration-300 order-2 lg:order-1">
                <ScannerCamera
                    onVerifyQR={handleVerifyTicket}
                    onScanQR={handleScanCheckIn}
                    isCheckingIn={checkInMutation.isPending}

                />
                <SearchTicket
                    tickets={tickets}
                    handleSearch={handleSearch}
                    searchKeyword={searchKeyword}
                    onCheckIn={handleSearchCheckIn}
                    isCheckingIn={checkInMutation.isPending}
                />
            </div>

            <aside className="w-full lg:w-80 flex flex-col shrink-0 h-fit lg:h-full gap-6 order-1 lg:order-2">
                <EventInfo
                    eventInfo={data?.eventInfo} />
                <CheckInStats ticketStats={ticketStats} />
            </aside>

        </div>
    );
};

export default ScanQRPage;