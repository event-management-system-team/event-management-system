import {
    Calendar,
    CheckCircle,
    Bell,
    Zap,
    CalendarCheck,
    ChevronRight,
    Filter,
    Search,
    ArrowUpDown,
} from 'lucide-react';
import {Button} from "../../components/Button.jsx";
import {Input} from "../../components/Input.jsx";
import {Avatar, AvatarFallback} from "../../components/Avatar.jsx";
import {Card, CardContent, CardHeader, CardTitle} from "../../components/Card.jsx";
import {Badge} from "../../components/Badge.jsx";
import {AdminSidebar} from "../../components/AdminSidebar.jsx";

// Mock data for admin-level system-wide metrics
const summaryMetrics = [
    {
        title: 'TOTAL EVENTS',
        value: '248',
        icon: Calendar,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
    },
    {
        title: 'ACTIVE EVENTS',
        value: '67',
        icon: Zap,
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
    },
    {
        title: 'UPCOMING EVENTS',
        value: '123',
        icon: CalendarCheck,
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
    },
    {
        title: 'COMPLETED EVENTS',
        value: '58',
        icon: CheckCircle,
        iconBg: 'bg-gray-100',
        iconColor: 'text-gray-600',
    },
];

const recentEvents = [
    {
        id: 1,
        name: 'Tech Conference 2026',
        location: 'San Francisco, CA',
        date: 'Mar 15, 2026',
        time: '09:00 AM',
        status: 'Active',
        statusVariant: 'default',
        thumbnail: 'TC',
        thumbnailBg: 'bg-slate-800',
        ticketsSold: 847,
        ticketsTotal: 1000,
        ticketsProgress: 85,
    },
    {
        id: 2,
        name: 'Summer Music Festival',
        location: 'Los Angeles, CA',
        date: 'Jun 20, 2026',
        time: '02:00 PM',
        status: 'Upcoming',
        statusVariant: 'secondary',
        thumbnail: 'SM',
        thumbnailBg: 'bg-blue-600',
        ticketsSold: 2340,
        ticketsTotal: 5000,
        ticketsProgress: 47,
    },
    {
        id: 3,
        name: 'Workshop Series: Design Thinking',
        location: 'New York, NY',
        date: 'Feb 28, 2026',
        time: '10:00 AM',
        status: 'Active',
        statusVariant: 'default',
        thumbnail: 'WS',
        thumbnailBg: 'bg-amber-700',
        ticketsSold: 156,
        ticketsTotal: 200,
        ticketsProgress: 78,
    },
    {
        id: 4,
        name: 'Charity Gala Evening',
        location: 'Chicago, IL',
        date: 'Apr 5, 2026',
        time: '06:00 PM',
        status: 'Upcoming',
        statusVariant: 'secondary',
        thumbnail: 'CG',
        thumbnailBg: 'bg-slate-600',
        ticketsSold: 420,
        ticketsTotal: 500,
        ticketsProgress: 84,
    },
    {
        id: 5,
        name: 'Digital Marketing Summit',
        location: 'Austin, TX',
        date: 'Jan 22, 2026',
        time: '08:30 AM',
        status: 'Completed',
        statusVariant: 'outline',
        thumbnail: 'DM',
        thumbnailBg: 'bg-green-700',
        ticketsSold: 650,
        ticketsTotal: 650,
        ticketsProgress: 100,
    },
];

export function AdminDashboard() {
    return (
        <>
            <div className="flex h-screen bg-[#F5F5F7]">
                {/* Sidebar */}
                <AdminSidebar />

                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    {/* Header */}
                    <header className="bg-white border-b border-gray-200 px-8 py-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>Home</span>
                                <ChevronRight className="h-4 w-4"/>
                                <span>Admin Dashboard</span>
                            </div>
                            <div className="flex items-center gap-3">
                                {/* Search Bar */}
                                <div className="relative">
                                    <Search
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                                    <Input
                                        type="text"
                                        placeholder="Search events..."
                                        className="pl-9 pr-4 py-2 w-70 rounded-full border-gray-300 focus:ring-[#7FA5A5] focus:border-[#7FA5A5]"
                                    />
                                </div>
                                {/* Notification Icon */}
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                                    <Bell className="h-5 w-5 text-gray-600"/>
                                </Button>

                                {/* Profile Icon */}
                                <Avatar className="w-9 h-9 cursor-pointer">
                                    <AvatarFallback className="bg-[#7FA5A5] text-white text-sm">AR</AvatarFallback>
                                </Avatar>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-foreground text-2xl mb-1 font-semibold">Admin Dashboard Overview</h1>
                            <p className="text-gray-500 text-sm">
                                System-wide event management and platform insights
                            </p>
                        </div>
                    </header>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-4 gap-5 p-8">

                        {summaryMetrics.map((metric, index) => {
                            const Icon = metric.icon;
                            return (
                                <Card key={index} className="bg-white shadow-sm border border-gray-200">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <div
                                                className={`w-10 h-10 ${metric.iconBg} rounded-lg flex items-center justify-center`}>
                                                <Icon className={`h-5 w-5 ${metric.iconColor}`}/>
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500 mb-1 tracking-wide">
                                            {metric.title}
                                        </div>
                                        <div className="text-3xl font-semibold text-gray-900">{metric.value}</div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Main Content Section - Recent Events */}
                    <div className="px-8 pb-8">
                        <Card className="bg-white shadow-sm border border-gray-200">
                            <CardHeader className="border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl">Recent Events</CardTitle>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <ArrowUpDown className="h-4 w-4 text-gray-500"/>
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Filter className="h-4 w-4 text-gray-500"/>
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {/* Table Header */}
                                <div
                                    className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide">
                                    <div className="col-span-3">Event</div>
                                    <div className="col-span-2">Location</div>
                                    <div className="col-span-2">Date & Time</div>
                                    <div className="col-span-2">Status</div>
                                    <div className="col-span-2">Tickets</div>
                                    <div className="col-span-1 text-right">Actions</div>
                                </div>

                                {/* Event Rows */}
                                {recentEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 last:border-0 items-center hover:bg-gray-50"
                                    >
                                        <div className="col-span-3 flex items-center gap-3">
                                            <Avatar className={`w-10 h-10 ${event.thumbnailBg}`}>
                                                <AvatarFallback className="text-white text-xs">
                                                    {event.thumbnail}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium text-sm text-gray-900">{event.name}</div>
                                            </div>
                                        </div>
                                        <div className="col-span-2 text-sm text-gray-600">
                                            {event.location}
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-sm text-gray-900">{event.date}</div>
                                            <div className="text-xs text-gray-500">{event.time}</div>
                                        </div>
                                        <div className="col-span-2">
                                            <Badge
                                                variant={event.statusVariant}
                                                className={
                                                    event.statusVariant === 'default'
                                                        ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                                        : event.statusVariant === 'secondary'
                                                            ? 'bg-orange-100 text-orange-700 hover:bg-orange-100'
                                                            : ''
                                                }
                                            >
                                                ● {event.status}
                                            </Badge>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-500 rounded-full"
                                                        style={{width: `${event.ticketsProgress}%`}}
                                                    />
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                {event.ticketsSold}/{event.ticketsTotal}
                                            </div>
                                        </div>
                                        <div className="col-span-1 text-right">
                                            <Button variant="ghost" size="sm"
                                                    className="text-gray-500 hover:text-gray-900">
                                                Manage
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                {/* Footer */}
                                <div className="px-6 py-4 flex items-center justify-between text-sm text-gray-600">
                                    <div>Showing {recentEvents.length} recent events</div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className='border border-gray-200'>Previous</Button>
                                        <Button variant="outline" size="sm" className='border border-gray-200'>Next</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </>
    );
}