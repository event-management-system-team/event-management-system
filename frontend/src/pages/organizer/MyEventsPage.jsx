import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
    Calendar,
    Zap,
    CalendarClock,
    CheckCircle2,
    Plus,
    SlidersHorizontal,
    Search,
    ChevronLeft,
    ChevronRight,
    MapPin,
} from 'lucide-react';
import dayjs from 'dayjs';
import organizerService from '../../services/organizer.service';


const STATUS_CONFIG = {
    APPROVED: { label: 'Active', dotColor: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-50' },
    ONGOING: { label: 'Active', dotColor: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-50' },
    PENDING: { label: 'Upcoming', dotColor: 'bg-orange-400', textColor: 'text-orange-600', bgColor: 'bg-orange-50' },
    COMPLETED: { label: 'Completed', dotColor: 'bg-gray-400', textColor: 'text-gray-600', bgColor: 'bg-gray-100' },
    REJECTED: { label: 'Rejected', dotColor: 'bg-red-500', textColor: 'text-red-600', bgColor: 'bg-red-50' },
    DRAFT: { label: 'Draft', dotColor: 'bg-yellow-400', textColor: 'text-yellow-700', bgColor: 'bg-yellow-50' },
};

const MyEventsPage = () => {
    const { user } = useSelector((state) => state.auth);
    const organizerId = user?.user_id;

    const [events, setEvents] = useState([]);
    const [stats, setStats] = useState({ totalEvents: 0, activeCount: 0, upcomingCount: 0, completedCount: 0 });
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    const abortRef = useRef(null);

    const fetchEvents = useCallback(async (page) => {
        if (!organizerId) {
            setLoading(false);
            return;
        }

        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        try {
            setLoading(true);
            const data = await organizerService.getMyEvents(organizerId, page, EVENTS_PER_PAGE);
            if (controller.signal.aborted) return;
            setEvents(data.content || []);
            setTotalPages(data.totalPages || 0);
            setTotalElements(data.totalElements || 0);
        } catch (err) {
            if (controller.signal.aborted) return;
            setError('Failed to load events');
            console.error(err);
        } finally {
            if (!controller.signal.aborted) setLoading(false);
        }
    }, [organizerId]);

    const fetchStats = useCallback(async () => {
        if (!organizerId) return;
        try {
            const data = await organizerService.getMyEventStats(organizerId);
            setStats(data);
        } catch (err) {
            console.error('Failed to load stats:', err);
        }
    }, [organizerId]);

    useEffect(() => {
        fetchEvents(currentPage);
        fetchStats();

        return () => {
            if (abortRef.current) abortRef.current.abort();
        };
    }, [organizerId, currentPage, fetchEvents, fetchStats]);

    const filteredEvents = useMemo(() => {
        if (!searchTerm.trim()) return events;
        const lower = searchTerm.toLowerCase();
        return events.filter(
            (e) =>
                e.eventName?.toLowerCase().includes(lower) ||
                e.location?.toLowerCase().includes(lower) ||
                e.categoryName?.toLowerCase().includes(lower)
        );
    }, [events, searchTerm]);

    const getStatusDisplay = (status) => STATUS_CONFIG[status] || STATUS_CONFIG.DRAFT;

    const getTicketProgress = (sold, total) => {
        if (!total || total <= 0) return 0;
        return Math.min(100, Math.round((sold / total) * 100));
    };

    const getProgressBarColor = (percentage) => {
        if (percentage >= 60) return 'bg-[#7FA5A5]';
        if (percentage >= 30) return 'bg-[#B3C8CF]';
        return 'bg-[#d1dfe3]';
    };

    const formatDateRange = (start, end) => {
        const s = dayjs(start);
        const e = dayjs(end);
        if (s.month() === e.month() && s.year() === e.year()) {
            return `${s.format('DD')}-${e.format('DD MMM')}`;
        }
        return `${s.format('DD MMM')} - ${e.format('DD MMM')}`;
    };

    const formatTimeRange = (start, end) => {
        return `${dayjs(start).format('hh:mm A')} - ${dayjs(end).format('hh:mm A')}`;
    };

    const handlePrev = () => {
        if (currentPage > 0) setCurrentPage((p) => p - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages - 1) setCurrentPage((p) => p + 1);
    };

    const statCards = [
        {
            title: 'TOTAL EVENTS',
            value: stats.totalEvents,
            icon: Calendar,
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-500',
        },
        {
            title: 'ACTIVE',
            value: stats.activeCount,
            icon: Zap,
            iconBg: 'bg-green-50',
            iconColor: 'text-green-500',
        },
        {
            title: 'UPCOMING',
            value: stats.upcomingCount,
            icon: CalendarClock,
            iconBg: 'bg-orange-50',
            iconColor: 'text-orange-500',
        },
        {
            title: 'COMPLETED',
            value: stats.completedCount,
            icon: CheckCircle2,
            iconBg: 'bg-gray-100',
            iconColor: 'text-gray-500',
        },
    ];

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-8 min-h-screen">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                        My Events Management
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Overview of your current, upcoming and past event performances.
                    </p>
                </div>
                <button className="flex items-center gap-2 bg-[#2d3a4f] hover:bg-[#1e293b] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                    <Plus size={18} />
                    Create New Event
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-5 mb-8">
                {statCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={index}
                            className="bg-background-light border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm"
                        >
                            <div className={`w-12 h-12 ${card.iconBg} rounded-xl flex items-center justify-center`}>
                                <Icon className={`h-6 w-6 ${card.iconColor}`} />
                            </div>
                            <div>
                                <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">
                                    {card.title}
                                </p>
                                <p className="text-2xl font-bold text-gray-900 mt-0.5">
                                    {loading ? '—' : card.value}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Event Listings */}
            <div className="bg-background-light border border-gray-200 rounded-xl shadow-sm">
                {/* Listings Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Event Listings</h2>
                    <div className="flex items-center gap-2">
                        {showSearch && (
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search events..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#7FA5A5]/30 focus:border-[#7FA5A5] w-60"
                                    autoFocus
                                />
                            </div>
                        )}
                        <button
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Filter"
                        >
                            <SlidersHorizontal size={18} className="text-gray-500" />
                        </button>
                        <button
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Search"
                            onClick={() => {
                                setShowSearch(!showSearch);
                                if (showSearch) setSearchTerm('');
                            }}
                        >
                            <Search size={18} className="text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider font-medium">
                    <div className="col-span-4">Event</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-3">Ticket Stats</div>
                    <div className="col-span-1 text-right">Actions</div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="px-6 py-16 text-center">
                        <div className="inline-block w-8 h-8 border-3 border-gray-200 border-t-[#7FA5A5] rounded-full animate-spin" />
                        <p className="text-sm text-gray-400 mt-3">Loading events...</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredEvents.length === 0 && (
                    <div className="px-6 py-16 text-center">
                        <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                        <p className="text-gray-500 font-medium">No events found</p>
                        <p className="text-sm text-gray-400 mt-1">Create your first event to get started.</p>
                    </div>
                )}

                {/* Event Rows */}
                {!loading &&
                    filteredEvents.map((event) => {
                        const statusConfig = getStatusDisplay(event.status);
                        const progress = getTicketProgress(event.totalSold, event.totalTickets);
                        const progressColor = getProgressBarColor(progress);

                        return (
                            <div
                                key={event.eventId}
                                className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-50 last:border-0 items-center hover:bg-[#f0f0ec] transition-colors"
                            >
                                {/* Event Info */}
                                <div className="col-span-4 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-200">
                                        {event.bannerUrl ? (
                                            <img
                                                src={event.bannerUrl}
                                                alt={event.eventName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-[#B3C8CF] flex items-center justify-center">
                                                <Calendar size={18} className="text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {event.eventName}
                                        </p>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <MapPin size={12} className="text-gray-400 shrink-0" />
                                            <span className="text-xs text-gray-400 truncate">
                                                {event.location || 'No location'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Date */}
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-800 font-medium">
                                        {formatDateRange(event.startDate, event.endDate)}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {formatTimeRange(event.startDate, event.endDate)}
                                    </p>
                                </div>

                                {/* Status */}
                                <div className="col-span-2">
                                    <span
                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}`} />
                                        {statusConfig.label}
                                    </span>
                                </div>

                                {/* Ticket Stats */}
                                <div className="col-span-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-700 font-medium min-w-20">
                                            {(event.totalSold || 0).toLocaleString()}/
                                            {(event.totalTickets || 0).toLocaleString()}
                                        </span>
                                        <span className="text-xs text-gray-400 min-w-10">
                                            {progress}%
                                        </span>
                                    </div>
                                    <div className="mt-1.5 h-1.5 bg-gray-200 rounded-full overflow-hidden max-w-45">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="col-span-1 text-right">
                                    <button className="text-sm text-[#7FA5A5] hover:text-[#5d8585] font-medium transition-colors">
                                        Manage
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                {/* Footer / Pagination */}
                {!loading && totalElements > 0 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                        <p className="text-sm text-[#7FA5A5] font-medium">
                            Showing {filteredEvents.length} of {totalElements} events
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePrev}
                                disabled={currentPage === 0}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={16} />
                                Previous
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={currentPage >= totalPages - 1}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyEventsPage;
