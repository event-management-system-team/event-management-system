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
import {AccountsPagination} from "../../components/domain/admin/AccountsPagination.jsx";

export function AccountManagement() {

    const [accounts, setAccounts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [originalAccounts, setOriginalAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState("all");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [sortOption, setSortOption] = useState("newest");
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleOrganizerCreated = (newAccount) => {
        setAccounts(prevAccounts => [newAccount, ...prevAccounts]);
        setOriginalAccounts(prevOriginal => [newAccount, ...prevOriginal]);
    }

    const loadAllAccounts = async () => {
        const res = await adminService.getAllAccountsPlain();
        setOriginalAccounts(res.data); // full list
    };

    const loadData = async () => {
        try {
            setLoading(true);
            const response = await adminService.getAllAccounts(currentPage, 10);

            setAccounts(response.data.content);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.number)
        } catch (error) {
            setError("Cannot load account list");
            console.error(error)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
        loadAllAccounts();
    }, [currentPage]);

    // api search
    // const handleSearchChange = async (e) => {
    //     const value = e.target.value;
    //     setSearchTerm(value);
    //
    //     if (value.trim() === "") {
    //         setAccounts(originalAccounts)
    //         return;
    //     }
    //
    //     try {
    //         const response = await adminService.searchAccounts(value);
    //         setAccounts(response.data);
    //     } catch (error) {
    //         setError("Cannot load account list");
    //         console.error(error)
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    // local search
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (!value.trim()) {
            setAccounts(originalAccounts);
            return;
        }

        const lower = value.toLowerCase();

        const filtered = originalAccounts.filter(acc =>
            acc.fullName?.toLowerCase().includes(lower) ||
            acc.email?.toLowerCase().includes(lower) ||
            acc.phone?.includes(value)
        );

        setAccounts(filtered);
    };

    const pageSize = 10;
    const isSearching = searchTerm.trim().length > 0;

    const startItem = currentPage * pageSize + 1;
    const endItem = Math.min(
        (currentPage + 1) * pageSize,
        isSearching ? accounts.length : totalPages
    )

    const handlePrev = () => {
        if (isSearching || currentPage === 0) return;
        setCurrentPage(prev => prev - 1);
    };

    const handleNext = () => {
        if (isSearching || currentPage >= totalPages - 1) return;
        setCurrentPage(prev => prev + 1);
    };

    const handlePageChange = (p) => {
        if (isSearching) return;
        setCurrentPage(p - 1); // 🔥 convert 1-based → 0-based
    };

    // const totalPages = Math.ceil(paginatedAccounts.length / pageSize);

    const handleToggleBan = async (account) => {
        if (!account) return;

        const isBanned = account.status === "BANNED";
        const action = isBanned ? "ACTIVATE" : "BAN";

        if (window.confirm(`Are you sure you want to ${action} this account?`)) {
            try {
                const res = await adminService.toggleBan(account.userId);
                alert(`${action} successfully!`);
                // await fetchAccounts();
                await loadData();
            } catch (error) {
                alert('Operation failed');
            }
        }
    }

    // const processedAccounts = useMemo(() => {
    //     return [...accounts]
    //         // filter by status
    //         .filter(account => status === "all" || account.status === status)
    //
    //         // filter by date range
    //         .filter(account => {
    //             if (!startDate || !endDate) return true;
    //
    //             const createdDate = new Date(account.createdAt)
    //
    //             const endOfDay = new Date(endDate);
    //             endOfDay.setHours(23, 59, 59, 999);
    //
    //             return (createdDate >= startDate && createdDate <= endOfDay);
    //         })
    //
    //         // sort by option
    //         .sort((a, b) => {
    //             switch (sortOption) {
    //                 case "newest":
    //                     return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    //
    //                 case "oldest":
    //                     return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    //
    //                 case "name":
    //                     return (a.fullName ?? "").localeCompare(b.fullName ?? "");
    //
    //                 default:
    //                     return 0;
    //             }
    //         });
    // }, [accounts, status, startDate, endDate, sortOption]);

    const processedAccounts = useMemo(() => {
        let list = [...originalAccounts];

        if (searchTerm.trim()) {
            const lower = searchTerm.toLowerCase();
            list = list.filter(acc =>
                acc.fullName?.toLowerCase().includes(lower) ||
                acc.email?.toLowerCase().includes(lower) ||
                acc.phone?.includes(searchTerm)
            );
        }

        // filter by status
        if (!status) return originalAccounts;
        list = list.filter(account => status === "all" || account.status === status);

        // 4. Filter theo Date range
        list = list.filter(account => {
            if (!startDate || !endDate) return true;
            const createdDate = new Date(account.createdAt);
            const endOfDay = new Date(endDate);
            endOfDay.setHours(23, 59, 59, 999);
            return (createdDate >= startDate && createdDate <= endOfDay);
        });

        // 5. Sort
        list.sort((a, b) => {
            switch (sortOption) {
                case "newest":
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case "oldest":
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case "name":
                    return (a.fullName ?? "").localeCompare(b.fullName ?? "");
                default:
                    return 0;
            }
        });

        return list;
    }, [originalAccounts, searchTerm, status, startDate, endDate, sortOption]);

    const totalItems = processedAccounts.length;
    // const totalPages = Math.ceil(totalItems / pageSize);

    const paginatedAccounts = processedAccounts.slice(
        currentPage * pageSize,
        (currentPage + 1) * pageSize
    );

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
        const total = originalAccounts.length;
        const active = originalAccounts.filter(acc => acc.status === "ACTIVE").length;
        const banned = originalAccounts.filter(acc => acc.status === "BANNED").length;

        return [
            {
                title: "TOTAL ACCOUNTS",
                value: total,
                icon: Users,
                iconBg: "bg-blue-100",
                iconColor: "text-blue-600"
            },
            {
                title: "ACTIVE",
                value: active,
                icon: CheckCircle,
                iconBg: "bg-green-100",
                iconColor: "text-green-600"
            },
            {
                title: "BANNED",
                value: banned,
                icon: UserX,
                iconBg: "bg-red-100",
                iconColor: "text-red-600"
            }
        ]
    }

    const metrics = summaryMetrics(accounts);

    if (loading) return <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 animate-pulse z-10"/>
    if (error) return <div>Something went wrong: {error}</div>;

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
                                className="gap-2 bg-primary hover:bg-[#B3C8CF] text-white rounded-full px-5"
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
                            return (
                                <Card key={index} className="bg-[#f7f7f7] shadow-sm border border-gray-200">
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
                                    onChange={handleSearchChange}
                                    className="pl-9 pr-4 py-2 w-full border-gray-300 focus:ring-[#7FA5A5] focus:border-[#7FA5A5] bg-[#f7f7f7]"
                                />
                            </div>

                            {/* Status Filter */}
                            <Select
                                value={status}
                                onValueChange={(value) => setStatus(value)}
                            >
                                <SelectTrigger
                                    className="w-[160px] border border-gray-200 cursor-pointer bg-[#f7f7f7] hover:bg-[#B3C8CF]">
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
                                        className="gap-2 min-w-[210px] justify-start cursor-pointer bg-[#f7f7f7] hover:bg-[#B3C8CF]"
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
                                <SelectTrigger
                                    className="w-[140px] border border-gray-200 cursor-pointer bg-[#f7f7f7] hover:bg-[#B3C8CF]">
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
                        <Card className="bg-[#f7f7f7] shadow-sm border border-gray-200">
                            <CardContent className="p-0">
                                {/* Table Header */}
                                <div
                                    className="grid grid-cols-11 gap-4 px-6 py-3 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide items-center">
                                    {/*<div className="col-span-1 flex items-center">*/}
                                    {/*    <Checkbox/>*/}
                                    {/*</div>*/}
                                    <div className="col-span-4 ml-5">Account</div>
                                    <div className="col-span-2">Phone Number</div>
                                    <div className="col-span-1">Role</div>
                                    <div className="col-span-2">Joined Date</div>
                                    <div className="col-span-1">Status</div>
                                    <div className="col-span-1 text-right">Actions</div>
                                </div>

                                {/* Account Rows */}
                                {paginatedAccounts.map(account => (
                                    <div
                                        key={account.userId}
                                        className="grid grid-cols-11 gap-4 px-6 py-4 border-b border-gray-100 last:border-0 items-center hover:bg-[#eef3f5]"
                                    >
                                        {/*<div className="col-span-1 flex items-center">*/}
                                        {/*    <Checkbox/>*/}
                                        {/*</div>*/}
                                        <div className="col-span-4 flex items-center gap-3 ml-5">
                                            <Avatar className="w-10 h-10 mr-4">
                                                {account.avatarUrl ? (
                                                    <AvatarImage src={account.avatarUrl} alt={account.fullName}/>
                                                ) : (
                                                    <AvatarFallback className="bg-gray-300"/>
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
                                        <div className="col-span-1">
                                            <Badge
                                                variant={getStatusVariant(account.status)}
                                                className={getStatusClasses(account.status)}
                                            >
                                                ● {account.status}
                                            </Badge>
                                        </div>
                                        <div className="col-span-1 flex justify-end gap-1">
                                            <Link to={`/admin/accounts/account-detail/${account.userId}`}>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 hover:bg-gray-100 cursor-pointer"
                                                    title="View account details"
                                                >
                                                    <Eye className="h-4 w-4 text-gray-500"/>
                                                </Button>
                                            </Link>
                                            <DropdownMenu modal={false}>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon"
                                                            className="h-8 w-8 hover:bg-gray-100 cursor-pointer">
                                                        <MoreVertical className="h-4 w-4 text-gray-500"/>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end"
                                                                     className="bg-[#f7f7f7] border-2 border-gray-200">
                                                    <Link to={`/admin/accounts/account-detail/${account.userId}`}>
                                                        <DropdownMenuItem>
                                                            <UserCircle className="mr-2 h-4 w-4"/>
                                                            View account details
                                                        </DropdownMenuItem>
                                                    </Link>
                                                    <DropdownMenuItem
                                                        className="flex items-center gap-2 cursor-pointer"
                                                        onClick={() => handleToggleBan(account)}
                                                    >
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
                                                    {/*<DropdownMenuItem>*/}
                                                    {/*    <Settings className="mr-2 h-4 w-4"/>*/}
                                                    {/*    Reset password*/}
                                                    {/*</DropdownMenuItem>*/}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                ))}

                                {/* Footer with Pagination */}
                                <div className="px-6 py-4 flex items-center justify-between text-sm text-gray-600">
                                    <div>
                                        {isSearching ? (
                                            <>Showing {accounts.length} search results</>
                                        ) : (
                                            <>Showing {totalItems === 0 ? 0 : startItem}–{Math.min((currentPage + 1) * pageSize, totalItems)} of {totalItems} results</>
                                        )}
                                    </div>

                                    <AccountsPagination
                                        handleNext={handleNext}
                                        handlePrev={handlePrev}
                                        handlePageChange={handlePageChange}
                                        page={currentPage + 1}
                                        totalPages={totalPages}
                                        isSearching={isSearching}
                                    />
                                </div>

                            </CardContent>
                        </Card>
                    </div>
                </main>

                {/* Create Organizer Modal */}
                <CreateOrganizerModal isOpen={isModalOpen} onClose={closeModal} onCreated={handleOrganizerCreated}/>
            </div>
        </>
    );
}