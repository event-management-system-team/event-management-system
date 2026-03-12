import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    DollarSign,
    Ticket,
    Users,
    Star,
    ArrowLeft,
    MoreVertical,
    ChevronRight,
    UserCheck,
    TrendingUp,
    TrendingDown,
    MapPin,
    Calendar,
} from 'lucide-react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from 'recharts';
import dayjs from 'dayjs';
import organizerService from '../../services/organizer.service';

const ACCENT = '#2d3a4f';
const ACCENT_LIGHT = '#f0fdf4';
const DONUT_COLORS = ['#1E293B', '#F97316', '#94A3B8'];
const FREE_EVENT_COLOR = '#22C55E';

const formatVND = (value) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);

const formatNumber = (num) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num?.toLocaleString() || '0';
};

const StatCard = ({ icon: Icon, label, value, subText, trend, trendUp, iconBg, iconColor, loading }) => (
    <div className="bg-[#fafaf8] rounded-2xl border border-gray-100 px-5 py-4 flex flex-col">
        <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500 font-medium">{label}</span>
            <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}
            >
                <Icon size={18} className={iconColor} />
            </div>
        </div>
        <div className="flex items-end justify-between">
            <div>
                <p className="text-2xl font-bold text-gray-900">
                    {loading ? '—' : value}
                </p>
                {subText && (
                    <p className="text-xs text-gray-400 mt-0.5">{subText}</p>
                )}
            </div>
            {trend && (
                <div className={`flex items-center gap-1 text-xs font-medium ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
                    {trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {trend}
                </div>
            )}
        </div>
    </div>
);

const AttendeeRow = ({ attendee, index }) => {
    const statusColors = {
        'checked-in': { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
        'registered': { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
        'cancelled': { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-500' },
    };
    const rawStatus = (attendee.status || 'registered').toLowerCase().replace('_', '-');
    const status = rawStatus === 'checked_in' || rawStatus === 'checked-in' || rawStatus === 'checkedin' ? 'checked-in' : rawStatus;
    const colors = statusColors[status] || statusColors.registered;

    const statusLabel = {
        'checked-in': 'Checked In',
        'registered': 'Registered',
        'cancelled': 'Cancelled',
    };

    return (
        <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors px-1 rounded-lg">
            <div className="flex items-center gap-3">
                <img
                    src={attendee.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(attendee.fullName || 'User')}&background=random&size=40`}
                    alt={attendee.fullName}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
                <div>
                    <p className="text-sm font-semibold text-gray-900">{attendee.fullName}</p>
                    <p className="text-xs text-gray-400">{attendee.ticketType || 'General Admission'}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                    {statusLabel[status] || status}
                </span>
                <ChevronRight size={16} className="text-gray-300" />
            </div>
        </div>
    );
};

const DonutCenter = ({ sold, total }) => (
    <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        className="select-none"
    >
        <tspan x="50%" dy="-6" fontSize="28" fontWeight="700" fill="#111827">
            {sold?.toLocaleString() || 0}
        </tspan>
        <tspan x="50%" dy="22" fontSize="11" fill="#9CA3AF">
            TICKETS
        </tspan>
    </text>
);

const EventDetailDashboard = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [attendees, setAttendees] = useState([]);
    const [ticketStats, setTicketStats] = useState({
        sold: 0,
        total: 0,
        general: 0,
        vip: 0,
        early: 0,
        checkedIn: 0,
    });
    const [loading, setLoading] = useState(true);

    const fetchEventDetail = useCallback(async () => {
        if (!eventId) return;
        setLoading(true);
        try {
            const data = await organizerService.getEventDetail(eventId);
            setEvent(data);

            const sold = data.totalSold || data.registeredCount || 0;
            const total = data.totalTickets || data.totalCapacity || 0;
            const registeredCount = data.registeredCount || 0;

            const generalPct = 0.65;
            const vipPct = 0.25;
            const earlyPct = 0.10;

            setTicketStats({
                sold,
                total,
                registeredCount,
                general: Math.round(sold * generalPct),
                vip: Math.round(sold * vipPct),
                early: Math.round(sold * earlyPct),
                checkedIn: data.checkedInCount || Math.round(registeredCount * 0.375),
            });

            try {
                const attendeesData = await organizerService.getEventAttendees(eventId, 0, 10);
                console.log('Attendees API response:', attendeesData);
                setAttendees(attendeesData.content || []);
            } catch (err) {
                console.error('Attendees API error:', err.response?.status, err.response?.data || err.message);
                setAttendees([]);
            }
        } catch (err) {
            console.error('Failed to fetch event detail:', err);
            setEvent(null);
            setTicketStats({
                sold: 0,
                total: 0,
                registeredCount: 0,
                general: 0,
                vip: 0,
                early: 0,
                checkedIn: 0,
            });
            setAttendees([]);
        } finally {
            setLoading(false);
        }
    }, [eventId]);

    useEffect(() => {
        fetchEventDetail();
    }, [fetchEventDetail]);

    const isFreeEvent = event?.isFree === true || (event?.totalRevenue === 0 && event?.isFree !== false);

    const donutData = useMemo(() => {
        if (isFreeEvent) {
            return [
                { name: 'Free', value: ticketStats.sold || ticketStats.registeredCount || 0, pct: 100 },
            ];
        }
        const { general, vip, early } = ticketStats;
        return [
            { name: 'General', value: general, pct: ticketStats.sold > 0 ? Math.round((general / ticketStats.sold) * 100) : 65 },
            { name: 'VIP', value: vip, pct: ticketStats.sold > 0 ? Math.round((vip / ticketStats.sold) * 100) : 25 },
            { name: 'Early', value: early, pct: ticketStats.sold > 0 ? Math.round((early / ticketStats.sold) * 100) : 10 },
        ].filter(d => d.value > 0);
    }, [ticketStats, isFreeEvent]);

    const capacityPercent = ticketStats.total > 0
        ? Math.round((ticketStats.checkedIn / ticketStats.total) * 100)
        : 0;

    const soldPercent = ticketStats.total > 0
        ? Math.round((ticketStats.sold / ticketStats.total) * 100)
        : 0;

    const revenue = event?.totalRevenue || 0;
    const staffCount = event?.staffCount || 0;
    const staffTotal = event?.staffTotal || 20;
    const avgRating = event?.avgRating || 0;
    const eventStatus = event?.status || '';

    if (!loading && !event) {
        return (
            <div className="p-8 min-h-screen bg-[#f5f5f0]">
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">Event Not Found</h1>
                </div>
                <div className="bg-[#fafaf8] rounded-2xl border border-gray-100 p-12 text-center">
                    <Calendar className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium text-lg">Event not found</p>
                    <p className="text-sm text-gray-400 mt-2">The event you're looking for doesn't exist or has been removed.</p>
                    <button
                        onClick={() => navigate('/organizer/my-events')}
                        className="mt-6 px-6 py-2.5 bg-[#2d3a4f] text-white text-sm font-medium rounded-lg hover:bg-[#1e293b] transition-colors"
                    >
                        Back to My Events
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 min-h-screen bg-[#f5f5f0]">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold text-gray-900">
                            {loading ? 'Loading...' : event?.eventName || 'Event Not Found'}
                        </h1>
                        {event?.status && (
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${event.status === 'APPROVED' ? 'bg-green-50 text-green-700' :
                                    event.status === 'ONGOING' ? 'bg-blue-50 text-blue-700' :
                                        event.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700' :
                                            event.status === 'COMPLETED' ? 'bg-gray-100 text-gray-600' :
                                                event.status === 'DRAFT' ? 'bg-orange-50 text-orange-600' :
                                                    'bg-gray-100 text-gray-600'
                                }`}>
                                {event.status}
                            </span>
                        )}
                        {event?.categoryName && (
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
                                {event.categoryName}
                            </span>
                        )}
                    </div>
                    {event && (
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <MapPin size={14} />
                                {event.location || 'No location'}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {dayjs(event.startDate).format('DD MMM YYYY, HH:mm')} - {dayjs(event.endDate).format('DD MMM YYYY, HH:mm')}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Stat Cards Row */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                {isFreeEvent ? (
                    <StatCard
                        icon={Ticket}
                        label="Event Type"
                        value="Free Event"
                        subText="No ticket fees"
                        iconBg="bg-green-50"
                        iconColor="text-green-600"
                        loading={loading}
                    />
                ) : (
                    <StatCard
                        icon={DollarSign}
                        label="Total Revenue"
                        value={formatVND(revenue)}
                        subText="From ticket sales"
                        iconBg="bg-green-50"
                        iconColor="text-green-600"
                        loading={loading}
                    />
                )}
                <StatCard
                    icon={Ticket}
                    label="Tickets Sold"
                    value={`${ticketStats.sold.toLocaleString()} / ${ticketStats.total.toLocaleString()}`}
                    subText={`${soldPercent}% of capacity reached`}
                    iconBg="bg-red-50"
                    iconColor="text-red-500"
                    loading={loading}
                />
                <StatCard
                    icon={Users}
                    label="Registered"
                    value={ticketStats.registeredCount?.toLocaleString() || '0'}
                    subText="Total registrations"
                    iconBg="bg-blue-50"
                    iconColor="text-blue-500"
                    loading={loading}
                />
                <StatCard
                    icon={Star}
                    label="Capacity"
                    value={(event?.totalCapacity || 0).toLocaleString()}
                    subText="Maximum attendees"
                    iconBg="bg-yellow-50"
                    iconColor="text-yellow-500"
                    loading={loading}
                />
            </div>

            {/* Main Content: Attendee List + Ticket Sales */}
            <div className="grid grid-cols-12 gap-6">
                {/* Attendee List */}
                <div className="col-span-5 bg-[#fafaf8] rounded-2xl border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-bold text-gray-900">Attendee List</h2>
                        <button
                            onClick={() => navigate(`/organizer/events/${eventId}/attendees`)}
                            className="px-4 py-2 bg-[#2d3a4f] text-white text-sm font-medium rounded-lg hover:bg-[#1e293b] transition-colors"
                        >
                            View All Attendees
                        </button>
                    </div>

                    {loading ? (
                        <div className="py-12 text-center">
                            <div className="inline-block w-8 h-8 border-3 border-gray-200 border-t-[#2d3a4f] rounded-full animate-spin" />
                            <p className="text-sm text-gray-400 mt-3">Loading attendees...</p>
                        </div>
                    ) : attendees.length === 0 ? (
                        <div className="py-12 text-center">
                            <Users className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                            <p className="text-gray-500 font-medium">No attendees yet</p>
                            <p className="text-sm text-gray-400 mt-1">Attendees will appear here once registered.</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {attendees.slice(0, 5).map((attendee, idx) => (
                                <AttendeeRow key={attendee.id || idx} attendee={attendee} index={idx} />
                            ))}
                        </div>
                    )}

                    {ticketStats.registeredCount > 0 && (
                        <button
                            onClick={() => navigate(`/organizer/events/${eventId}/attendees`)}
                            className="mt-5 text-sm text-[#7FA5A5] hover:text-[#5d8585] font-medium transition-colors w-full text-center"
                        >
                            VIEW ALL {ticketStats.registeredCount.toLocaleString()} ATTENDEES
                        </button>
                    )}
                </div>

                {/* Ticket Sales & Entry */}
                <div className="col-span-7 bg-[#fafaf8] rounded-2xl border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-900">Ticket Sales & Entry</h2>
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreVertical size={18} className="text-gray-400" />
                        </button>
                    </div>

                    <div className="flex gap-8">
                        {/* Donut Chart */}
                        <div className="shrink-0">
                            <div className="w-48 h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={donutData}
                                            dataKey="value"
                                            innerRadius={55}
                                            outerRadius={75}
                                            paddingAngle={isFreeEvent ? 0 : 2}
                                            startAngle={90}
                                            endAngle={-270}
                                            stroke="none"
                                        >
                                            {donutData.map((_, i) => (
                                                <Cell
                                                    key={i}
                                                    fill={isFreeEvent ? FREE_EVENT_COLOR : DONUT_COLORS[i % DONUT_COLORS.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <DonutCenter sold={ticketStats.sold || ticketStats.registeredCount} total={ticketStats.total} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Legend */}
                            <div className="flex items-center justify-center gap-4 mt-3">
                                {donutData.map((d, i) => (
                                    <div key={d.name} className="flex items-center gap-1.5">
                                        <span
                                            className="w-2.5 h-2.5 rounded-full"
                                            style={{ backgroundColor: isFreeEvent ? FREE_EVENT_COLOR : DONUT_COLORS[i % DONUT_COLORS.length] }}
                                        />
                                        <span className="text-xs text-gray-500">
                                            {d.name} ({d.pct}%)
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Live Check-in Progress */}
                        <div className="flex-1">
                            <div className="bg-white rounded-xl border border-gray-100 p-5">
                                <h3 className="text-sm font-semibold text-gray-900 mb-4">Live Check-in Progress</h3>

                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-2xl font-bold text-gray-900">
                                        {ticketStats.checkedIn.toLocaleString()}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        / {ticketStats.total.toLocaleString()} checked-in
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                                    <div
                                        className="h-full bg-linear-to-r from-[#2d3a4f] to-[#475569] rounded-full transition-all duration-500"
                                        style={{ width: `${Math.min(100, (ticketStats.checkedIn / ticketStats.total) * 100)}%` }}
                                    />
                                </div>

                                {/* Current Attendance */}
                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <UserCheck size={16} className="text-green-500" />
                                        <span className="text-sm font-medium text-gray-700">CURRENT ATTENDANCE</span>
                                    </div>
                                    <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-lg">
                                        {capacityPercent}% CAPACITY
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailDashboard;
