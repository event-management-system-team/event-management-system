import { useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../admin/Avatar";
import { Badge } from "../admin/Badge";
import { Card, CardContent } from "../admin/Card";
import { adminService } from "../../../services/admin.service";
import dayjs from "dayjs";

const EventPerformanceList = ({ searchTerm, status, category, date, sortOption, onLoading, onError, formatVND, formatNumber }) => {
    const [events, setEvents] = useState([])

    const fetchData = async () => {
        try {
            onLoading(true)
            const response = await adminService.getEventAnalytics()

            setEvents(response.data)
        } catch (error) {
            onError("Cannot load event analytics");
            console.error(error)
        } finally {
            onLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

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

    return (
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
                    </div>

                    {/* Event Rows */}
                    {!processedEvents || processedEvents?.length === 0 ? (
                        <div className="flex items-center justify-center flex-1 text-sm text-gray-400 mt-15 mb-15">
                            No event analytics data yet
                        </div>
                    ) : (
                        processedEvents.map(event => {
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
                                </div>
                            )
                        }))}

                    {processedEvents?.length !== 0 && (
                        <div className="px-6 py-4 flex items-center justify-between text-sm text-gray-600">
                            Showing {processedEvents.length} events
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
};

export default EventPerformanceList;