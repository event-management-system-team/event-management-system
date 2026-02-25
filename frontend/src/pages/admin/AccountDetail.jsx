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
import {Avatar, AvatarFallback, AvatarImage} from "../../components/domain/admin/Avatar.jsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../../components/domain/admin/Card.jsx";
import {Input} from "../../components/domain/admin/Input.jsx";
import {Badge} from "../../components/domain/admin/Badge.jsx";
import {useEffect, useState} from "react";
import {adminService} from "../../services/admin.service.js";
import {EditAccountModal} from "../../components/domain/admin/EditAccountModal.jsx";

export function AccountDetail() {
    const {id} = useParams();
    const [loading, setLoading] = useState(true);
    const [account, setAccount] = useState(null);
    const [error, setError] = useState(null);
    const [eventCount, setEventCount] = useState(0);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const fetchAccount = async () => {
        if (!id) return;

        try {
            setLoading(true);
            const response = await adminService.getAccountDetail(id);
            setAccount(response.data);
        } catch (error) {
            setError("Cannot load account detail");
            console.error(error)
        } finally {
            setLoading(false);
        }
    }

    const fetchEventCount = async () => {
        if (!id) return;

        try {
            setLoading(true);
            const response = await adminService.getEventCount(id);
            setEventCount(response.data);
        } catch (error) {
            setError("Cannot fetching event count");
            console.error(error)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (id) {
            fetchAccount();
        }

        if (account?.role === 'ORGANIZER') {
            fetchEventCount();
        }
    }, [id, account?.role]);

    const handleToggleBan = async () => {
        const action = account.status === "ACTIVE" ? 'BAN' : 'ACTIVATE';
        if (window.confirm(`Are you sure you want to ${action} this account?`)) {
            try {
                const res = await adminService.toggleBan(id);
                alert(`${action} successfully!`);
                await fetchAccount();
            } catch (error) {
                alert('Operation failed');
            }
        }
    }

    const getStatusVariant = (status) => {
        switch (status) {
            case "ACTIVE":
                return "default";
            case "BANNED":
                return "destructive";
            default:
                return "secondary";
        }
    }

    const getStatusClasses = (status) => {
        switch (status) {
            case "ACTIVE":
                return "bg-green-100 text-green-700 hover:bg-green-100";
            case "BANNED":
                return "bg-red-100 text-red-700 hover:bg-red-100";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    function formatDateTime(isoString) {
        if (!isoString) return "—";

        const sanitized = isoString.replace(
            /\.(\d{3})\d+/,
            ".$1"
        );

        const date = new Date(sanitized);

        if (isNaN(date.getTime())) return "Invalid date";

        const datePart = new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        }).format(date);

        const timePart = new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        }).format(date);

        return `${datePart} at ${timePart}`;
    }

    if (loading) return <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 animate-pulse z-10"/>
    if (error) return <div>Something went wrong: {error}</div>;
    if (!account) return <div>Cannot find account detail.</div>;

    return (
        <div className="flex h-screen bg-[#F1F0E8]">
            {/* Sidebar */}
            <AdminSidebar/>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Header */}
                <header className="bg-[#f7f7f7] border-b border-gray-200 px-8 py-5">
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
                <div className="bg-[#f7f7f7] border-b border-gray-200 px-8 py-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-6">
                            {/* Large Avatar */}
                            <Avatar className="w-20 h-20">
                                {account?.avatarUrl ? (
                                    <AvatarImage src={account?.avatarUrl} alt={account?.fullName}/>
                                ) : (
                                    <AvatarFallback className="bg-gray-300"/>
                                )}
                            </Avatar>

                            {/* Account Info */}
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-2xl font-semibold text-gray-900">
                                        {account?.fullName}
                                    </h1>
                                    <Badge
                                        variant={getStatusVariant(account?.status)}
                                        className={getStatusClasses(account?.status)}
                                    >
                                        ● {account?.status}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1.5">
                                        <Mail className="h-4 w-4"/>
                                        <span>{account?.email}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {account?.role !== "ADMIN" && (
                            <>
                                {account?.status === "ACTIVE" ? (
                                    <div className="flex gap-2">
                                        <Button
                                            className="gap-2 bg-[#7FA5A5] hover:bg-[#6D9393] text-white"
                                            onClick={() => setIsEditModalOpen(true)}
                                        >
                                            <Edit className="h-4 w-4"/>
                                            Edit Profile
                                        </Button>
                                        <Button variant="destructive" className="gap-2" onClick={handleToggleBan}>
                                            <Ban className="h-4 w-4"/>
                                            Ban Account
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <Button className="gap-2 bg-green-600 hover:bg-green-700 text-white" onClick={handleToggleBan}>
                                            <CheckCircle className="h-4 w-4"/>
                                            Activate Account
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="bg-[#f7f7f7] border-b border-gray-200 px-8">
                    <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="h-12 bg-transparent border-0 p-0 space-x-6">
                            <TabsTrigger
                                value="basic"
                                className="h-12 bg-transparent border-b-2 border-transparent data-[state=active]:border-[#7FA5A5] data-[state=active]:text-[#7FA5A5] rounded-none px-5 data-[state=active]:shadow-none"
                            >
                                Basic Info
                            </TabsTrigger>
                            {account?.role === "ORGANIZER" && (
                                <TabsTrigger
                                    value="events"
                                    className="h-12 bg-transparent border-b-2 border-transparent data-[state=active]:border-[#7FA5A5] data-[state=active]:text-[#7FA5A5] rounded-none px-5 data-[state=active]:shadow-none"
                                >
                                    Events
                                </TabsTrigger>
                            )}
                        </TabsList>

                        <TabsContent value="basic" className="mt-0">
                            <div className="p-8">
                                <div className="grid grid-cols-2 gap-6 mb-6">
                                    {/* Personal Information Card */}
                                    <Card className="bg-[#f7f7f7] shadow-sm border border-gray-200">
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
                                                    {account?.fullName}
                                                </div>
                                            </div>
                                            <div>
                                                <label
                                                    className="text-xs text-gray-500 uppercase tracking-wide mb-1 block">
                                                    Email Address
                                                </label>
                                                <a
                                                    href={`mailto:${account?.email}`}
                                                    className="text-sm text-[#7FA5A5] hover:underline flex items-center gap-1"
                                                >
                                                    {account?.email}
                                                    <ExternalLink className="h-3 w-3"/>
                                                </a>
                                            </div>
                                            <div>
                                                <label
                                                    className="text-xs text-gray-500 uppercase tracking-wide mb-1 block">
                                                    Phone Number
                                                </label>
                                                <div className="text-sm text-gray-900">
                                                    {account?.phone}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Account Details Card */}
                                    <Card className="bg-[#f7f7f7] shadow-sm border border-gray-200">
                                        <CardHeader className="border-b border-gray-100">
                                            <CardTitle className="text-lg">Account Details</CardTitle>
                                            <CardDescription>
                                                Administrative information and metrics
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="pt-6 space-y-4">
                                            {/*<div>*/}
                                            {/*    <label*/}
                                            {/*        className="text-xs text-gray-500 uppercase tracking-wide mb-1 block">*/}
                                            {/*        System ID*/}
                                            {/*    </label>*/}
                                            {/*    <div className="text-sm text-gray-900 font-mono">*/}
                                            {/*        {account.systemId}*/}
                                            {/*    </div>*/}
                                            {/*</div>*/}
                                            <div>
                                                <label
                                                    className="text-xs text-gray-500 uppercase tracking-wide mb-1 block">
                                                    Registration Date
                                                </label>
                                                <div className="text-sm text-gray-900">
                                                    {formatDateTime(account?.createdAt)}
                                                </div>
                                            </div>
                                            <div>
                                                <label
                                                    className="text-xs text-gray-500 uppercase tracking-wide mb-1 block">
                                                    Last Login
                                                </label>
                                                <div className="text-sm text-gray-900">
                                                    {formatDateTime(account?.lastLoginAt)}
                                                </div>
                                            </div>
                                            {(account?.role === "ORGANIZER" && (
                                                <div>
                                                    <label
                                                        className="text-xs text-gray-500 uppercase tracking-wide mb-1 block">
                                                        Events Created
                                                    </label>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-green-600 font-semibold">
                                                            {eventCount}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        {account?.role === "ORGANIZER" && (
                            <TabsContent value="events" className="mt-0">
                                <div className="p-8">
                                    <Card className="bg-[#f7f7f7] shadow-sm border border-gray-200">
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
                        )}
                    </Tabs>
                </div>
            </main>

            <EditAccountModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                accountData={{
                    id: account?.userId,
                    fullName: account?.fullName,
                    email: account?.email,
                    phone: account?.phone,
                    role: account?.role
                }}
                onSuccess={(updatedAccount) => {
                    setAccount(updatedAccount)
                }}
            />
        </div>
    )
}
