import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    CalendarDays,
    Ticket,
    BookOpen,
    MapPin,
    Calendar,
    ArrowRight,
    ChevronDown,
} from 'lucide-react';
import dayjs from 'dayjs';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';
import organizerService from '../../services/organizer.service';

const ACCENT = '#2d3a4f';
const ACCENT_LIGHT = '#f0fdf4';

const CATEGORY_COLORS = {
    Music: '#F97316',
    Sports: '#3B82F6',
    Fashion: '#EC4899',
    Technology: '#8B5CF6',
    'Food & Culinary': '#10B981',
    Education: '#6366F1',
    Art: '#F43F5E',
    Business: '#0EA5E9',
};

const getCategoryColor = (name) =>
    CATEGORY_COLORS[name] || '#F97316';

const DONUT_COLORS = ['#1E293B', '#F97316', '#94A3B8'];

const formatVND = (value) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);

const StatCard = ({ icon: Icon, label, value, loading }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 flex items-center gap-4">
        <div
            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: ACCENT_LIGHT }}
        >
            <Icon size={22} style={{ color: ACCENT }} />
        </div>
        <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                {label}
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">
                {loading ? '—' : (value ?? 0).toLocaleString()}
            </p>
        </div>
    </div>
);

const DonutCenter = ({ total }) => (
    <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        className="select-none"
    >
        <tspan x="50%" dy="-8" fontSize="10" fill="#9CA3AF">
            Total Ticket
        </tspan>
        <tspan x="50%" dy="24" fontSize="22" fontWeight="700" fill="#111827">
            {total.toLocaleString()}
        </tspan>
    </text>
);

const CustomBarTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-sm">
            <p className="font-semibold text-gray-700 mb-1">{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color }} className="flex items-center gap-1">
                    <span
                        className="inline-block w-2 h-2 rounded-full"
                        style={{ backgroundColor: p.color }}
                    />
                    {p.name}: {formatVND(p.value)}
                </p>
            ))}
        </div>
    );
};

const OrganizerDashboardPage = () => {
    const { user } = useSelector((state) => state.auth);
    const organizerId = user?.user_id;
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalEvents: 0,
        activeCount: 0,
        upcomingCount: 0,
        completedCount: 0,
    });
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (!organizerId) return;
        setLoading(true);
        try {
            const [statsData, eventsData] = await Promise.all([
                organizerService.getMyEventStats(organizerId),
                organizerService.getMyEvents(organizerId, 0, 20),
            ]);
            setStats(statsData);
            setEvents(eventsData.content || []);
        } catch (err) {
            console.error('Dashboard fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [organizerId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const totalTicketsSold = useMemo(
        () => events.reduce((sum, e) => sum + (e.registeredCount || 0), 0),
        [events],
    );
    const totalCapacity = useMemo(
        () => events.reduce((sum, e) => sum + (e.totalCapacity || 0), 0),
        [events],
    );
    const totalBookings = totalTicketsSold;

    const totalRevenue = useMemo(
        () => events.reduce((sum, e) => sum + (e.totalRevenue || 0), 0),
        [events],
    );

    const donutData = useMemo(() => {
        const sold = totalTicketsSold;
        const available = Math.max(0, totalCapacity - sold);
        const fullyBookedCount = events.filter(
            (e) => e.totalCapacity > 0 && e.registeredCount >= e.totalCapacity,
        ).length;
        const soldOutTickets = events
            .filter((e) => e.totalCapacity > 0 && e.registeredCount >= e.totalCapacity)
            .reduce((s, e) => s + (e.registeredCount || 0), 0);
        const partialSold = Math.max(0, sold - soldOutTickets);

        return [
            { name: 'Sold Out', value: soldOutTickets, pct: totalCapacity > 0 ? Math.round((soldOutTickets / totalCapacity) * 100) : 0 },
            { name: 'Fully Booked', value: partialSold, pct: totalCapacity > 0 ? Math.round((partialSold / totalCapacity) * 100) : 0 },
            { name: 'Available', value: available, pct: totalCapacity > 0 ? Math.round((available / totalCapacity) * 100) : 0 },
        ].filter((d) => d.value > 0);
    }, [events, totalTicketsSold, totalCapacity]);

    const monthlyData = useMemo(() => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const map = {};
        months.forEach((m) => {
            map[m] = { month: m, revenue: 0 };
        });
        events.forEach((e) => {
            const m = dayjs(e.startDate).format('MMM');
            if (map[m]) {
                map[m].revenue += e.totalRevenue || 0;
            }
        });
        return months.map((m) => map[m]);
    }, [events]);

    const categoryStats = useMemo(() => {
        const map = {};
        events.forEach((e) => {
            const cat = e.categoryName || 'Other';
            if (!map[cat]) map[cat] = 0;
            map[cat]++;
        });
        return Object.entries(map)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }, [events]);

    const maxCategoryCount = Math.max(1, ...categoryStats.map((c) => c.count));

    return (
        <div className="p-8 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                    Dashboard
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Welcome back! Here's an overview of your events.
                </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-3 gap-5 mb-8">
                <StatCard
                    icon={CalendarDays}
                    label="Total Events"
                    value={stats.totalEvents}
                    loading={loading}
                />
                <StatCard
                    icon={BookOpen}
                    label="Total Bookings"
                    value={totalBookings}
                    loading={loading}
                />
                <StatCard
                    icon={Ticket}
                    label="Tickets Sold"
                    value={totalTicketsSold}
                    loading={loading}
                />
            </div>

            {/* Charts Row — Ticket Sales (left, full height) | Sales Revenue + Popular Events (right) */}
            <div className="grid grid-cols-12 gap-6 mb-8">
                {/* Ticket Sales - Donut */}
                <div className="col-span-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-bold text-gray-900">Ticket Sales</h2>
                        <button className="flex items-center gap-1 text-xs text-gray-400 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition">
                            This Week <ChevronDown size={14} />
                        </button>
                    </div>

                    {totalCapacity === 0 && !loading ? (
                        <div className="flex items-center justify-center flex-1 text-sm text-gray-400">
                            No ticket data yet
                        </div>
                    ) : (
                        <>
                            {/* Donut chart centered */}
                            <div className="flex justify-center py-4">
                                <div className="w-52 h-52">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={donutData}
                                                dataKey="value"
                                                innerRadius={60}
                                                outerRadius={85}
                                                paddingAngle={3}
                                                startAngle={90}
                                                endAngle={-270}
                                                stroke="none"
                                            >
                                                {donutData.map((_, i) => (
                                                    <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <DonutCenter total={totalCapacity} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Legend rows below the chart */}
                            <div className="mt-auto space-y-0 border-t border-gray-100">
                                {donutData.map((d, i) => (
                                    <div
                                        key={d.name}
                                        className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span
                                                className="w-3.5 h-8 rounded-sm shrink-0"
                                                style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }}
                                            />
                                            <div>
                                                <p className="text-xs text-gray-400 leading-none mb-1">{d.name}</p>
                                                <p className="text-lg font-bold text-gray-900 leading-none">
                                                    {d.value.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-500 bg-gray-100 rounded-lg px-3 py-1">
                                            {d.pct}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Right column: Sales Revenue + Popular Events stacked */}
                <div className="col-span-7 flex flex-col gap-6">
                    {/* Sales Revenue - Bar Chart */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-1">
                            <h2 className="text-lg font-bold text-gray-900">Sales Revenue</h2>
                            <button className="flex items-center gap-1 text-xs text-gray-400 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition">
                                Last 8 Months <ChevronDown size={14} />
                            </button>
                        </div>
                        <div className="mb-4">
                            <p className="text-xs text-gray-400">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatVND(totalRevenue)}
                            </p>
                        </div>

                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={monthlyData} barSize={22}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 11 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 11 }}
                                    tickFormatter={(v) => v >= 1_000_000 ? `${(v / 1_000_000).toFixed(0)}M` : v >= 1_000 ? `${(v / 1_000).toFixed(0)}K` : v}
                                />
                                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: '#f0fdf4' }} />
                                <Bar dataKey="revenue" name="Revenue" fill={ACCENT} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Popular Events */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold text-gray-900">Popular Events</h2>
                            <button className="flex items-center gap-1 text-xs text-gray-400 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition">
                                Popular <ChevronDown size={14} />
                            </button>
                        </div>

                        {categoryStats.length === 0 && !loading ? (
                            <div className="text-sm text-gray-400 text-center py-6">
                                No category data yet
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {categoryStats.map((cat) => {
                                    const pct = Math.round(
                                        (cat.count / (stats.totalEvents || 1)) * 100,
                                    );
                                    const barWidth = Math.max(8, (cat.count / maxCategoryCount) * 100);
                                    return (
                                        <div key={cat.name} className="flex items-center gap-4">
                                            <span className="text-sm font-medium text-gray-700 w-24 shrink-0">
                                                {cat.name}
                                            </span>
                                            <span
                                                className="text-xs font-bold text-white rounded-md px-2.5 py-1 shrink-0 min-w-11 text-center"
                                                style={{ backgroundColor: getCategoryColor(cat.name) }}
                                            >
                                                {pct}%
                                            </span>
                                            <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${barWidth}%`,
                                                        backgroundColor: getCategoryColor(cat.name),
                                                    }}
                                                />
                                            </div>
                                            <span className="text-sm text-gray-500 shrink-0 w-24 text-right">
                                                <span className="font-bold text-gray-700">
                                                    {cat.count.toLocaleString()}
                                                </span>
                                                {' '}
                                                <span className="text-xs text-gray-400">Events</span>
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* All Events */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-base font-bold text-gray-800">All Events</h2>
                    <button
                        onClick={() => navigate('/organizer/my-events')}
                        className="flex items-center gap-1 text-sm font-medium hover:underline transition"
                        style={{ color: ACCENT }}
                    >
                        View All Event <ArrowRight size={16} />
                    </button>
                </div>

                {loading ? (
                    <div className="py-16 text-center">
                        <div className="inline-block w-8 h-8 border-3 border-gray-200 border-t-[#2d3a4f] rounded-full animate-spin" />
                        <p className="text-sm text-gray-400 mt-3">Loading events...</p>
                    </div>
                ) : events.length === 0 ? (
                    <div className="py-16 text-center">
                        <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                        <p className="text-gray-500 font-medium">No events yet</p>
                        <p className="text-sm text-gray-400 mt-1">
                            Create your first event to see it here.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-5">
                        {events.slice(0, 6).map((event) => {
                            const catColor = getCategoryColor(event.categoryName);
                            return (
                                <div
                                    key={event.eventId}
                                    className="group rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => navigate(`/organizer/events/${event.eventId}`)}
                                >
                                    <div className="relative h-40 bg-gray-200 overflow-hidden">
                                        {event.bannerUrl ? (
                                            <img
                                                src={event.bannerUrl}
                                                alt={event.eventName}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                                                <Calendar size={32} className="text-slate-400" />
                                            </div>
                                        )}
                                        {event.categoryName && (
                                            <span
                                                className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-semibold text-white shadow-sm"
                                                style={{ backgroundColor: catColor }}
                                            >
                                                {event.categoryName}
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-sm font-bold text-gray-900 truncate mb-1">
                                            {event.eventName}
                                        </h3>
                                        <div className="flex items-center gap-1 text-xs text-gray-400">
                                            <MapPin size={12} className="shrink-0" />
                                            <span className="truncate">
                                                {event.location || 'No location'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                            <CalendarDays size={12} className="shrink-0" />
                                            <span>
                                                {dayjs(event.startDate).format('DD MMM YYYY')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrganizerDashboardPage;
