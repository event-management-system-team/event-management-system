import {
    Calendar,
    Users,
    TrendingUp,
    CheckCircle,
    Settings,
    BarChart3,
    Bell,
    Zap,
    CalendarCheck,
    ChevronRight,
    Search,
    LogOut,
    LayoutDashboard,
    UserCircle,
    CalendarCog,
    Eye,
    AlertCircle,
    TrendingDown,
    Clock,
    UserX,
    ArrowRight,
    Activity,
    FileText
} from 'lucide-react';
import {Link, useNavigate} from 'react-router';
import {Button} from "../../components/domain/admin/Button.jsx";
import {Input} from "../../components/domain/admin/Input.jsx";
import {Avatar, AvatarFallback} from "../../components/domain/admin/Avatar.jsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../../components/domain/admin/Card.jsx";
import {Badge} from "../../components/domain/admin/Badge.jsx";
import {AdminSidebar} from "../../components/domain/admin/AdminSidebar.jsx";

// Top summary metrics with trends
const summaryMetrics = [
    {
        title: "TOTAL EVENTS",
        value: "1,284",
        change: "+15.3%",
        trending: "up",
        icon: Calendar,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        link: "/event-management"
    },
    {
        title: "ACTIVE EVENTS",
        value: "342",
        change: "+22.1%",
        trending: "up",
        icon: Zap,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        link: "/event-management?status=active"
    },
    {
        title: "PENDING REVIEWS",
        value: "89",
        change: "-8.4%",
        trending: "down",
        icon: AlertCircle,
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
        link: "/event-management?status=pending",
        highlight: true
    },
    {
        title: "ORGANIZER ACCOUNTS",
        value: "456",
        change: "+18.5%",
        trending: "up",
        icon: Users,
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
        link: "/account-list"
    },
    {
        title: "SUSPENDED ACCOUNTS",
        value: "12",
        change: "+2",
        trending: "up",
        icon: UserX,
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
        link: "/account-list?status=suspended"
    }
]

// Pending events awaiting review
const pendingEvents = [
    {
        id: 3,
        name: "Workshop Series: Design Thinking",
        organizer: "Emma Williams",
        organization: "Workshop Co.",
        submittedDate: "Feb 10, 2026",
        status: "Pending"
    },
    {
        id: 7,
        name: "Indie Film Festival",
        organizer: "Amanda Garcia",
        organization: "Arts & Culture Foundation",
        submittedDate: "Feb 11, 2026",
        status: "Pending"
    },
    {
        id: 12,
        name: "Startup Pitch Competition",
        organizer: "Robert Kim",
        organization: "Venture Nexus",
        submittedDate: "Feb 12, 2026",
        status: "Pending"
    },
    {
        id: 15,
        name: "Green Energy Symposium",
        organizer: "Lisa Anderson",
        organization: "EcoFuture Institute",
        submittedDate: "Feb 12, 2026",
        status: "Pending"
    },
    {
        id: 18,
        name: "Jazz Night Under the Stars",
        organizer: "Marcus Brown",
        organization: "Blue Note Productions",
        submittedDate: "Feb 13, 2026",
        status: "Pending"
    }
]

// Pending organizer accounts
const pendingAccounts = [
    {
        id: 8,
        name: "Jennifer Martinez",
        company: "Eventify Solutions",
        submittedDate: "Feb 11, 2026",
        status: "Verification Pending"
    },
    {
        id: 9,
        name: "Daniel Thompson",
        company: "Summit Events Co.",
        submittedDate: "Feb 12, 2026",
        status: "Documents Review"
    },
    {
        id: 10,
        name: "Rachel Green",
        company: "GreenSpace Events",
        submittedDate: "Feb 12, 2026",
        status: "Verification Pending"
    },
    {
        id: 11,
        name: "Kevin Patel",
        company: "Metro Conference Group",
        submittedDate: "Feb 13, 2026",
        status: "Documents Review"
    }
]

// Recent system activity
const recentActivity = [
    {
        id: 1,
        action: "Event Approved",
        entity: "Global Tech Summit 2026",
        timestamp: "2 hours ago",
        type: "approved",
        icon: CheckCircle
    },
    {
        id: 2,
        action: "Account Suspended",
        entity: "Skyline Events Inc.",
        timestamp: "4 hours ago",
        type: "suspended",
        icon: UserX
    },
    {
        id: 3,
        action: "Event Rejected",
        entity: "Music Festival Downtown",
        timestamp: "6 hours ago",
        type: "rejected",
        icon: AlertCircle
    },
    {
        id: 4,
        action: "Account Verified",
        entity: "Creative Productions LLC",
        timestamp: "8 hours ago",
        type: "approved",
        icon: CheckCircle
    },
    {
        id: 5,
        action: "Event Approved",
        entity: "Charity Gala Evening",
        timestamp: "10 hours ago",
        type: "approved",
        icon: CheckCircle
    },
    {
        id: 6,
        action: "Event Under Review",
        entity: "Workshop Series: Design Thinking",
        timestamp: "12 hours ago",
        type: "pending",
        icon: Clock
    }
]

// System insights
const systemInsights = [
    {
        title: "Total Tickets Sold",
        value: "127,543",
        description: "Platform-wide",
        icon: Users,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600"
    },
    {
        title: "Avg. Approval Time",
        value: "18 hrs",
        description: "Event review time",
        icon: Clock,
        iconBg: "bg-green-100",
        iconColor: "text-green-600"
    },
    {
        title: "Monthly Growth",
        value: "+24.8%",
        description: "New organizers",
        icon: TrendingUp,
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600"
    }
]

export function AdminDashboard() {
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
                            </div>
                            <div className="flex items-center gap-3">
                                {/* Search Bar */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Search..."
                                        className="pl-9 pr-4 py-2 w-[280px] rounded-full border-gray-300 focus:ring-[#7FA5A5] focus:border-[#7FA5A5]"
                                    />
                                </div>
                                {/* Notification Icon */}
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full relative">
                                    <Bell className="h-5 w-5 text-gray-600" />
                                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                                </Button>
                                {/* Profile Icon */}
                                <Avatar className="w-9 h-9 cursor-pointer">
                                    <AvatarFallback className="bg-[#7FA5A5] text-white text-sm">AR</AvatarFallback>
                                </Avatar>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">System Overview</h1>
                                <p className="text-sm text-gray-500 mt-1">Monitor platform health and pending tasks</p>
                            </div>
                            <div className="text-sm text-gray-600">
                                <span className="font-medium">Last updated:</span> {new Date().toLocaleTimeString()}
                            </div>
                        </div>
                    </header>

                    {/* Main Dashboard Content */}
                    <div className="p-8">
                        {/* 1. Top Summary Metrics */}
                        <div className="grid grid-cols-5 gap-4 mb-8">
                            {summaryMetrics.map((metric, index) => (
                                <Link key={index} to={metric.link}>
                                    <Card
                                        className={`bg-white shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-200 ${
                                            metric.highlight ? 'ring-2 ring-orange-400  border border-gray-200' : ''
                                        }`}
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className={`p-3 rounded-lg ${metric.iconBg}`}>
                                                    <metric.icon className={`h-6 w-6 ${metric.iconColor}`} />
                                                </div>
                                                <div className={`flex items-center gap-1 text-xs font-semibold ${
                                                    metric.trending === 'up' ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                    {metric.trending === 'up' ? (
                                                        <TrendingUp className="h-3 w-3" />
                                                    ) : (
                                                        <TrendingDown className="h-3 w-3" />
                                                    )}
                                                    {metric.change}
                                                </div>
                                            </div>
                                            <div className="text-3xl font-bold text-gray-900 mb-1">
                                                {metric.value}
                                            </div>
                                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                                {metric.title}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>

                        {/* 2. Pending Actions - Requires Attention */}
                        <div className="mb-8">
                            {/* Pending Events */}
                            <Card className="bg-white shadow-sm border border-gray-200">
                                <CardHeader className="border-b border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-lg">Pending Events</CardTitle>
                                            <CardDescription>Events awaiting review and approval</CardDescription>
                                        </div>
                                        <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                                            {pendingEvents.length} pending
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="divide-y divide-gray-100">
                                        {pendingEvents.map((event) => (
                                            <Link
                                                key={event.id}
                                                to={`/event-detail/${event.id}`}
                                                className="block hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="p-4 flex items-center justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium text-gray-900 mb-1 truncate">
                                                            {event.name}
                                                        </div>
                                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <UserCircle className="h-3 w-3" />
                                {event.organizer}
                            </span>
                                                            <span>•</span>
                                                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                                                                {event.submittedDate}
                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 ml-4">
                                                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                                                            {event.status}
                                                        </Badge>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <Eye className="h-4 w-4 text-gray-500" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="p-4 border-t border-gray-100">
                                        <Link to="/event-management?status=pending">
                                            <Button variant="ghost" className="w-full text-[#7FA5A5] hover:text-[#6D9393] hover:bg-[#7FA5A5]/10">
                                                View All Pending Events
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                            {/* 3. Recent System Activity */}
                            <div className="col-span-2">
                                <Card className="bg-white shadow-sm border border-gray-200">
                                    <CardHeader className="border-b border-gray-100">
                                        <CardTitle className="text-lg">Recent System Activity</CardTitle>
                                        <CardDescription>Administrative actions and audit log</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            {recentActivity.map((activity) => (
                                                <div key={activity.id} className="flex items-start gap-4">
                                                    <div className={`p-2 rounded-lg ${
                                                        activity.type === 'approved' ? 'bg-green-100' :
                                                            activity.type === 'rejected' ? 'bg-red-100' :
                                                                activity.type === 'suspended' ? 'bg-red-100' :
                                                                    'bg-orange-100'
                                                    }`}>
                                                        <activity.icon className={`h-4 w-4 ${
                                                            activity.type === 'approved' ? 'text-green-600' :
                                                                activity.type === 'rejected' ? 'text-red-600' :
                                                                    activity.type === 'suspended' ? 'text-red-600' :
                                                                        'text-orange-600'
                                                        }`} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900 text-sm">
                              {activity.action}
                            </span>
                                                            <Badge
                                                                variant="secondary"
                                                                className={`text-xs ${
                                                                    activity.type === 'approved' ? 'bg-green-100 text-green-700' :
                                                                        activity.type === 'rejected' ? 'bg-red-100 text-red-700' :
                                                                            activity.type === 'suspended' ? 'bg-red-100 text-red-700' :
                                                                                'bg-orange-100 text-orange-700'
                                                                }`}
                                                            >
                                                                {activity.type}
                                                            </Badge>
                                                        </div>
                                                        <div className="text-sm text-gray-600 truncate mb-1">
                                                            {activity.entity}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {activity.timestamp}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* 4. Quick Actions + 5. System Insights */}
                            <div className="space-y-6">
                                {/* Quick Actions */}
                                <Card className="bg-white shadow-sm border border-gray-200">
                                    <CardHeader className="border-b border-gray-100">
                                        <CardTitle className="text-lg">Quick Actions</CardTitle>
                                        <CardDescription>Common admin shortcuts</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <div className="space-y-2">
                                            <Link to="/event-management?status=pending">
                                                <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-100">
                                                    <AlertCircle className="mr-3 h-4 w-4 text-orange-600" />
                                                    View All Pending Events
                                                </Button>
                                            </Link>
                                            <Link to="/account-list">
                                                <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-100">
                                                    <Users className="mr-3 h-4 w-4 text-purple-600" />
                                                    Manage Organizer Accounts
                                                </Button>
                                            </Link>
                                            <Link to="/event-analytics">
                                                <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-100">
                                                    <BarChart3 className="mr-3 h-4 w-4 text-blue-600" />
                                                    View Event Analytics
                                                </Button>
                                            </Link>
                                            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-100">
                                                <Settings className="mr-3 h-4 w-4 text-gray-600" />
                                                Go to System Settings
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* System Insights */}
                                <Card className="bg-white shadow-sm border border-gray-200">
                                    <CardHeader className="border-b border-gray-100">
                                        <CardTitle className="text-lg">System Insights</CardTitle>
                                        <CardDescription>Platform-wide metrics</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <div className="space-y-4">
                                            {systemInsights.map((insight, index) => (
                                                <div key={index} className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg ${insight.iconBg}`}>
                                                        <insight.icon className={`h-4 w-4 ${insight.iconColor}`} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-2xl font-bold text-gray-900">
                                                            {insight.value}
                                                        </div>
                                                        <div className="text-xs font-medium text-gray-900">
                                                            {insight.title}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {insight.description}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}