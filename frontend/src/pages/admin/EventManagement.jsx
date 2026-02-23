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
    ThumbsUp,
    ThumbsDown,
    Music,
    Briefcase,
    Utensils,
    GraduationCap,
    X
} from 'lucide-react';
import {Link} from 'react-router';
import {Avatar, AvatarFallback} from "../../components/domain/admin/Avatar.jsx";
import {Button} from "../../components/domain/admin/Button.jsx";
import {Input} from "../../components/domain/admin/Input.jsx";
import {Card, CardContent, CardHeader, CardTitle} from "../../components/domain/admin/Card.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../../components/domain/admin/Select.jsx";
import {AdminSidebar} from "../../components/domain/admin/AdminSidebar.jsx";
import {Badge} from "../../components/domain/admin/Badge.jsx";

// Mock data for event statistics
const summaryMetrics = [{
    title: "TOTAL EVENTS",
    value: "1,284",
    change: "+15.3%",
    trending: "up",
    icon: Calendar,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600"
}, {
    title: "ACTIVE",
    value: "342",
    change: "+22.1%",
    trending: "up",
    icon: Zap,
    iconBg: "bg-green-100",
    iconColor: "text-green-600"
}, {
    title: "PENDING",
    value: "89",
    change: "-8.4%",
    trending: "down",
    icon: CalendarCheck,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600"
}, {
    title: "COMPLETED",
    value: "853",
    change: "+12.7%",
    trending: "up",
    icon: CheckCircle,
    iconBg: "bg-gray-100",
    iconColor: "text-gray-600"
}]

// Mock event data
const events = [{
    id: 1,
    name: "Tech Conference 2026",
    category: "Technology",
    categoryIcon: Briefcase,
    thumbnail: "TC",
    thumbnailBg: "bg-slate-800",
    organizer: "Sarah Johnson",
    organization: "TechEvents Inc.",
    date: "Mar 15, 2026",
    time: "09:00 AM",
    ticketsSold: 847,
    ticketsTotal: 1000,
    ticketsProgress: 85,
    status: "Approved",
    statusVariant: "default"
}, {
    id: 2,
    name: "Summer Music Festival",
    category: "Music",
    categoryIcon: Music,
    thumbnail: "SM",
    thumbnailBg: "bg-blue-600",
    organizer: "Michael Chen",
    organization: "MusicFest Productions",
    date: "Jun 20, 2026",
    time: "02:00 PM",
    ticketsSold: 2340,
    ticketsTotal: 5000,
    ticketsProgress: 47,
    status: "Approved",
    statusVariant: "default"
}, {
    id: 3,
    name: "Workshop Series: Design Thinking",
    category: "Education",
    categoryIcon: GraduationCap,
    thumbnail: "WS",
    thumbnailBg: "bg-amber-700",
    organizer: "Emma Williams",
    organization: "Workshop Co.",
    date: "Feb 28, 2026",
    time: "10:00 AM",
    ticketsSold: 156,
    ticketsTotal: 200,
    ticketsProgress: 78,
    status: "Pending",
    statusVariant: "secondary"
}, {
    id: 4,
    name: "Charity Gala Evening",
    category: "Charity",
    categoryIcon: Users,
    thumbnail: "CG",
    thumbnailBg: "bg-slate-600",
    organizer: "David Martinez",
    organization: "Charity Now",
    date: "Apr 5, 2026",
    time: "06:00 PM",
    ticketsSold: 420,
    ticketsTotal: 500,
    ticketsProgress: 84,
    status: "Approved",
    statusVariant: "default"
}, {
    id: 5,
    name: "Digital Marketing Summit",
    category: "Business",
    categoryIcon: Briefcase,
    thumbnail: "DM",
    thumbnailBg: "bg-green-700",
    organizer: "Jennifer Lee",
    organization: "Digital Market Summit",
    date: "Jan 22, 2026",
    time: "08:30 AM",
    ticketsSold: 650,
    ticketsTotal: 650,
    ticketsProgress: 100,
    status: "Approved",
    statusVariant: "default"
}, {
    id: 6,
    name: "Sports Tournament Championship",
    category: "Sports",
    categoryIcon: Users,
    thumbnail: "ST",
    thumbnailBg: "bg-indigo-600",
    organizer: "Robert Taylor",
    organization: "Sports Event Group",
    date: "Mar 30, 2026",
    time: "01:00 PM",
    ticketsSold: 1850,
    ticketsTotal: 3000,
    ticketsProgress: 62,
    status: "Approved",
    statusVariant: "default"
}, {
    id: 7,
    name: "Indie Film Festival",
    category: "Arts & Culture",
    categoryIcon: Users,
    thumbnail: "IF",
    thumbnailBg: "bg-rose-600",
    organizer: "Amanda Garcia",
    organization: "Arts & Culture Foundation",
    date: "May 18, 2026",
    time: "07:00 PM",
    ticketsSold: 0,
    ticketsTotal: 400,
    ticketsProgress: 0,
    status: "Pending",
    statusVariant: "secondary"
}, {
    id: 8,
    name: "Virtual Reality Gaming Expo",
    category: "Technology",
    categoryIcon: Briefcase,
    thumbnail: "VR",
    thumbnailBg: "bg-teal-600",
    organizer: "James Anderson",
    organization: "Business Conference Ltd",
    date: "Apr 22, 2026",
    time: "11:00 AM",
    ticketsSold: 0,
    ticketsTotal: 800,
    ticketsProgress: 0,
    status: "Rejected",
    statusVariant: "destructive"
}, {
    id: 9,
    name: "Food & Wine Festival",
    category: "Food & Beverage",
    categoryIcon: Utensils,
    thumbnail: "FW",
    thumbnailBg: "bg-orange-600",
    organizer: "Lisa Brown",
    organization: "Food Festival Co.",
    date: "Aug 12, 2026",
    time: "12:00 PM",
    ticketsSold: 980,
    ticketsTotal: 1500,
    ticketsProgress: 65,
    status: "Approved",
    statusVariant: "default"
}, {
    id: 10,
    name: "Education Summit 2026",
    category: "Education",
    categoryIcon: GraduationCap,
    thumbnail: "ES",
    thumbnailBg: "bg-cyan-600",
    organizer: "Thomas Wilson",
    organization: "Education Events",
    date: "Jul 8, 2026",
    time: "09:30 AM",
    ticketsSold: 540,
    ticketsTotal: 600,
    ticketsProgress: 90,
    status: "Approved",
    statusVariant: "default"
}]

export function EventManagement() {
    return (
        <>
            <div className="flex h-screen bg-[#F1F0E8]">
                {/* Sidebar */}
                <AdminSidebar/>

                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    {/* Header */}
                    <header className="bg-[#f7f7f7] border-b border-gray-200 px-8 py-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>Dashboard</span>
                                <ChevronRight className="h-4 w-4"/>
                                <span>Event Management</span>
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
                                <h1 className="text-foreground text-2xl mb-1 font-semibold">
                                    Event Management
                                </h1>
                                <p className="text-gray-500 text-sm">
                                    Manage and oversee all platform-wide events and requests.
                                </p>
                            </div>
                        </div>
                    </header>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-4 gap-5 p-8">
                        {summaryMetrics.map((metric, index) => {
                            const Icon = metric.icon
                            const TrendIcon = metric.trending === "up" ? TrendingUp : TrendingDown
                            return (<Card key={index} className="bg-[#f7f7f7] shadow-sm border border-gray-200">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <div
                                            className={`w-10 h-10 ${metric.iconBg} rounded-lg flex items-center justify-center`}
                                        >
                                            <Icon className={`h-5 w-5 ${metric.iconColor}`}/>
                                        </div>
                                        <div
                                            className={`flex items-center gap-1 text-xs ${metric.trending === "up" ? "text-green-600" : "text-red-600"}`}
                                        >
                                            <TrendIcon className="h-3 w-3"/>
                                            <span>{metric.change}</span>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500 mb-1 tracking-wide">
                                        {metric.title}
                                    </div>
                                    <div className="text-3xl font-semibold text-gray-900">
                                        {metric.value}
                                    </div>
                                </CardContent>
                            </Card>)
                        })}
                    </div>

                    {/* Filter Events Section */}
                    <div className="px-8 pb-6">
                        <Card className="bg-[#f7f7f7] shadow-sm border border-gray-200">
                            <CardHeader className="border-b border-gray-100">
                                <CardTitle className="text-lg">Filter Events</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-5 gap-4 items-end">
                                    {/* Search Input */}
                                    <div className="col-span-1">
                                        <label className="text-xs text-gray-600 mb-2 block">
                                            Search
                                        </label>
                                        <div className="relative">
                                            <Search
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                                            <Input
                                                type="text"
                                                placeholder="Event name or ID..."
                                                className="pl-9 pr-4 py-2 w-full border-gray-300"
                                            />
                                        </div>
                                    </div>

                                    {/* Status Dropdown */}
                                    <div className="col-span-1">
                                        <label className="text-xs text-gray-600 mb-2 block">
                                            Status
                                        </label>
                                        <Select defaultValue="all">
                                            <SelectTrigger className='border border-gray-200'>
                                                <SelectValue placeholder="Status"/>
                                            </SelectTrigger>
                                            <SelectContent className='border border-gray-200'>
                                                <SelectItem value="all">All Statuses</SelectItem>
                                                <SelectItem value="approved">Approved</SelectItem>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="rejected">Rejected</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Category Dropdown */}
                                    <div className="col-span-1">
                                        <label className="text-xs text-gray-600 mb-2 block">
                                            Category
                                        </label>
                                        <Select defaultValue="all">
                                            <SelectTrigger className='border border-gray-200'>
                                                <SelectValue placeholder="Category"/>
                                            </SelectTrigger>
                                            <SelectContent className='border border-gray-200'>
                                                <SelectItem value="all">All Categories</SelectItem>
                                                <SelectItem value="technology">Technology</SelectItem>
                                                <SelectItem value="music">Music</SelectItem>
                                                <SelectItem value="education">Education</SelectItem>
                                                <SelectItem value="business">Business</SelectItem>
                                                <SelectItem value="food">Food & Beverage</SelectItem>
                                                <SelectItem value="arts">Arts & Culture</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Date Picker */}
                                    <div className="col-span-1">
                                        <label className="text-xs text-gray-600 mb-2 block">
                                            Date
                                        </label>
                                        <Input
                                            type="text"
                                            placeholder="mm/dd/yyyy"
                                            className="border-gray-300"
                                        />
                                    </div>

                                    {/* Apply Filters Button */}
                                    <div className="col-span-1">
                                        <Button className="w-full bg-[#7FA5A5] hover:bg-[#6D9393] text-white">
                                            Apply Filters
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Event List Table */}
                    <div className="px-8 pb-8">
                        <Card className="bg-[#f7f7f7] shadow-sm border border-gray-200">
                            <CardContent className="p-0">
                                {/* Table Header */}
                                <div
                                    className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide items-center">
                                    <div className="col-span-3">Event Details</div>
                                    <div className="col-span-2">Organizer</div>
                                    <div className="col-span-2">Date & Time</div>
                                    <div className="col-span-2">Tickets Sold</div>
                                    <div className="col-span-2">Status</div>
                                    <div className="col-span-1 text-right">Actions</div>
                                </div>

                                {/* Event Rows */}
                                {events.map(event => {
                                    const CategoryIcon = event.categoryIcon
                                    return (<div
                                        key={event.id}
                                        className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 last:border-0 items-center hover:bg-[#eef3f5]"
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
                                                    <span className="text-xs text-gray-500">{event.category}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-sm text-gray-900">
                                                {event.organizer}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {event.organization}
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-sm text-gray-900">{event.date}</div>
                                            <div className="text-xs text-gray-500">{event.time}</div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-500 rounded-full"
                                                        style={{width: `${event.ticketsProgress}%`}}
                                                    />
                                                </div>
                                                <span className="text-xs text-gray-600 min-w-[35px]">{event.ticketsProgress}%</span>
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                {event.ticketsSold}/{event.ticketsTotal}
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <Badge
                                                variant={event.statusVariant}
                                                className={event.statusVariant === "default" ? "bg-green-100 text-green-700 hover:bg-green-100" : event.statusVariant === "secondary" ? "bg-orange-100 text-orange-700 hover:bg-orange-100" : event.statusVariant === "destructive" ? "bg-red-100 text-red-700 hover:bg-red-100" : ""}
                                            >
                                                ● {event.status}
                                            </Badge>
                                        </div>
                                        <div className="col-span-1 flex justify-end gap-1">
                                            <Link to={`event-detail/${event.id}`}>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    title="View event details"
                                                >
                                                    <Eye className="h-4 w-4 text-gray-500"/>
                                                </Button>
                                            </Link>
                                            {event.status === "Pending" && (<>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    title="Approve event"
                                                >
                                                    <CheckCircle className="h-4 w-4 text-green-600"/>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    title="Reject event"
                                                >
                                                    <X className="h-4 w-4 text-red-600"/>
                                                </Button>
                                            </>)}
                                        </div>
                                    </div>)
                                })}

                                {/* Footer with Pagination */}
                                <div className="px-6 py-4 flex items-center justify-between text-sm text-gray-600">
                                    <div>Showing 1–10 of 1,284 events</div>
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
                                            3
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            ...
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            128
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </>
    )
}