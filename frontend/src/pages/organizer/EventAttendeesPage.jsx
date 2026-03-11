import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import organizerService from '../../services/organizer.service';

const PAGE_SIZE = 10;

const statusConfig = {
    'checked-in': { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500', label: 'Checked In' },
    'registered': { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500', label: 'Registered' },
    'cancelled': { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-500', label: 'Cancelled' },
};

const normalizeStatus = (raw = '') => {
    const s = raw.toLowerCase().replace(/_/g, '-');
    if (s === 'checkedin' || s === 'checked-in') return 'checked-in';
    if (s === 'cancelled') return 'cancelled';
    return 'registered';
};

const StatusBadge = ({ raw }) => {
    const key = normalizeStatus(raw);
    const cfg = statusConfig[key] || statusConfig.registered;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
};

const Avatar = ({ name, url }) => (
    <img
        src={url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random&size=40`}
        alt={name}
        className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0"
    />
);

const EventAttendeesPage = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [attendees, setAttendees] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    /* ── Fetch event name ── */
    useEffect(() => {
        organizerService.getEventDetail(eventId)
            .then(data => setEvent(data))
            .catch(() => setEvent(null));
    }, [eventId]);

    /* ── Fetch attendees ── */
    const fetchAttendees = useCallback(async (page = 0) => {
        setLoading(true);
        try {
            const data = await organizerService.getEventAttendees(eventId, page, PAGE_SIZE);
            setAttendees(data.content || []);
            setTotalElements(data.totalElements ?? (data.content?.length ?? 0));
            setTotalPages(data.totalPages ?? 1);
        } catch {
            setAttendees([]);
        } finally {
            setLoading(false);
        }
    }, [eventId]);

    useEffect(() => {
        fetchAttendees(currentPage);
    }, [fetchAttendees, currentPage]);

    /* ── Derived values ── */
    const filtered = search.trim()
        ? attendees.filter(a =>
            (a.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
            (a.email || '').toLowerCase().includes(search.toLowerCase()))
        : attendees;

    const checkedInCount = attendees.filter(a => normalizeStatus(a.status) === 'checked-in').length;

    /* ── Pagination ── */
    const goTo = (p) => { setCurrentPage(p); };
    const canPrev = currentPage > 0;
    const canNext = currentPage < totalPages - 1;

    return (
        <div className="p-8 min-h-screen bg-[#f5f5f0]">
            {/* ── Header ── */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900">Attendee Management</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {loading ? '...' : `${totalElements} Attendees for ${event?.eventName || '…'}`}
                    </p>
                </div>

                {/* Export button */}
                <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                    <Download size={16} />
                    Export List
                </button>
            </div>

            {/* ── Card ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

                {/* Search */}
                <div className="mb-5 relative max-w-sm">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d3a4f]/20 focus:border-[#2d3a4f] transition-colors"
                    />
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-6">Attendee</th>
                                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-6">Email</th>
                                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-6">Ticket Type</th>
                                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-6">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="py-16 text-center">
                                        <div className="inline-block w-8 h-8 border-2 border-gray-200 border-t-[#2d3a4f] rounded-full animate-spin" />
                                        <p className="text-sm text-gray-400 mt-3">Loading attendees…</p>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-16 text-center">
                                        <Users className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                                        <p className="text-gray-500 font-medium">No attendees found</p>
                                        {search && <p className="text-sm text-gray-400 mt-1">Try a different search term.</p>}
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((attendee, idx) => (
                                    <tr
                                        key={attendee.id || idx}
                                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
                                    >
                                        {/* Attendee */}
                                        <td className="py-4 pr-6">
                                            <div className="flex items-center gap-3">
                                                <Avatar name={attendee.fullName} url={attendee.avatarUrl} />
                                                <div>
                                                    <p className="font-semibold text-gray-900">{attendee.fullName || '—'}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Email (standalone col) */}
                                        <td className="py-4 pr-6 text-gray-500">{attendee.email || '—'}</td>

                                        {/* Ticket Type */}
                                        <td className="py-4 pr-6">
                                            {attendee.ticketType ? (
                                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                    {attendee.ticketType}
                                                </span>
                                            ) : (
                                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                                                    General
                                                </span>
                                            )}
                                        </td>

                                        {/* Status */}
                                        <td className="py-4 pr-6">
                                            <StatusBadge raw={attendee.status} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                {!loading && totalElements > 0 && (
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                            Showing {currentPage * PAGE_SIZE + 1} to {Math.min((currentPage + 1) * PAGE_SIZE, totalElements)} of {totalElements} attendees
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => canPrev && goTo(currentPage - 1)}
                                disabled={!canPrev}
                                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={16} className="text-gray-600" />
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i).map(p => (
                                <button
                                    key={p}
                                    onClick={() => goTo(p)}
                                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${p === currentPage
                                        ? 'bg-[#2d3a4f] text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {p + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => canNext && goTo(currentPage + 1)}
                                disabled={!canNext}
                                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight size={16} className="text-gray-600" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventAttendeesPage;
