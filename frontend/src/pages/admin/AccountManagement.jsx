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
    MoreVertical,
    TrendingDown,
    UserX,
    Clock,
    ChevronDown,
    Eye
} from 'lucide-react';
import {Link, useNavigate} from 'react-router';
import {AdminSidebar} from "../../components/domain/admin/AdminSidebar.jsx";
import {CreateOrganizerModal} from "../../components/domain/admin/CreateOrganizerModal.jsx";
import {useEffect, useMemo, useState} from "react";
import {Button} from "../../components/domain/admin/Button.jsx";
import {Avatar, AvatarFallback, AvatarImage} from "../../components/domain/admin/Avatar.jsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../../components/domain/admin/Card.jsx";
import {Checkbox} from "../../components/domain/admin/Checkbox.jsx";
import {Input} from "../../components/domain/admin/Input.jsx";
import {Badge} from "../../components/domain/admin/Badge.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../../components/domain/admin/Select.jsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "../../components/domain/admin/Dropdown-Menu.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {adminService} from "../../services/admin.service.js";

export function AccountManagement() {

    const [accounts, setAccounts] = useState([]);
    const [originalAccounts, setOriginalAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState("all");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [sortOption, setSortOption] = useState("newest");
    const [searchTerm, setSearchTerm] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // useEffect(() => {
    //     const fetchAccounts = async () => {
    //         try {
    //             setLoading(true);
    //             const response = await adminService.getAllAccounts(0, 10);
    //             setAccounts(response.data.content);
    //         } catch (error) {
    //             setError("Cannot load account list");
    //             console.error(error)
    //         } finally {
    //             setLoading(false);
    //         }
    //     }
    //
    //     fetchAccounts();
    // }, [])

    const fetchAccounts = async () => {
        try {
            setLoading(true);
            const response = await adminService.getAllAccounts();
            setAccounts(response.data);
            setOriginalAccounts(response.data);
        } catch (error) {
            setError("Cannot load account list");
            console.error(error)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAccounts();
    }, [])

    const handleSearch = async (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.trim() === "") {
            setAccounts(originalAccounts)
            return;
        }

        try {
            const response = await adminService.searchAccounts(value);
            setAccounts(response.data);
        }  catch (error) {
            setError("Cannot load account list");
            console.error(error)
        } finally {
            setLoading(false);
        }
    }

    const processedAccounts = useMemo(() => {
        return [...accounts]
            // filter by status
            .filter(account => status === "all" || account.status === status)

            // filter by date range
            .filter(account => {
                if (!startDate || !endDate) return true;

                const createdDate = new Date(account.createdAt)

                const endOfDay = new Date(endDate);
                endOfDay.setHours(23, 59, 59, 999);

                return (createdDate >= startDate && createdDate <= endOfDay);
            })

            // sort by option
            .sort((a, b) => {
                if (sortOption === "newest") {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                }
                if (sortOption === "oldest") {
                    return new Date(a.createdAt) - new Date(b.createdAt)
                }
                if (sortOption === "name") {
                    return a.fullName.localeCompare(b.fullName)
                }
                return 0;
            });
    }, [accounts, status, startDate, endDate, sortOption]);

    const formatDate = (isoString) => {
        const date = new Date(isoString);

        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        });
    };

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

    const formatRole = (role) => {
        return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
    };

    const summaryMetrics = (accounts) => {
        const total = accounts.length;
        const active = accounts.filter(acc => acc.status === "ACTIVE").length;
        const banned = accounts.filter(acc => acc.status === "BANNED").length;

        return [
            {
                title: "TOTAL ACCOUNTS",
                value: total,
                change: "+12.5%",
                trending: "up",
                icon: Users,
                iconBg: "bg-blue-100",
                iconColor: "text-blue-600"
            },
            {
                title: "ACTIVE",
                value: active,
                change: "+10.8%",
                trending: "up",
                icon: CheckCircle,
                iconBg: "bg-green-100",
                iconColor: "text-green-600"
            },
            {
                title: "BANNED",
                value: banned,
                change: "+5.4%",
                trending: "up",
                icon: UserX,
                iconBg: "bg-red-100",
                iconColor: "text-red-600"
            }
        ]
    }

    const metrics = summaryMetrics(accounts);

    if (loading) return <div>Loading...</div>
    if (error) return <div>Something went wrong: {error}</div>;

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
                                <span>Account Management</span>
                            </div>
                            <div className="flex items-center gap-3">
                                {/* Notification Icon */}
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
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
                                <h1 className="text-foreground text-2xl mb-1 font-semibold">Account Management</h1>
                                <p className="text-gray-500 text-sm">
                                    Oversee and manage system organizer accounts.
                                </p>
                            </div>
                            <Button
                                className="gap-2 bg-[#7FA5A5] hover:bg-[#6D9393] text-white rounded-full px-5"
                                onClick={openModal}
                            >
                                <Plus className="h-4 w-4"/>
                                Create Organizer Account
                            </Button>
                        </div>
                    </header>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-3 gap-5 p-8">
                        {metrics.map((metric, index) => {
                            const Icon = metric.icon
                            const TrendIcon = metric.trending === "up" ? TrendingUp : TrendingDown
                            return (
                                <Card key={index} className="bg-white shadow-sm border border-gray-200">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <div
                                                className={`w-10 h-10 ${metric.iconBg} rounded-lg flex items-center justify-center`}
                                            >
                                                <Icon className={`h-5 w-5 ${metric.iconColor}`}/>
                                            </div>
                                            <div
                                                className={`flex items-center gap-1 text-xs ${
                                                    metric.trending === "up" ? "text-green-600" : "text-red-600"
                                                }`}
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
                                </Card>
                            )
                        })}
                    </div>

                    {/* Search, Filter & Sort Controls */}
                    <div className="px-8 pb-4">
                        <div className="flex items-center gap-3">

                            {/* Search Input */}
                            <div className="relative flex-1">
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                                <Input
                                    type="text"
                                    placeholder="Search organizer, full name, email or phone number..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="pl-9 pr-4 py-2 w-full border-gray-300 focus:ring-[#7FA5A5] focus:border-[#7FA5A5]"
                                />
                            </div>

                            {/* Status Filter */}
                            <Select
                                value={status}
                                onValueChange={(value) => setStatus(value)}
                            >
                                <SelectTrigger className="w-[160px] border border-gray-200">
                                    <SelectValue placeholder="Status"/>
                                </SelectTrigger>
                                <SelectContent className='border border-gray-200'>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                    <SelectItem value="BANNED">Banned</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Date Range Picker */}
                            <DatePicker
                                selectsRange
                                startDate={startDate}
                                endDate={endDate}
                                onChange={(update) => {
                                    const [start, end] = update;
                                    setStartDate(start);
                                    setEndDate(end);
                                }}
                                isClearable
                                customInput={
                                    <Button
                                        variant="outline"
                                        className="gap-2 min-w-[210px] justify-start"
                                    >
                                        <Calendar className="h-4 w-4 text-gray-500"/>
                                        <span>
                                            {startDate && endDate
                                                ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
                                                : "Date Range"}
                                        </span>
                                    </Button>
                                }
                            />

                            {/* Sort Dropdown */}
                            <Select
                                value={sortOption}
                                onValueChange={(value) => setSortOption(value)}
                            >
                                <SelectTrigger className="w-[140px] border border-gray-200">
                                    <SelectValue placeholder="Sort by"/>
                                </SelectTrigger>
                                <SelectContent className='border border-gray-200'>
                                    <SelectItem value="newest">Newest</SelectItem>
                                    <SelectItem value="oldest">Oldest</SelectItem>
                                    <SelectItem value="name">Name A-Z</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Account List Table */}
                    <div className="px-8 pb-8">
                        <Card className="bg-white shadow-sm border border-gray-200">
                            <CardContent className="p-0">
                                {/* Table Header */}
                                <div
                                    className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide items-center">
                                    <div className="col-span-1 flex items-center">
                                        <Checkbox/>
                                    </div>
                                    <div className="col-span-3">Account</div>
                                    <div className="col-span-2">Phone Number</div>
                                    <div className="col-span-1">Role</div>
                                    <div className="col-span-2">Joined Date</div>
                                    <div className="col-span-2">Status</div>
                                    <div className="col-span-1 text-right">Actions</div>
                                </div>

                                {/* Account Rows */}
                                {processedAccounts.map(account => (
                                    <div
                                        key={account.id}
                                        className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 last:border-0 items-center hover:bg-gray-50"
                                    >
                                        <div className="col-span-1 flex items-center">
                                            <Checkbox/>
                                        </div>
                                        <div className="col-span-3 flex items-center gap-3">
                                            <Avatar className="w-10 h-10">
                                                {account.avatar ? (
                                                    <AvatarImage src={account.avatar} alt={account.username}/>
                                                ) : (
                                                    <AvatarFallback className="bg-gray-300 text-gray-600 text-xs">
                                                        {account.username}
                                                    </AvatarFallback>
                                                )}
                                            </Avatar>

                                            <div>
                                                <div className="font-medium text-sm text-gray-900">
                                                    {account.fullName}
                                                </div>
                                                <div className="text-xs text-gray-500">{account.email}</div>
                                            </div>
                                        </div>
                                        <div className="col-span-2 text-sm text-gray-600">
                                            {account.phone}
                                        </div>
                                        <div className="col-span-1 text-sm text-gray-900 font-medium">
                                            {formatRole(account.role)}
                                        </div>
                                        <div className="col-span-2 text-sm text-gray-600">
                                            {formatDate(account.createdAt)}
                                        </div>
                                        <div className="col-span-2">
                                            <Badge
                                                variant={getStatusVariant(account.status)}
                                                className={getStatusClasses(account.status)}
                                            >
                                                ● {account.status}
                                            </Badge>
                                        </div>
                                        <div className="col-span-1 flex justify-end gap-1">
                                            <Link to={`account-detail/${account.id}`}>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    title="View account details"
                                                >
                                                    <Eye className="h-4 w-4 text-gray-500"/>
                                                </Button>
                                            </Link>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreVertical className="h-4 w-4 text-gray-500"/>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>
                                                        <UserCircle className="mr-2 h-4 w-4"/>
                                                        View account details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        {account.status === "BANNED" ? (
                                                            <>
                                                                <CheckCircle className="mr-2 h-4 w-4"/>
                                                                Activate account
                                                            </>
                                                        ) : (
                                                            <>
                                                                <UserX className="mr-2 h-4 w-4"/>
                                                                Ban account
                                                            </>
                                                        )}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Settings className="mr-2 h-4 w-4"/>
                                                        Reset password
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                ))}

                                {/* Footer with Pagination */}
                                <div className="px-6 py-4 flex items-center justify-between text-sm text-gray-600">
                                    <div>Showing 1–10 of {accounts.length} results</div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">
                                            Previous
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            1
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="bg-[#7FA5A5] text-white border-[#7FA5A5] hover:bg-[#6D9393]"
                                        >
                                            2
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            3
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            ...
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            125
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

                {/* Create Organizer Modal */}
                <CreateOrganizerModal isOpen={isModalOpen} onClose={closeModal}/>
            </div>
        </>
    );
}