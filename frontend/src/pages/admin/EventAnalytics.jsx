import {
    Calendar,
    Users,
    Bell,
    Zap,
    ChevronRight,
    Search,
    DollarSign,
    Target,
    Download,
    FileText
} from 'lucide-react';
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
import { useEffect, useMemo, useState, useRef } from 'react';
import { AdminSidebar } from "../../components/domain/admin/AdminSidebar.jsx";
import { Button } from "../../components/domain/admin/Button.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/domain/admin/Avatar.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/domain/admin/Card.jsx";
import { Input } from "../../components/domain/admin/Input.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/domain/admin/Select.jsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "../../components/domain/admin/Dialog.jsx";
import { Badge } from "../../components/domain/admin/Badge.jsx";
import { adminService } from '../../services/admin.service.js';
import dayjs from "dayjs";
import { DatePicker, Space } from 'antd';
import LoadingState from '../../components/common/LoadingState.jsx';
import html2pdf from 'html2pdf.js';
import html2canvas from "html2canvas";

export function EventAnalytics() {
    const [events, setEvents] = useState([])
    const [summary, setSummary] = useState()
    const [monthlySales, setMonthlySales] = useState([])
    const [topRevenueEvents, setTopRevenueEvents] = useState([])
    const [categoryDis, setCategoryDis] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [status, setStatus] = useState("all")
    const [category, setCategory] = useState("all")
    const [date, setDate] = useState(null)
    const [sortOption, setSortOption] = useState("newest")
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("")

    const [selectedEvent, setSelectedEvent] = useState(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)

    const fetchData = async () => {
        try {
            setLoading(true)

            const [eventRes, summaryRes, salesRes, topRevenueRes, categoryRes, categoriesListRes] = await Promise.all([
                adminService.getEventAnalytics(),
                adminService.getSummaryAnalytics(),
                adminService.getMonthlyTicketSales(),
                adminService.getTopRevenueEvents(),
                adminService.getCategoryDistribution(),
                adminService.getAllCategories()
            ])

            setEvents(eventRes.data)
            setSummary(summaryRes.data)
            setMonthlySales(salesRes.data)
            setTopRevenueEvents(topRevenueRes.data)
            setCategoryDis(categoryRes.data)
            setCategories(categoriesListRes.data)

        } catch (error) {
            setError("Cannot load event analytics")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
    }

    const processedEvents = useMemo(() => {
        let list = [...events];

        if (searchTerm.trim()) {
            const lower = searchTerm.toLowerCase();
            list = list.filter(e =>
                e.eventName?.toLowerCase().includes(lower)
            )
        }

        // filter by status
        list = list.filter(e => status === "all" || e.status === status);

        // filter by category
        list = list.filter(e => category === "all" || e.categoryId === category);

        // filter by date 
        list = list.filter(e => {
            if (!date) return true;

            const selected = dayjs(date);
            const start = dayjs(e.startDate);
            const end = dayjs(e.endDate);

            return (
                selected.isSame(start, "day") ||
                selected.isSame(end, "day")
            );
        });

        // sort by option
        list.sort((a, b) => {
            switch (sortOption) {
                case "newest":
                    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
                case "oldest":
                    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
                default:
                    return 0;
            }
        });

        return list;
    }, [events, searchTerm, status, category, date, sortOption])

    const ticketProgress = (total, sold) => {
        if (!total || total <= 0) return 0
        const progress = (sold / total) * 100

        return Math.min(100, Math.round(progress))
    }

    const formatVND = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount)
    }

    const formatTotalNumber = (num) => {
        return Number(num).toLocaleString('en-US')
    }

    const formatNumber = (num) => {
        return Number(num).toFixed(2)
    }

    const formatMonth = (month) => {
        if (!month) return ""
        return month.toLowerCase().charAt(0).toUpperCase() + month.slice(1).toLowerCase()
    }

    const getStatusVariant = (status) => {
        switch (status) {
            case "APPROVED":
                return "default";
            case "ONGOING":
                return "default";
            case "PENDING":
                return "secondary";
            case "REJECTED":
                return "destructive";
            default:
                return "secondary";
        }
    }

    const getStatusClasses = (status) => {
        switch (status) {
            case "APPROVED":
                return "bg-blue-100 text-blue-600 hover:bg-blue-100";
            case "ONGOING":
                return "bg-green-100 text-green-700 hover:bg-green-100";
            case "PENDING":
                return "bg-orange-100 text-orange-700 hover:bg-orange-100";
            case "REJECTED":
                return "bg-red-100 text-red-700 hover:bg-red-100";
            case "COMPLETED":
                return "bg-gray-200 text-700 hover:bg-gray-200";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    // const handleViewDetails = event => {
    //     setSelectedEvent(event)
    //     setIsDetailOpen(true)
    // }

    const monthlySalesData = monthlySales.map((item, index) => ({
        month: formatMonth(item.month),
        sales: item.ticketsSold,
        revenue: item.revenue
    }))

    const topRevenueEventsData = topRevenueEvents.map((item, index) => ({
        event: item.eventName,
        revenue: item.revenue
    }))

    const categoryDistributionData = categoryDis.map((item, index) => ({
        name: item.categoryName,
        color: item.colorCode,
        events: item.count,
    }))

    const globalMetrics = [
        {
            title: "TOTAL EVENTS",
            value: formatTotalNumber(summary?.totalEvents),
            icon: Calendar,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600"
        },
        {
            title: "ACTIVE EVENTS",
            value: formatTotalNumber(summary?.activeEvents),
            icon: Zap,
            iconBg: "bg-green-100",
            iconColor: "text-green-600"
        },
        {
            title: "TOTAL TICKETS SOLD",
            value: formatTotalNumber(summary?.totalTicketsSold),
            icon: Target,
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600"
        },
        {
            title: "TOTAL REVENUE",
            value: formatVND(summary?.totalRevenue),
            icon: DollarSign,
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-600"
        },
        {
            title: "AVG ATTENDANCE RATE",
            value: `${formatNumber(summary?.averageAttendanceRate)} %`,
            icon: Users,
            iconBg: "bg-orange-100",
            iconColor: "text-orange-600"
        }
    ]

    if (loading) {
        return <LoadingState />
    }

    return (
        <div className="flex h-screen bg-[#F1F0E8]">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Header */}
                <header className="bg-[#f7f7f7] border-b border-gray-200 px-8 py-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>Dashboard</span>
                            <ChevronRight className="h-4 w-4" />
                            <span>Event Analytics</span>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Notification Icon */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-full"
                            >
                                <Bell className="h-5 w-5 text-gray-600" />
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
                            {/* <Button variant="outline" className="gap-2" onClick={handleExportPDF}>
                                <Download className="h-4 w-4" />
                                Export PDF
                            </Button> */}
                            <Button variant="outline" className="gap-2">
                                <FileText className="h-4 w-4" />
                                Generate Report
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Global Analytics Overview */}
                <div className="grid grid-cols-5 gap-4 p-8 pb-6">
                    {globalMetrics.map((metric, index) => {
                        const Icon = metric.icon

                        return (
                            <Card key={index} className="bg-[#f7f7f7] shadow-sm border border-gray-200">
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between mb-2">
                                        <div
                                            className={`w-9 h-9 ${metric.iconBg} rounded-lg flex items-center justify-center`}
                                        >
                                            <Icon className={`h-4 w-4 ${metric.iconColor}`} />
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

                {/* Data Visualization Section */}
                <div className="grid grid-cols-2 gap-5 px-8 pb-6">

                    {/* Ticket Sales By Month */}
                    <Card className="bg-[#f7f7f7] shadow-sm border border-gray-200" id="ticketsSold">
                        <CardHeader className="border-b border-gray-100">
                            <CardTitle className="text-xl font-semibold text-gray-700">Ticket Sales Trend</CardTitle>
                            <CardDescription>
                                Monthly ticket sales performance
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <ResponsiveContainer width='100%' height={240}>
                                <LineChart data={monthlySalesData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis
                                        dataKey="month"
                                        tick={{ fontSize: 12 }}
                                        stroke="#6B7280"
                                    />
                                    <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" />
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
                                        dot={{ r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Revenue By Month */}
                    <Card className="bg-[#f7f7f7] shadow-sm border border-gray-200">
                        <CardHeader className="border-b border-gray-100">
                            <CardTitle className="text-xl font-semibold text-gray-700">Revenue Trend</CardTitle>
                            <CardDescription>
                                Monthly revenue
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <ResponsiveContainer width="100%" height={240}>
                                <BarChart data={monthlySalesData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis
                                        dataKey="month"
                                        tick={{ fontSize: 11 }}
                                        stroke="#6B7280"
                                    />
                                    <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#fff",
                                            border: "1px solid #E5E7EB",
                                            borderRadius: "6px",
                                            fontSize: "12px"
                                        }}
                                        formatter={value => `${formatVND(value)}`}
                                    />
                                    <Bar dataKey="revenue" fill="#10B981" radius={[6, 6, 0, 0]} barSize={80} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Event Category Distribution */}
                    <Card className="bg-[#f7f7f7] shadow-sm border border-gray-200">
                        <CardHeader className="border-b border-gray-100">
                            <CardTitle className="text-xl font-semibold text-gray-700">Event Distribution</CardTitle>
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
                                        dataKey="events"
                                        nameKey="name"
                                    >
                                        {categoryDistributionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
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
                                        wrapperStyle={{ fontSize: "11px" }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Top Events By Revenue */}
                    <Card className="bg-[#f7f7f7] shadow-sm border border-gray-200">
                        <CardHeader className="border-b border-gray-100">
                            <CardTitle className="text-xl font-semibold text-gray-700">Revenue by Event</CardTitle>
                            <CardDescription>
                                Top performing events by revenue
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <ResponsiveContainer width="100%" height={240}>
                                <BarChart data={topRevenueEventsData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis
                                        dataKey="event"
                                        tick={{ fontSize: 11 }}
                                        stroke="#6B7280"
                                    />
                                    <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#fff",
                                            border: "1px solid #E5E7EB",
                                            borderRadius: "6px",
                                            fontSize: "12px"
                                        }}
                                        formatter={value => `${formatVND(value)}`}
                                    />
                                    <Bar dataKey="revenue" fill="#2e96ea" radius={[6, 6, 0, 0]} barSize={60} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters & Search */}
                <div className="px-8 pb-6">
                    <Card className="bg-[#f7f7f7] shadow-sm border border-gray-200">
                        <CardContent className="p-5">
                            <div className="grid grid-cols-8 gap-4 items-end">

                                {/* Search Input */}
                                <div className="relative flex-4 col-span-4">
                                    <Search
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Search by event name..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        className="pl-9 pr-4 py-2 w-full border-gray-300"
                                    />
                                </div>

                                {/* Category Filter */}
                                <div className="col-span-1">
                                    <Select
                                        value={category}
                                        onValueChange={(value) => setCategory(value)}
                                    >
                                        <SelectTrigger className='border border-gray-200 cursor-pointer bg-[#f7f7f7] hover:bg-[#B3C8CF]'>
                                            <SelectValue placeholder="Category" />
                                        </SelectTrigger>
                                        <SelectContent className='border border-gray-200'>
                                            <SelectItem value="all">All Category</SelectItem>
                                            {categories?.map(c => (
                                                <SelectItem
                                                    key={c.categoryId}
                                                    value={c.categoryId}
                                                >
                                                    {c.categoryName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Status Filter */}
                                <div className="col-span-1">
                                    <Select
                                        value={status}
                                        onValueChange={(value) => setStatus(value)}
                                    >
                                        <SelectTrigger className='border border-gray-200 cursor-pointer bg-[#f7f7f7] hover:bg-[#B3C8CF]'>
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent className='border border-gray-200'>
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="PENDING">Pending</SelectItem>
                                            <SelectItem value="APPROVED">Approved</SelectItem>
                                            <SelectItem value="COMPLETED">Completed</SelectItem>
                                            <SelectItem value="REJECTED">Rejected</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Date Range */}
                                <div className="col-span-1">
                                    <Space vertical className=''>
                                        <DatePicker
                                            size="large"
                                            style={{ height: 36, backgroundColor: '#f7f7f7' }}
                                            onChange={(date) => setDate(date)}
                                        />
                                    </Space>
                                </div>

                                {/* Sort Dropdown */}
                                <div className="col-span-1">
                                    <Select
                                        value={sortOption}
                                        onValueChange={(value) => setSortOption(value)}
                                    >
                                        <SelectTrigger
                                            className="w-[140px] border border-gray-200 cursor-pointer bg-[#f7f7f7] hover:bg-[#B3C8CF]">
                                            <SelectValue placeholder="Sort by" />
                                        </SelectTrigger>
                                        <SelectContent className='border border-gray-200'>
                                            <SelectItem value="newest">Newest</SelectItem>
                                            <SelectItem value="oldest">Oldest</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Event Performance Table */}
                <div className="px-8 pb-8">
                    <Card className="bg-[#f7f7f7] shadow-sm border border-gray-200">
                        <CardContent className="p-0">
                            {/* Table Header */}
                            <div
                                className="grid grid-cols-10 gap-4 px-6 py-3 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide items-center">
                                <div className="col-span-3">Event</div>
                                <div className="col-span-2">Date & Time</div>
                                <div className="col-span-2">Tickets Sold</div>
                                <div className="col-span-1 text-center">Revenue</div>
                                <div className="col-span-1 text-center">Attendance</div>
                                <div className="col-span-1 text-center">Status</div>
                                {/* <div className="col-span-1 text-right">Actions</div> */}
                            </div>

                            {/* Event Rows */}
                            {processedEvents?.map(event => {
                                // const CategoryIcon = event.categoryIcon
                                const progress = ticketProgress(event.totalCapacity, event.ticketsSold)
                                const containData = ["ONGOING", "COMPLETED"].includes(event.status)
                                const attendanceRate = event.attendanceRate * 100
                                return (
                                    <div
                                        key={event.eventId}
                                        className="grid grid-cols-10 gap-4 px-6 py-4 border-b border-gray-100 last:border-0 items-center hover:bg-[#eef3f5]"
                                    >
                                        <div className="col-span-3 flex items-center gap-3">
                                            <Avatar className='w-10 h-10'>
                                                {event.bannerUrl ? (
                                                    <AvatarImage src={event.bannerUrl} alt={event.eventName} />
                                                ) : (
                                                    <AvatarFallback className="bg-gray-300" />
                                                )}
                                            </Avatar>
                                            <div>
                                                <div className="font-medium text-sm text-gray-900">
                                                    {event.eventName}
                                                </div>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <span className="text-xs text-gray-500">
                                                        {event.categoryName}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-sm text-gray-900">
                                                {dayjs(event.startDate).format("MMM DD, YYYY")}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {dayjs(event.startDate).format("hh:mm A")} -{" "}
                                                {dayjs(event.endDate).format("hh:mm A")}
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div
                                                    className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${progress >= 80
                                                            ? "bg-green-500"
                                                            : progress >= 50
                                                                ? "bg-blue-500"
                                                                : "bg-orange-500"
                                                            }`}
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-gray-600 min-w-[35px]">
                                                    {progress}%
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                {event.ticketsSold.toLocaleString()} /{" "}
                                                {event.totalCapacity.toLocaleString()}
                                            </div>
                                        </div>
                                        <div className={`col-span-1 text-sm text-center ${!containData ? 'text-gray-400' : 'font-semibold text-gray-600'}`}>
                                            {/* {formatVND(event.revenue)} */}
                                            {containData ? `${formatVND(event.revenue)}` : '-'}
                                        </div>
                                        <div className="col-span-1">
                                            <div
                                                className={`text-sm font-medium text-center ${!containData
                                                    ? "text-gray-400"
                                                    : attendanceRate >= 80
                                                        ? "text-green-600"
                                                        : attendanceRate >= 60
                                                            ? "text-blue-600"
                                                            : "text-orange-600"
                                                    }`}
                                            >
                                                {containData ? `${formatNumber(attendanceRate)} %` : '-'}
                                            </div>
                                        </div>
                                        <div className="col-span-1">
                                            <Badge
                                                variant={getStatusVariant(event.status)}
                                                className={getStatusClasses(event.status)}
                                            >
                                                ● {event.status}
                                            </Badge>
                                        </div>
                                        {/* <div className="col-span-1 flex justify-end">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-[#7FA5A5] hover:text-[#6D9393] hover:bg-[#7FA5A5]/10"
                                                onClick={() => handleViewDetails(event)}
                                            >
                                                View Details
                                            </Button>
                                        </div> */}
                                    </div>
                                )
                            })}
                        </CardContent>
                    </Card>
                </div>

                {/* Event Detail Modal */}
                <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-white">
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
                                {/* <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">
                                            Ticket Sales Timeline
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={200}>
                                            <LineChart data={ticketSalesData.slice(0, 6)}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                                <YAxis tick={{ fontSize: 12 }} />
                                                <Tooltip />
                                                <Line
                                                    type="monotone"
                                                    dataKey="sales"
                                                    stroke="#7FA5A5"
                                                    strokeWidth={2}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card> */}

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
            </main >
        </div >
    )
}
