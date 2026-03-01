import React, { useState } from 'react';
import {
    Plus,
    Calendar,
    Zap,
    Clock,
    CheckCircle2,
    SlidersHorizontal,
    Search,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ── Mock Data ────────────────────────────────────────────────
const statsCards = [
    {
        label: 'TOTAL EVENTS',
        value: 12,
        icon: Calendar,
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-600',
    },
    {
        label: 'ACTIVE',
        value: 3,
        icon: Zap,
        iconBg: 'bg-amber-50',
        iconColor: 'text-amber-500',
    },
    {
        label: 'UPCOMING',
        value: 5,
        icon: Clock,
        iconBg: 'bg-orange-50',
        iconColor: 'text-orange-500',
    },
    {
        label: 'COMPLETED',
        value: 4,
        icon: CheckCircle2,
        iconBg: 'bg-teal-50',
        iconColor: 'text-teal-600',
    },
];

const events = [
    {
        id: 1,
        name: 'Global Tech Summit 2024',
        location: 'San Francisco, CA',
        date: '20-21 Nov',
        time: '09:00 AM - 06:00 PM',
        status: 'Active',
        ticketsSold: 1250,
        ticketsTotal: 2000,
        avatar: 'https://ui-avatars.com/api/?name=GT&background=1e3a5f&color=fff&rounded=true&size=40',
    },
    {
        id: 2,
        name: 'Winter Music Festival',
        location: 'Aspen, CO',
        date: '15-16 Dec',
        time: '07:00 PM - 02:00 AM',
        status: 'Upcoming',
        ticketsSold: 840,
        ticketsTotal: 1500,
        avatar: 'https://ui-avatars.com/api/?name=WM&background=7c3aed&color=fff&rounded=true&size=40',
    },
    {
        id: 3,
        name: 'Gourmet Food Expo',
        location: 'New York, NY',
        date: '05-08 Jan',
        time: '10:00 AM - 08:00 PM',
        status: 'Upcoming',
        ticketsSold: 312,
        ticketsTotal: 3000,
        avatar: 'https://ui-avatars.com/api/?name=GF&background=ea580c&color=fff&rounded=true&size=40',
    },
];

const TOTAL_EVENTS = 12;
const PAGE_SIZE = 3;

// ── Component ────────────────────────────────────────────────
const MyEventsPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(TOTAL_EVENTS / PAGE_SIZE);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Active':
                return 'text-green-700 bg-green-50 border-green-200';
            case 'Upcoming':
                return 'text-amber-700 bg-amber-50 border-amber-200';
            case 'Completed':
                return 'text-gray-600 bg-gray-100 border-gray-200';
            default:
                return 'text-gray-600 bg-gray-100 border-gray-200';
        }
    };

    const getProgressColor = (status) => {
        switch (status) {
            case 'Active':
                return 'bg-blue-500';
            case 'Upcoming':
                return 'bg-amber-400';
            case 'Completed':
                return 'bg-teal-500';
            default:
                return 'bg-gray-400';
        }
    };

    return (
        <div className="p-8 min-h-screen">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <Link to="/" className="hover:text-gray-700 transition-colors">
                    Home
                </Link>
                <span className="text-gray-400">›</span>
                <span className="text-gray-800 font-medium">My Events</span>
            </nav>

            {/* Header */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        My Events Management
                    </h1>
                    <p className="text-sm text-gray-500">
                        Overview of your current, upcoming and past event performances.
                    </p>
                </div>
                <button className="flex items-center gap-2 bg-[#1e293b] hover:bg-[#334155] text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm cursor-pointer">
                    <Plus size={18} />
                    Create New Event
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                {statsCards.map((card, idx) => (
                    <div
                        key={idx}
                        className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.iconBg}`}
                        >
                            <card.icon size={22} className={card.iconColor} />
                        </div>
                        <div>
                            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                                {card.label}
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {card.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Event Listings Card */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                {/* Card Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Event Listings
                    </h2>
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 cursor-pointer">
                            <SlidersHorizontal size={18} />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 cursor-pointer">
                            <Search size={18} />
                        </button>
                    </div>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50/60 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    <div className="col-span-3">Event</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-3">Ticket Stats</div>
                    <div className="col-span-2 text-right">Actions</div>
                </div>

                {/* Table Rows */}
                {events.map((event) => {
                    const pct = Math.round(
                        (event.ticketsSold / event.ticketsTotal) * 100
                    );
                    return (
                        <div
                            key={event.id}
                            className="grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                        >
                            {/* Event */}
                            <div className="col-span-3 flex items-center gap-3">
                                <img
                                    src={event.avatar}
                                    alt={event.name}
                                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                />
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                        {event.name}
                                    </p>
                                    <p className="text-xs text-gray-400 truncate">
                                        {event.location}
                                    </p>
                                </div>
                            </div>

                            {/* Date */}
                            <div className="col-span-2">
                                <p className="text-sm text-gray-800 font-medium">
                                    {event.date}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {event.time}
                                </p>
                            </div>

                            {/* Status */}
                            <div className="col-span-2">
                                <span
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(
                                        event.status
                                    )}`}
                                >
                                    <span
                                        className={`w-1.5 h-1.5 rounded-full ${event.status === 'Active'
                                                ? 'bg-green-500'
                                                : event.status === 'Upcoming'
                                                    ? 'bg-amber-500'
                                                    : 'bg-gray-400'
                                            }`}
                                    ></span>
                                    {event.status}
                                </span>
                            </div>

                            {/* Ticket Stats */}
                            <div className="col-span-3">
                                <div className="flex items-center gap-3 mb-1.5">
                                    <span className="text-sm text-gray-700 font-medium">
                                        {event.ticketsSold.toLocaleString()}/
                                        {event.ticketsTotal.toLocaleString()}
                                    </span>
                                    <span className="text-xs text-gray-400 font-medium">
                                        {pct}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5">
                                    <div
                                        className={`h-1.5 rounded-full transition-all ${getProgressColor(
                                            event.status
                                        )}`}
                                        style={{ width: `${pct}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="col-span-2 text-right">
                                <Link
                                    to={`/organizer/events/${event.id}`}
                                    className="text-sm font-medium text-[#6b8e8e] hover:text-[#4a7070] transition-colors"
                                >
                                    Manage
                                </Link>
                            </div>
                        </div>
                    );
                })}

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4">
                    <p className="text-sm text-[#6b8e8e]">
                        Showing {PAGE_SIZE} of {TOTAL_EVENTS} events
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() =>
                                setCurrentPage((p) => Math.max(1, p - 1))
                            }
                            disabled={currentPage === 1}
                            className="px-4 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() =>
                                setCurrentPage((p) =>
                                    Math.min(totalPages, p + 1)
                                )
                            }
                            disabled={currentPage === totalPages}
                            className="px-4 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyEventsPage;
