import {
    Calendar,
    Users,
    TrendingUp,
    CheckCircle,
    Plus,
    Settings,
    BarChart3,
    Bell,
    LogOut,
    LayoutDashboard,
    UserCircle,
    CalendarCog,
    ChevronRight,
    Search,
    MapPin,
    Shield,
    HardDrive,
    Key,
    Edit,
    Ban,
    Mail,
    Phone,
    Cake,
    Home as HomeIcon,
    FileText,
    TrendingDown,
    ExternalLink
} from 'lucide-react';
import {Progress} from '../../components/domain/admin/Progress.jsx'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '../../components/domain/admin/Tabs.jsx';
import {Link, useParams} from 'react-router';
import {AdminSidebar} from "../../components/domain/admin/AdminSidebar.jsx";
import {Button} from "../../components/domain/admin/Button.jsx";
import {Avatar, AvatarFallback} from "../../components/domain/admin/Avatar.jsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../../components/domain/admin/Card.jsx";
import {Input} from "../../components/domain/admin/Input.jsx";
import {Badge} from "../../components/domain/admin/Badge.jsx";

// Mock account data - in a real app, this would be fetched based on the ID
const accountData = {
    "1": {
        id: 1,
        name: "Sarah Johnson",
        email: "sarah.johnson@techevents.com",
        phone: "+1 (555) 123-4567",
        dateOfBirth: "March 15, 1988",
        address: "123 Tech Street, San Francisco, CA 94105",
        company: "TechEvents Inc.",
        avatar: "SJ",
        avatarBg: "bg-purple-600",
        eventsCreated: 24,
        joinedDate: "Jan 15, 2025",
        status: "Active",
        statusVariant: "default",
        verified: true,
        location: "San Francisco, CA",
        lastActive: "2 hours ago",
        systemId: "TE-2025-001",
        registrationDate: "January 15, 2025",
        lastLogin: "Feb 12, 2026 at 10:45 AM",
        lastLoginDevice: "Chrome on MacOS",
        accountTier: "Enterprise Plus",
        twoFactorEnabled: true,
        lastSecurityReview: "Feb 1, 2026",
        storageUsed: 85,
        storageTotal: 100,
        role: "Owner",
        roleDescription: "Full access to all features and settings"
    },
    "2": {
        id: 2,
        name: "Michael Chen",
        email: "michael.chen@musicfest.com",
        phone: "+1 (555) 234-5678",
        dateOfBirth: "July 22, 1985",
        address: "456 Music Avenue, Los Angeles, CA 90028",
        company: "MusicFest Productions",
        avatar: "MC",
        avatarBg: "bg-blue-600",
        eventsCreated: 18,
        joinedDate: "Dec 8, 2024",
        status: "Active",
        statusVariant: "default",
        verified: true,
        location: "Los Angeles, CA",
        lastActive: "1 day ago",
        systemId: "MF-2024-045",
        registrationDate: "December 8, 2024",
        lastLogin: "Feb 11, 2026 at 3:22 PM",
        lastLoginDevice: "Firefox on Windows",
        accountTier: "Professional",
        twoFactorEnabled: false,
        lastSecurityReview: "Jan 15, 2026",
        storageUsed: 62,
        storageTotal: 50,
        role: "Admin",
        roleDescription: "Can manage events and team members"
    }
}

export function AccountDetail() {
    const {id} = useParams()
    const account = accountData[id || "1"] || accountData["1"]

    return (
        <div className="flex h-screen bg-[#F5F5F7]">
            {/* Sidebar */}
            <AdminSidebar/>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-8 py-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Link to="/admin" className="hover:text-gray-900">
                                Dashboard
                            </Link>
                            <ChevronRight className="h-4 w-4"/>
                            <Link to="/admin/accounts" className="hover:text-gray-900">
                                Account Management
                            </Link>
                            <ChevronRight className="h-4 w-4"/>
                            <span>Account Detail</span>
                        </div>
                        <div className="flex items-center gap-3">
                            {/*/!* Search Bar *!/*/}
                            {/*<div className="relative">*/}
                            {/*    <Search*/}
                            {/*        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>*/}
                            {/*    <Input*/}
                            {/*        type="text"*/}
                            {/*        placeholder="Search events..."*/}
                            {/*        className="pl-9 pr-4 py-2 w-[280px] rounded-full border-gray-300 focus:ring-[#7FA5A5] focus:border-[#7FA5A5]"*/}
                            {/*    />*/}
                            {/*</div>*/}
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
                </header>

                {/* Profile Summary Header */}
                <div className="bg-white border-b border-gray-200 px-8 py-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-6">
                            {/* Large Avatar */}
                            <Avatar className={`w-20 h-20 ${account.avatarBg}`}>
                                <AvatarFallback className="text-white text-2xl">
                                    {account.avatar}
                                </AvatarFallback>
                            </Avatar>

                            {/* Account Info */}
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-2xl font-semibold text-gray-900">
                                        {account.name}
                                    </h1>
                                    <Badge
                                        variant={account.statusVariant}
                                        className={
                                            account.statusVariant === "default"
                                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                                : "bg-red-100 text-red-700 hover:bg-red-100"
                                        }
                                    >
                                        ● {account.status}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1.5">
                                        <Mail className="h-4 w-4"/>
                                        <span>{account.email}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <Button className="gap-2 bg-[#7FA5A5] hover:bg-[#6D9393] text-white">
                                <Edit className="h-4 w-4"/>
                                Edit Profile
                            </Button>
                            <Button variant="destructive" className="gap-2">
                                <Ban className="h-4 w-4"/>
                                Suspend Account
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="bg-white border-b border-gray-200 px-8">
                    <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="h-12 bg-transparent border-0 p-0 space-x-6">
                            <TabsTrigger
                                value="basic"
                                className="h-12 bg-transparent border-b-2 border-transparent data-[state=active]:border-[#7FA5A5] data-[state=active]:text-[#7FA5A5] rounded-none px-5 data-[state=active]:shadow-none"
                            >
                                Basic Info
                            </TabsTrigger>
                            <TabsTrigger
                                value="events"
                                className="h-12 bg-transparent border-b-2 border-transparent data-[state=active]:border-[#7FA5A5] data-[state=active]:text-[#7FA5A5] rounded-none px-5 data-[state=active]:shadow-none"
                            >
                                Events
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="basic" className="mt-0">
                            <div className="p-8">
                                <div className="grid grid-cols-2 gap-6 mb-6">
                                    {/* Personal Information Card */}
                                    <Card className="bg-white shadow-sm border border-gray-200">
                                        <CardHeader className="border-b border-gray-100">
                                            <CardTitle className="text-lg">
                                                Personal Information
                                            </CardTitle>
                                            <CardDescription>
                                                Basic account holder details
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="pt-6 space-y-4">
                                            <div>
                                                <label
                                                    className="text-xs text-gray-500 uppercase tracking-wide mb-1 block">
                                                    Full Name
                                                </label>
                                                <div className="text-sm text-gray-900 font-medium">
                                                    {account.name}
                                                </div>
                                            </div>
                                            <div>
                                                <label
                                                    className="text-xs text-gray-500 uppercase tracking-wide mb-1 block">
                                                    Email Address
                                                </label>
                                                <a
                                                    href={`mailto:${account.email}`}
                                                    className="text-sm text-[#7FA5A5] hover:underline flex items-center gap-1"
                                                >
                                                    {account.email}
                                                    <ExternalLink className="h-3 w-3"/>
                                                </a>
                                            </div>
                                            <div>
                                                <label
                                                    className="text-xs text-gray-500 uppercase tracking-wide mb-1 block">
                                                    Phone Number
                                                </label>
                                                <div className="text-sm text-gray-900">
                                                    {account.phone}
                                                </div>
                                            </div>
                                            <div>
                                                <label
                                                    className="text-xs text-gray-500 uppercase tracking-wide mb-1 block">
                                                    Date of Birth
                                                </label>
                                                <div className="text-sm text-gray-900">
                                                    {account.dateOfBirth}
                                                </div>
                                            </div>
                                            <div>
                                                <label
                                                    className="text-xs text-gray-500 uppercase tracking-wide mb-1 block">
                                                    Address
                                                </label>
                                                <div className="text-sm text-gray-900">
                                                    {account.address}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Account Details Card */}
                                    <Card className="bg-white shadow-sm border border-gray-200">
                                        <CardHeader className="border-b border-gray-100">
                                            <CardTitle className="text-lg">Account Details</CardTitle>
                                            <CardDescription>
                                                Administrative information and metrics
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="pt-6 space-y-4">
                                            <div>
                                                <label
                                                    className="text-xs text-gray-500 uppercase tracking-wide mb-1 block">
                                                    System ID
                                                </label>
                                                <div className="text-sm text-gray-900 font-mono">
                                                    {account.systemId}
                                                </div>
                                            </div>
                                            <div>
                                                <label
                                                    className="text-xs text-gray-500 uppercase tracking-wide mb-1 block">
                                                    Registration Date
                                                </label>
                                                <div className="text-sm text-gray-900">
                                                    {account.registrationDate}
                                                </div>
                                            </div>
                                            <div>
                                                <label
                                                    className="text-xs text-gray-500 uppercase tracking-wide mb-1 block">
                                                    Last Login
                                                </label>
                                                <div className="text-sm text-gray-900">
                                                    {account.lastLogin}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-0.5">
                                                    {account.lastLoginDevice}
                                                </div>
                                            </div>
                                            <div>
                                                <label
                                                    className="text-xs text-gray-500 uppercase tracking-wide mb-1 block">
                                                    Events Created
                                                </label>
                                                <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-900 font-semibold">
                            {account.eventsCreated}
                          </span>
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs bg-green-50 text-green-700 border-green-200"
                                                    >
                                                        <TrendingUp className="h-3 w-3 mr-1"/>
                                                        +12%
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="events" className="mt-0">
                            <div className="p-8">
                                <Card className="bg-white shadow-sm border border-gray-200">
                                    <CardHeader className="border-b border-gray-100">
                                        <CardTitle className="text-lg">Events Overview</CardTitle>
                                        <CardDescription>
                                            List of events created by this account
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <p className="text-sm text-gray-600">
                                            Events list would be displayed here...
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    )
}
