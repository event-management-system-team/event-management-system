import {
    Calendar,
    Users,
    TrendingUp,
    CheckCircle,
    Plus,
    Settings,
    BarChart3,
    UserPlus,
    Bell,
    Zap,
    CalendarCheck,
    Home,
    ChevronRight,
    Filter,
    Search,
    HelpCircle,
    ArrowUpDown,
    LogOut,
    LayoutDashboard,
    UserCircle,
    CalendarCog,
    TrendingDown,
    Eye,
    DollarSign,
    Percent,
    Target,
    Download,
    FileText,
    Music,
    Briefcase,
    Utensils,
    GraduationCap,
    AlertTriangle,
    Award,
    X
} from 'lucide-react';
import {Link} from 'react-router';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import {useState} from 'react';
import {AdminSidebar} from "../../components/domain/admin/AdminSidebar.jsx";
import {Button} from "../../components/domain/admin/Button.jsx";
import {Avatar, AvatarFallback} from "../../components/domain/admin/Avatar.jsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../../components/domain/admin/Card.jsx";
import {Input} from "../../components/domain/admin/Input.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../../components/domain/admin/Select.jsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "../../components/domain/admin/Dialog.jsx";
import {Badge} from "../../components/domain/admin/Badge.jsx";

// Mock data for global analytics
const globalMetrics = [
    {
        title: "TOTAL EVENTS",
        value: "1,284",
        change: "+15.3%",
        trending: "up",
        icon: Calendar,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600"
    },
    {
        title: "ACTIVE EVENTS",
        value: "342",
        change: "+22.1%",
        trending: "up",
        icon: Zap,
        iconBg: "bg-green-100",
        iconColor: "text-green-600"
    },
    {
        title: "TOTAL TICKETS SOLD",
        value: "89,547",
        change: "+18.7%",
        trending: "up",
        icon: Target,
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600"
    },
    {
        title: "TOTAL REVENUE",
        value: "$2.4M",
        change: "+24.3%",
        trending: "up",
        icon: DollarSign,
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-600"
    },
    {
        title: "AVG ATTENDANCE RATE",
        value: "87.2%",
        change: "+3.5%",
        trending: "up",
        icon: Users,
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600"
    },
    {
        title: "CONVERSION RATE",
        value: "12.4%",
        change: "-2.1%",
        trending: "down",
        icon: Percent,
        iconBg: "bg-red-100",
        iconColor: "text-red-600"
    }
]

// Mock event performance data
const eventPerformanceData = [
    {
        id: 1,
        name: "Tech Conference 2026",
        category: "Technology",
        categoryIcon: Briefcase,
        thumbnail: "TC",
        thumbnailBg: "bg-slate-800",
        date: "Mar 15, 2026",
        time: "09:00 AM",
        ticketsSold: 847,
        capacity: 1000,
        progress: 85,
        revenue: "$42,350",
        revenueValue: 42350,
        attendanceRate: 92,
        status: "Upcoming",
        statusVariant: "secondary"
    },
    {
        id: 2,
        name: "Summer Music Festival",
        category: "Music",
        categoryIcon: Music,
        thumbnail: "SM",
        thumbnailBg: "bg-blue-600",
        date: "Jun 20, 2026",
        time: "02:00 PM",
        ticketsSold: 4680,
        capacity: 5000,
        progress: 94,
        revenue: "$234,000",
        revenueValue: 234000,
        attendanceRate: 88,
        status: "Upcoming",
        statusVariant: "secondary"
    },
    {
        id: 3,
        name: "Workshop Series: Design",
        category: "Education",
        categoryIcon: GraduationCap,
        thumbnail: "WS",
        thumbnailBg: "bg-amber-700",
        date: "Feb 28, 2026",
        time: "10:00 AM",
        ticketsSold: 156,
        capacity: 200,
        progress: 78,
        revenue: "$7,800",
        revenueValue: 7800,
        attendanceRate: 65,
        status: "Ongoing",
        statusVariant: "default"
    },
    {
        id: 4,
        name: "Charity Gala Evening",
        category: "Charity",
        categoryIcon: Users,
        thumbnail: "CG",
        thumbnailBg: "bg-slate-600",
        date: "Apr 5, 2026",
        time: "06:00 PM",
        ticketsSold: 500,
        capacity: 500,
        progress: 100,
        revenue: "$125,000",
        revenueValue: 125000,
        attendanceRate: 96,
        status: "Upcoming",
        statusVariant: "secondary"
    },
    {
        id: 5,
        name: "Digital Marketing Summit",
        category: "Business",
        categoryIcon: Briefcase,
        thumbnail: "DM",
        thumbnailBg: "bg-green-700",
        date: "Jan 22, 2026",
        time: "08:30 AM",
        ticketsSold: 650,
        capacity: 650,
        progress: 100,
        revenue: "$32,500",
        revenueValue: 32500,
        attendanceRate: 94,
        status: "Completed",
        statusVariant: "outline"
    },
    {
        id: 6,
        name: "Food & Wine Festival",
        category: "Food & Beverage",
        categoryIcon: Utensils,
        thumbnail: "FW",
        thumbnailBg: "bg-orange-600",
        date: "Aug 12, 2026",
        time: "12:00 PM",
        ticketsSold: 320,
        capacity: 1500,
        progress: 21,
        revenue: "$16,000",
        revenueValue: 16000,
        attendanceRate: 45,
        status: "Upcoming",
        statusVariant: "secondary"
    }
]

// Chart data - Ticket sales over time
const ticketSalesData = [
    {month: "Jan", sales: 4200},
    {month: "Feb", sales: 5800},
    {month: "Mar", sales: 7200},
    {month: "Apr", sales: 6500},
    {month: "May", sales: 8900},
    {month: "Jun", sales: 10200},
    {month: "Jul", sales: 9800},
    {month: "Aug", sales: 11500}
]

// Revenue per event (top 8)
const revenueByEventData = [
    {name: "Summer Music", revenue: 234000},
    {name: "Charity Gala", revenue: 125000},
    {name: "Tech Conf", revenue: 42350},
    {name: "Marketing", revenue: 32500},
    {name: "Food Fest", revenue: 16000},
    {name: "Workshop", revenue: 7800}
]

// Event category distribution
const categoryDistributionData = [
    {name: "Technology", value: 324, color: "#3B82F6"},
    {name: "Music", value: 198, color: "#8B5CF6"},
    {name: "Education", value: 287, color: "#F59E0B"},
    {name: "Business", value: 215, color: "#10B981"},
    {name: "Food & Beverage", value: 142, color: "#F97316"},
    {name: "Other", value: 118, color: "#6B7280"}
]

// Funnel data
const funnelData = [
    {stage: "Views", value: 125000, color: "#93C5FD"},
    {stage: "Registrations", value: 45000, color: "#60A5FA"},
    {stage: "Tickets", value: 18500, color: "#3B82F6"},
    {stage: "Attendance", value: 16125, color: "#1E40AF"}
]

// Top performing events
const topPerformingEvents = [
    {
        name: "Summer Music Festival",
        metric: "$234,000",
        badge: "Revenue",
        avatarBg: "bg-blue-600",
        avatar: "SM"
    },
    {
        name: "Charity Gala Evening",
        metric: "$125,000",
        badge: "Revenue",
        avatarBg: "bg-slate-600",
        avatar: "CG"
    },
    {
        name: "Tech Conference 2026",
        metric: "96%",
        badge: "Attendance",
        avatarBg: "bg-slate-800",
        avatar: "TC"
    },
    {
        name: "Digital Marketing Summit",
        metric: "94%",
        badge: "Attendance",
        avatarBg: "bg-green-700",
        avatar: "DM"
    },
    {
        name: "Summer Music Festival",
        metric: "4,680",
        badge: "Tickets",
        avatarBg: "bg-blue-600",
        avatar: "SM"
    }
]

// Underperforming events
const underperformingEvents = [
    {
        name: "Food & Wine Festival",
        metric: "21%",
        issue: "Low ticket sales",
        avatarBg: "bg-orange-600",
        avatar: "FW",
        severity: "high"
    },
    {
        name: "Workshop Series: Design",
        metric: "65%",
        issue: "Low attendance rate",
        avatarBg: "bg-amber-700",
        avatar: "WS",
        severity: "medium"
    },
    {
        name: "Indie Film Festival",
        metric: "0%",
        issue: "No sales yet",
        avatarBg: "bg-rose-600",
        avatar: "IF",
        severity: "high"
    }
]

export function EventAnalytics() {
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)

    const handleViewDetails = event => {
        setSelectedEvent(event)
        setIsDetailOpen(true)
    }

    return (
        <>
            <div className="flex h-screen bg-[#F5F5F7]">
                {/* Sidebar */}
                <AdminSidebar/>

                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    {/* Header */}
                    <header className="bg-white border-b border-gray-200 px-8 py-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>Dashboard</span>
                                <ChevronRight className="h-4 w-4"/>
                                <span>Event Analytics</span>
                            </div>
                            <div className="flex items-center gap-3">
                                {/* Search Bar */}
                                <div className="relative">
                                    <Search
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                                    <Input
                                        type="text"
                                        placeholder="Search events..."
                                        className="pl-9 pr-4 py-2 w-[280px] rounded-full border-gray-300 focus:ring-[#7FA5A5] focus:border-[#7FA5A5]"
                                    />
                                </div>
                                {/* Notification Icon */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 rounded-full"
                                >
                                    <Bell className="h-5 w-5 text-gray-600"/>
                                </Button>
                                {/* Profile Icon */}
                                <Avatar className="w-9 h-9 cursor-pointer">
                                    <AvatarFallback className="bg-[#7FA5A5] text-white text-sm">
                                        AR
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        </div>
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-foreground text-2xl mb-1 font-semibold">Event Analytics</h1>
                                <p className="text-gray-500 text-sm">
                                    Comprehensive performance metrics and insights across all events
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" className="gap-2">
                                    <Download className="h-4 w-4"/>
                                    Export CSV
                                </Button>
                                <Button variant="outline" className="gap-2">
                                    <FileText className="h-4 w-4"/>
                                    Generate Report
                                </Button>
                            </div>
                        </div>
                    </header>

                    {/* Global Analytics Overview */}
                    <div className="grid grid-cols-6 gap-4 p-8 pb-6">
                        {globalMetrics.map((metric, index) => {
                            const Icon = metric.icon
                            const TrendIcon =
                                metric.trending === "up" ? TrendingUp : TrendingDown
                            return (
                                <Card key={index} className="bg-white shadow-sm border border-gray-200">
                                    <CardContent className="p-5">
                                        <div className="flex items-start justify-between mb-2">
                                            <div
                                                className={`w-9 h-9 ${metric.iconBg} rounded-lg flex items-center justify-center`}
                                            >
                                                <Icon className={`h-4 w-4 ${metric.iconColor}`}/>
                                            </div>
                                            <div
                                                className={`flex items-center gap-0.5 text-xs ${
                                                    metric.trending === "up"
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                <TrendIcon className="h-3 w-3"/>
                                                <span>{metric.change}</span>
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500 mb-1 tracking-wide">
                                            {metric.title}
                                        </div>
                                        <div className="text-2xl font-semibold text-gray-900">
                                            {metric.value}
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>

                    {/* Filters & Search */}
                    <div className="px-8 pb-6">
                        <Card className="bg-white shadow-sm border border-gray-200">
                            <CardContent className="p-5">
                                <div className="flex items-center gap-3">
                                    {/* Search Input */}
                                    <div className="relative flex-1">
                                        <Search
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                                        <Input
                                            type="text"
                                            placeholder="Search by event name or organizer..."
                                            className="pl-9 pr-4 py-2 w-full border-gray-300"
                                        />
                                    </div>

                                    {/* Date Range */}
                                    <Select defaultValue="30days">
                                        <SelectTrigger className="w-[160px] border border-gray-200">
                                            <SelectValue/>
                                        </SelectTrigger>
                                        <SelectContent className='border border-gray-200'>
                                            <SelectItem value="7days">Last 7 days</SelectItem>
                                            <SelectItem value="30days">Last 30 days</SelectItem>
                                            <SelectItem value="90days">Last 90 days</SelectItem>
                                            <SelectItem value="custom">Custom range</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {/* Category Filter */}
                                    <Select defaultValue="all">
                                        <SelectTrigger className="w-[150px] border border-gray-200">
                                            <SelectValue/>
                                        </SelectTrigger>
                                        <SelectContent className='border border-gray-200'>
                                            <SelectItem value="all">All Categories</SelectItem>
                                            <SelectItem value="technology">Technology</SelectItem>
                                            <SelectItem value="music">Music</SelectItem>
                                            <SelectItem value="education">Education</SelectItem>
                                            <SelectItem value="business">Business</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {/* Status Filter */}
                                    <Select defaultValue="all">
                                        <SelectTrigger className="w-[140px] border border-gray-200">
                                            <SelectValue/>
                                        </SelectTrigger>
                                        <SelectContent className='border border-gray-200'>
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="upcoming">Upcoming</SelectItem>
                                            <SelectItem value="ongoing">Ongoing</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {/* Apply Button */}
                                    <Button className="bg-[#7FA5A5] hover:bg-[#6D9393] text-white">
                                        Apply Filters
                                    </Button>

                                    {/* Reset Button */}
                                    <Button variant="outline">Reset</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Data Visualization Section */}
                    <div className="grid grid-cols-2 gap-5 px-8 pb-6">
                        {/* Ticket Sales Over Time */}
                        <Card className="bg-white shadow-sm border border-gray-200">
                            <CardHeader className="border-b border-gray-100">
                                <CardTitle className="text-lg">Ticket Sales Trend</CardTitle>
                                <CardDescription>
                                    Monthly ticket sales performance
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <ResponsiveContainer width="100%" height={240}>
                                    <LineChart data={ticketSalesData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB"/>
                                        <XAxis
                                            dataKey="month"
                                            tick={{fontSize: 12}}
                                            stroke="#6B7280"
                                        />
                                        <YAxis tick={{fontSize: 12}} stroke="#6B7280"/>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#fff",
                                                border: "1px solid #E5E7EB",
                                                borderRadius: "6px",
                                                fontSize: "12px"
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="sales"
                                            stroke="#3B82F6"
                                            strokeWidth={2}
                                            dot={{r: 4}}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Revenue by Event */}
                        <Card className="bg-white shadow-sm  border border-gray-200">
                            <CardHeader className="border-b border-gray-100">
                                <CardTitle className="text-lg">Revenue by Event</CardTitle>
                                <CardDescription>
                                    Top performing events by revenue
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <ResponsiveContainer width="100%" height={240}>
                                    <BarChart data={revenueByEventData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB"/>
                                        <XAxis
                                            dataKey="name"
                                            tick={{fontSize: 11}}
                                            stroke="#6B7280"
                                        />
                                        <YAxis tick={{fontSize: 12}} stroke="#6B7280"/>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#fff",
                                                border: "1px solid #E5E7EB",
                                                borderRadius: "6px",
                                                fontSize: "12px"
                                            }}
                                            formatter={value => `$${value.toLocaleString()}`}
                                        />
                                        <Bar dataKey="revenue" fill="#10B981" radius={[6, 6, 0, 0]}/>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Event Category Distribution */}
                        <Card className="bg-white shadow-sm border border-gray-200">
                            <CardHeader className="border-b border-gray-100">
                                <CardTitle className="text-lg">Event Distribution</CardTitle>
                                <CardDescription>Events by category breakdown</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <ResponsiveContainer width="100%" height={240}>
                                    <PieChart>
                                        <Pie
                                            data={categoryDistributionData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={2}
                                            dataKey="value"
                                        >
                                            {categoryDistributionData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color}/>
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#fff",
                                                border: "1px solid #E5E7EB",
                                                borderRadius: "6px",
                                                fontSize: "12px"
                                            }}
                                        />
                                        <Legend
                                            layout="vertical"
                                            align="right"
                                            verticalAlign="middle"
                                            iconType="circle"
                                            iconSize={8}
                                            wrapperStyle={{fontSize: "11px"}}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Conversion Funnel */}
                        <Card className="bg-white shadow-sm  border border-gray-200">
                            <CardHeader className="border-b border-gray-100">
                                <CardTitle className="text-lg">Conversion Funnel</CardTitle>
                                <CardDescription>
                                    User journey from views to attendance
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    {funnelData.map((stage, index) => {
                                        const percentage =
                                            index === 0
                                                ? 100
                                                : ((stage.value / funnelData[0].value) * 100).toFixed(1)
                                        return (
                                            <div key={stage.stage}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span
                                                        className="text-sm font-medium text-gray-700">{stage.stage}</span>
                                                    <span className="text-sm font-semibold text-gray-900">{stage.value.toLocaleString()} ({percentage}%)</span>
                                                </div>
                                                <div
                                                    className="h-10 rounded-lg overflow-hidden"
                                                    style={{backgroundColor: "#F3F4F6"}}
                                                >
                                                    <div
                                                        className="h-full flex items-center justify-center text-white text-xs font-medium rounded-lg transition-all"
                                                        style={{
                                                            width: `${percentage}%`,
                                                            backgroundColor: stage.color,
                                                            minWidth: percentage === "100" ? "100%" : "60px"
                                                        }}
                                                    >
                                                        {percentage}%
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Performance Highlights */}
                    <div className="grid grid-cols-2 gap-5 px-8 pb-6">
                        {/* Top Performing Events */}
                        <Card className="bg-white shadow-sm border border-gray-200">
                            <CardHeader className="border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                    <Award className="h-5 w-5 text-green-600"/>
                                    <CardTitle className="text-lg">Top Performing Events</CardTitle>
                                </div>
                                <CardDescription>
                                    Best events by tickets, revenue, and attendance
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="space-y-3">
                                    {topPerformingEvents.map((event, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="text-sm font-semibold text-gray-400 w-6">
                                                    {index + 1}
                                                </div>
                                                <Avatar className={`w-9 h-9 ${event.avatarBg}`}>
                                                    <AvatarFallback className="text-white text-xs">
                                                        {event.avatar}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {event.name}
                                                    </div>
                                                    <Badge
                                                        variant="outline"
                                                        className="mt-1 text-xs bg-green-50 text-green-700 border-green-200"
                                                    >
                                                        {event.badge}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="text-lg font-semibold text-gray-900">
                                                {event.metric}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Underperforming Events */}
                        <Card className="bg-white shadow-sm border border-gray-200">
                            <CardHeader className="border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-orange-600"/>
                                    <CardTitle className="text-lg">
                                        Events Needing Attention
                                    </CardTitle>
                                </div>
                                <CardDescription>
                                    Events with performance issues requiring action
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="space-y-3">
                                    {underperformingEvents.map((event, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-2 h-2 rounded-full ${
                                                        event.severity === "high"
                                                            ? "bg-red-500"
                                                            : "bg-orange-500"
                                                    }`}
                                                />
                                                <Avatar className={`w-9 h-9 ${event.avatarBg}`}>
                                                    <AvatarFallback className="text-white text-xs">
                                                        {event.avatar}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {event.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-0.5">
                                                        {event.issue}
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className={`text-sm font-semibold ${
                                                    event.severity === "high"
                                                        ? "text-red-600"
                                                        : "text-orange-600"
                                                }`}
                                            >
                                                {event.metric}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Event Performance Table */}
                    <div className="px-8 pb-8">
                        <Card className="bg-white shadow-sm border border-gray-200">
                            <CardHeader className="border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">
                                        Event Performance Overview
                                    </CardTitle>
                                    <div className="flex gap-2">
                                        <Select defaultValue="10">
                                            <SelectTrigger className="w-[120px] border border-gray-200">
                                                <SelectValue/>
                                            </SelectTrigger>
                                            <SelectContent className='border border-gray-200'>
                                                <SelectItem value="10">Show 10</SelectItem>
                                                <SelectItem value="25">Show 25</SelectItem>
                                                <SelectItem value="50">Show 50</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button variant="ghost" size="icon" className="h-9 w-9">
                                            <ArrowUpDown className="h-4 w-4 text-gray-500"/>
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {/* Table Header */}
                                <div
                                    className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide items-center">
                                    <div className="col-span-3">Event</div>
                                    <div className="col-span-2">Date & Time</div>
                                    <div className="col-span-2">Tickets Sold</div>
                                    <div className="col-span-1">Revenue</div>
                                    <div className="col-span-1">Attendance</div>
                                    <div className="col-span-2">Status</div>
                                    <div className="col-span-1 text-right">Actions</div>
                                </div>

                                {/* Event Rows */}
                                {eventPerformanceData.map(event => {
                                    const CategoryIcon = event.categoryIcon
                                    return (
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
                                                    <div className="font-medium text-sm text-gray-900">
                                                        {event.name}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                        <CategoryIcon className="h-3 w-3 text-gray-400"/>
                                                        <span className="text-xs text-gray-500">
                            {event.category}
                          </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <div className="text-sm text-gray-900">{event.date}</div>
                                                <div className="text-xs text-gray-500">{event.time}</div>
                                            </div>
                                            <div className="col-span-2">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div
                                                        className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${
                                                                event.progress >= 80
                                                                    ? "bg-green-500"
                                                                    : event.progress >= 50
                                                                        ? "bg-blue-500"
                                                                        : "bg-orange-500"
                                                            }`}
                                                            style={{width: `${event.progress}%`}}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-gray-600 min-w-[35px]">
                          {event.progress}%
                        </span>
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    {event.ticketsSold.toLocaleString()} /{" "}
                                                    {event.capacity.toLocaleString()}
                                                </div>
                                            </div>
                                            <div className="col-span-1 text-sm font-semibold text-gray-900">
                                                {event.revenue}
                                            </div>
                                            <div className="col-span-1">
                                                <div
                                                    className={`text-sm font-medium ${
                                                        event.attendanceRate >= 80
                                                            ? "text-green-600"
                                                            : event.attendanceRate >= 60
                                                                ? "text-blue-600"
                                                                : "text-orange-600"
                                                    }`}
                                                >
                                                    {event.attendanceRate}%
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <Badge
                                                    variant={event.statusVariant}
                                                    className={
                                                        event.statusVariant === "default"
                                                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                                                            : event.statusVariant === "secondary"
                                                                ? "bg-orange-100 text-orange-700 hover:bg-orange-100"
                                                                : ""
                                                    }
                                                >
                                                    ● {event.status}
                                                </Badge>
                                            </div>
                                            <div className="col-span-1 flex justify-end">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-[#7FA5A5] hover:text-[#6D9393] hover:bg-[#7FA5A5]/10"
                                                    onClick={() => handleViewDetails(event)}
                                                >
                                                    View Details
                                                </Button>
                                            </div>
                                        </div>
                                    )
                                })}

                                {/* Footer with Pagination */}
                                <div className="px-6 py-4 flex items-center justify-between text-sm text-gray-600">
                                    <div>Showing 1–6 of {eventPerformanceData.length} events</div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="bg-[#7FA5A5] text-white border-[#7FA5A5] hover:bg-[#6D9393]"
                                        >
                                            1
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            2
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Event Detail Modal */}
                    <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="text-xl">
                                    Event Performance Details
                                </DialogTitle>
                                <DialogDescription>
                                    Comprehensive analytics for {selectedEvent?.name}
                                </DialogDescription>
                            </DialogHeader>

                            {selectedEvent && (
                                <div className="space-y-6 pt-4">
                                    {/* Quick Stats */}
                                    <div className="grid grid-cols-4 gap-4">
                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="text-xs text-gray-500 mb-1">
                                                    Tickets Sold
                                                </div>
                                                <div className="text-2xl font-semibold text-gray-900">
                                                    {selectedEvent.ticketsSold}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    of {selectedEvent.capacity}
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="text-xs text-gray-500 mb-1">Revenue</div>
                                                <div className="text-2xl font-semibold text-gray-900">
                                                    {selectedEvent.revenue}
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="text-xs text-gray-500 mb-1">
                                                    Attendance
                                                </div>
                                                <div className="text-2xl font-semibold text-green-600">
                                                    {selectedEvent.attendanceRate}%
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="text-xs text-gray-500 mb-1">Capacity</div>
                                                <div className="text-2xl font-semibold text-blue-600">
                                                    {selectedEvent.progress}%
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Sales Timeline */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base">
                                                Ticket Sales Timeline
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ResponsiveContainer width="100%" height={200}>
                                                <LineChart data={ticketSalesData.slice(0, 6)}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB"/>
                                                    <XAxis dataKey="month" tick={{fontSize: 12}}/>
                                                    <YAxis tick={{fontSize: 12}}/>
                                                    <Tooltip/>
                                                    <Line
                                                        type="monotone"
                                                        dataKey="sales"
                                                        stroke="#7FA5A5"
                                                        strokeWidth={2}
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </CardContent>
                                    </Card>

                                    {/* Peak Booking Times */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base">
                                                Peak Booking Times
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between py-2 border-b">
                        <span className="text-sm text-gray-600">
                          Monday - Friday (9AM - 5PM)
                        </span>
                                                    <span className="text-sm font-semibold text-gray-900">
                          45%
                        </span>
                                                </div>
                                                <div className="flex items-center justify-between py-2 border-b">
                        <span className="text-sm text-gray-600">
                          Weekends (10AM - 8PM)
                        </span>
                                                    <span className="text-sm font-semibold text-gray-900">
                          35%
                        </span>
                                                </div>
                                                <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-600">
                          Evening (6PM - 11PM)
                        </span>
                                                    <span className="text-sm font-semibold text-gray-900">
                          20%
                        </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Audience Demographics */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base">
                                                Audience Demographics
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <div className="text-xs text-gray-500 mb-2">
                                                        Age Distribution
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-sm">
                                                            <span>18-24</span>
                                                            <span className="font-medium">22%</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span>25-34</span>
                                                            <span className="font-medium">38%</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span>35-44</span>
                                                            <span className="font-medium">25%</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span>45+</span>
                                                            <span className="font-medium">15%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500 mb-2">
                                                        Gender Distribution
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-sm">
                                                            <span>Female</span>
                                                            <span className="font-medium">52%</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span>Male</span>
                                                            <span className="font-medium">45%</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span>Other</span>
                                                            <span className="font-medium">3%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                </main>
            </div>
        </>
    )
}
