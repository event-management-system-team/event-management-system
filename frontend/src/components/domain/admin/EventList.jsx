import { useEffect, useMemo, useState } from "react";
import { AccountsPagination } from "../admin/AccountsPagination";
import { Avatar, AvatarFallback, AvatarImage } from "../admin/Avatar";
import { Badge } from "../admin/Badge";
import { Card, CardContent } from "../admin/Card";
import { Link } from "react-router-dom";
import { Button } from "./Button";
import { CheckCircle, Eye, X } from "lucide-react";
import { adminService } from "../../../services/admin.service";
import dayjs from "dayjs";

const EventList = ({ searchTerm, status, category, priceType, date, sortOption, onLoading, onError, showAlert }) => {
    const [events, setEvents] = useState([])
    const [originalEvents, setOriginalEvents] = useState([])
    const [currentPage, setCurrentPage] = useState(0);

    const fetchData = async () => {
        try {
            onLoading(true)

            const [eventRes, allEventRes] = await Promise.all([
                adminService.getAllEvents(currentPage, 10),
                adminService.getAllEventsPlain()
            ])

            setEvents(eventRes.data.content)
            setCurrentPage(eventRes.data.number)

            setOriginalEvents(allEventRes.data);

        } catch (error) {
            onError("Cannot load events")
            console.error(error)
        } finally {
            onLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [currentPage])

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

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = String(date.getFullYear()).slice(-2);

        return `${day}/${month}/${year}`;
    };

    return (
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
                        <div className="col-span-1">Status</div>
                        <div className="col-span-1 text-center">Created At</div>
                        <div className="col-span-1 text-right">Actions</div>
                    </div>

                    {/* Event Rows */}
                    {!paginatedEvents || paginatedEvents.length === 0 ? (
                        <div className="flex items-center justify-center flex-1 text-sm text-gray-400 mt-15">
                            No event data yet
                        </div>
                    ) : (
                        paginatedEvents.map(event => {
                            const progress = ticketProgress(event?.totalCapacity, event?.registeredCount);
                            const detailUrl = `/admin/events/event-detail/${event.eventSlug}`;

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
                                    <div className="col-span-1">
                                        <Badge
                                            variant={getStatusVariant(event.status)}
                                            className={getStatusClasses(event.status)}
                                        >
                                            ● {event.status}
                                        </Badge>
                                    </div>
                                    <div className="col-span-1">
                                        <div className="text-sm text-gray-700 text-center">
                                            {formatDate(event.createdAt)}
                                        </div>
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
                        })
                    )}

                    {/* Footer with Pagination */}
                    <div className="px-6 py-4 flex items-center justify-between text-sm text-gray-600">
                        <div>
                            {isSearching ? (
                                <>Showing {processedEvents.length} search results</>
                            ) : (
                                <>Showing {totalItems === 0 ? 0 : startItem}–{Math.min((currentPage + 1) * pageSize, totalItems)} of {totalItems} events</>
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
    )
};

export default EventList;