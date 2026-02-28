import {
    Calendar,
    CheckCircle,
    Bell,
    Zap,
    CalendarCheck,
    ChevronRight,
    Search,
    Eye,
    X,
} from 'lucide-react';
import { Link } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from "../../components/domain/admin/Avatar.jsx";
import { Button } from "../../components/domain/admin/Button.jsx";
import { Input } from "../../components/domain/admin/Input.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/domain/admin/Card.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/domain/admin/Select.jsx";
import { AdminSidebar } from "../../components/domain/admin/AdminSidebar.jsx";
import { Badge } from "../../components/domain/admin/Badge.jsx";
import { useEffect, useMemo, useState } from "react";
import { useAlert } from '../../hooks/useAlert.js';
import { adminService } from '../../services/admin.service.js';
import { DatePicker, Space } from 'antd';
import dayjs from "dayjs";
import { AccountsPagination } from '../../components/domain/admin/AccountsPagination.jsx';
import { Alert } from '../../components/common/Alert.jsx';

export function EventManagement() {

    const [events, setEvents] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [originalEvents, setOriginalEvents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState("all");
    const [category, setCategory] = useState("all");
    const [priceType, setPriceType] = useState("all");
    const [date, setDate] = useState(null);
    const [sortOption, setSortOption] = useState("newest");
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { alert, showAlert, closeAlert } = useAlert();

    const loadAllEvents = async () => {
        try {
            setLoading(true)
            const response = await adminService.getAllEventsPlain()
            setOriginalEvents(response.data)
        } catch (error) {
            setError('Cannot load event list')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const loadData = async () => {
        try {
            setLoading(true);
            const response = await adminService.getAllEvents(currentPage, 10);

            setEvents(response.data.content);
            setCurrentPage(response.data.number)
        } catch (error) {
            setError("Cannot load event list");
            console.error(error)
        } finally {
            setLoading(false);
        }
    }

    const fetchCategories = async () => {
        try {
            setLoading(true)
            const response = await adminService.getAllCategories()
            setCategories(response.data)
        } catch (error) {
            setError("Cannot load category list");
            console.error(error)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData()
        loadAllEvents()
        fetchCategories()
    }, [currentPage]);

    const handleSearchChange = (e) => {
        const value = e.target.value
        setSearchTerm(value)

        if (!value.trim()) {
            setEvents(originalEvents);
            return;
        }

        const lower = value.toLowerCase();
        const filtered = originalEvents.filter(e =>
            e.eventName?.toLowerCase().includes(lower) ||
            e.location?.toLowerCase().includes(lower) ||
            e.organizer?.fullName?.toLowerCase().includes(value)
        );

        setEvents(filtered);
    };

    const processedEvents = useMemo(() => {
        let list = [...originalEvents];

        if (searchTerm.trim()) {
            const lower = searchTerm.toLowerCase();
            list = list.filter(e =>
                e.eventName?.toLowerCase().includes(lower) ||
                e.location?.toLowerCase().includes(lower) ||
                e.organizer?.fullName?.toLowerCase().includes(lower)
            );
        }

        // filter by status
        list = list.filter(e => status === "all" || e.status === status);

        // filter by category
        list = list.filter(e => category === "all" || e.category?.categorySlug === category);

        // filter by price type
        list = list.filter(e => {
            if (priceType === 'all') return true
            return priceType === 'free' ? e.isFree : !e.isFree
        })

        // filter by date 
        list = list.filter(e => {
            if (!date) return true;

            return dayjs(e.createdAt).isSame(date, "day");
        });

        // sort by option
        list.sort((a, b) => {
            switch (sortOption) {
                case "newest":
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case "oldest":
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                default:
                    return 0;
            }
        });

        return list;
    }, [originalEvents, searchTerm, status, category, priceType, date, sortOption]);

    const pageSize = 10;
    const startItem = currentPage * pageSize + 1;
    const isSearching = searchTerm.trim().length > 0;

    const totalItems = processedEvents.length;
    const totalPages = Math.max(
        1,
        Math.ceil(totalItems / pageSize)
    );

    useEffect(() => {
        if (currentPage > totalPages - 1) {
            setCurrentPage(0);
        }
    }, [totalPages]);

    const paginatedEvents = processedEvents.slice(
        currentPage * pageSize,
        (currentPage + 1) * pageSize
    );

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
        setCurrentPage(p - 1);
    };

    const ticketProgress = (total, registered) => {
        if (!total || total <= 0) return 0;
        const progress = (registered / total) * 100;

        return Math.min(100, Math.round(progress));
    };

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

    const summaryMetrics = (events) => {
        const total = events.length
        const approved = events.filter(e => e.status === "APPROVED").length
        const pending = events.filter(e => e.status === "PENDING").length
        const completed = events.filter(e => e.status === "COMPLETED").length

        return [
            {
                title: "TOTAL EVENTS",
                value: total,
                icon: Calendar,
                iconBg: "bg-blue-100",
                iconColor: "text-blue-600"
            },
            {
                title: "APPROVED",
                value: approved,
                icon: Zap,
                iconBg: "bg-green-100",
                iconColor: "text-green-600"
            },
            {
                title: "PENDING",
                value: pending,
                icon: CalendarCheck,
                iconBg: "bg-orange-100",
                iconColor: "text-orange-600"
            },
            {
                title: "COMPLETED",
                value: completed,
                icon: CheckCircle,
                iconBg: "bg-gray-200",
                iconColor: "text-gray-600"
            }
        ]
    }

    const metrics = summaryMetrics(originalEvents);

    if (loading) return <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 animate-pulse z-10" />
    if (error) return <div>Something went wrong: {error}</div>;

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
                            <span>Event Management</span>
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
                    {metrics.map((metric, index) => {
                        const Icon = metric.icon
                        return (<Card key={index} className="bg-[#f7f7f7] shadow-sm border border-gray-200">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <div
                                        className={`w-10 h-10 ${metric.iconBg} rounded-lg flex items-center justify-center`}
                                    >
                                        <Icon className={`h-5 w-5 ${metric.iconColor}`} />
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
                            <CardTitle className="text-lg font-semibold">Filter Events</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="grid grid-cols-7 gap-4 items-end">

                                {/* Search Input */}
                                <div className="col-span-2">
                                    <label className="text-sm text-gray-600 mb-2 block">
                                        Search
                                    </label>
                                    <div className="relative">
                                        <Search
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            type="text"
                                            placeholder="Event name, location, organization..."
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            className="pl-9 pr-4 py-2 w-full border-gray-300"
                                        />
                                    </div>
                                </div>

                                {/* Status Dropdown */}
                                <div className="col-span-1">
                                    <label className="text-sm text-gray-600 mb-2 block">
                                        Status
                                    </label>
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

                                {/* Category Dropdown */}
                                <div className="col-span-1">
                                    <label className="text-sm text-gray-600 mb-2 block">
                                        Category
                                    </label>
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
                                                    value={c.categorySlug}
                                                >
                                                    {c.categoryName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Price Type Dropdown */}
                                <div className="col-span-1">
                                    <label className="text-sm text-gray-600 mb-2 block">
                                        Price Type
                                    </label>
                                    <Select
                                        value={priceType}
                                        onValueChange={(value) => setPriceType(value)}
                                    >
                                        <SelectTrigger className='border border-gray-200 cursor-pointer bg-[#f7f7f7] hover:bg-[#B3C8CF]'>
                                            <SelectValue placeholder="Price Type" />
                                        </SelectTrigger>
                                        <SelectContent className='border border-gray-200'>
                                            <SelectItem value="all">All Type</SelectItem>
                                            <SelectItem value="free">Free</SelectItem>
                                            <SelectItem value="paid">Paid</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Date Picker */}
                                <div className="col-span-1">
                                    <label className="text-sm text-gray-600 mb-2 block">
                                        Date
                                    </label>
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
                                    <label className="text-sm text-gray-600 mb-2 block">
                                        Sort by
                                    </label>
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

                {/* Event List Table */}
                <div className="px-8 pb-8">
                    <Card className="bg-[#f7f7f7] shadow-sm border border-gray-200">
                        <CardContent className="p-0">
                            {/* Table Header */}
                            <div
                                className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide items-center">
                                <div className="col-span-3">Events</div>
                                <div className="col-span-2">Organizer</div>
                                <div className="col-span-2">Date & Time</div>
                                <div className="col-span-2">Tickets Sold</div>
                                <div className="col-span-2">Status</div>
                                <div className="col-span-1 text-right">Actions</div>
                            </div>

                            {/* Event Rows */}
                            {paginatedEvents.map(event => {
                                // const CategoryIcon = event.categoryIcon
                                const progress = ticketProgress(event?.totalCapacity, event?.registeredCount);
                                const detailUrl = `/admin/events/event-detail/${event.eventId}`;

                                return (
                                    <div
                                        key={event?.eventId}
                                        className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 last:border-0 items-center hover:bg-[#eef3f5]"
                                    >
                                        <div className="col-span-3 flex items-center gap-3">
                                            <Avatar className='w-10 h-10'>
                                                {event?.bannerUrl ? (
                                                    <AvatarImage src={event?.bannerUrl} alt={event.eventName} />
                                                ) : (
                                                    <AvatarFallback className="bg-gray-300" />
                                                )}
                                            </Avatar>
                                            <div>
                                                <div className="font-medium text-sm text-gray-900">
                                                    {event?.eventName}
                                                </div>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    {/* <CategoryIcon className="h-3 w-3 text-gray-400" /> */}
                                                    <span className="text-xs text-gray-500">{event?.category?.categoryName}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-sm text-gray-900">
                                                {event?.organizer?.fullName}
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-sm text-gray-900">
                                                {dayjs(event?.startDate).format("MMM DD, YYYY")}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {dayjs(event?.startDate).format("hh:mm A")} -{" "}
                                                {dayjs(event?.endDate).format("hh:mm A")}
                                            </div>
                                        </div>
                                        <div className="col-span-2">

                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-500 rounded-full"
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-gray-600 min-w-[35px]">{progress}%</span>
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                {event?.registeredCount}/{event?.totalCapacity}
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <Badge
                                                variant={getStatusVariant(event.status)}
                                                className={getStatusClasses(event.status)}
                                            >
                                                ● {event.status}
                                            </Badge>
                                        </div>
                                        <div className="col-span-1 flex justify-end gap-1">
                                            <Link to={detailUrl}>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    title="View event details"
                                                >
                                                    <Eye className="h-4 w-4 text-gray-500" />
                                                </Button>
                                            </Link>
                                            {event?.status === "PENDING" && (<>
                                                <Link to={detailUrl}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        title="Approve event"
                                                    >
                                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                                    </Button>
                                                </Link>

                                                <Link to={detailUrl}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        title="Reject event"
                                                    >
                                                        <X className="h-4 w-4 text-red-600" />
                                                    </Button>
                                                </Link>
                                            </>)}
                                        </div>
                                    </div>)
                            })}

                            {/* Footer with Pagination */}
                            <div className="px-6 py-4 flex items-center justify-between text-sm text-gray-600">
                                <div>
                                    {isSearching ? (
                                        <>Showing {processedEvents.length} search results</>
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

            {/* Global Alert */}
            <div className="fixed top-6 right-6 z-[999] w-[360px]">
                <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={closeAlert}
                />
            </div>
        </div>
    )
}