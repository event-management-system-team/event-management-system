import {
    Calendar,
    Users,
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
    Clock,
    DollarSign,
    Ticket,
    CheckCircle,
    X,
    FileText,
    Activity,
    History
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { Avatar, AvatarFallback } from "../../components/domain/admin/Avatar.jsx";
import { Button } from "../../components/domain/admin/Button.jsx";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/domain/admin/Card.jsx";
import { AdminSidebar } from "../../components/domain/admin/AdminSidebar.jsx";
import { Badge } from "../../components/domain/admin/Badge.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/domain/admin/Tabs.jsx';
import { Checkbox } from '../../components/domain/admin/Checkbox.jsx'
import { Textarea } from '../../components/domain/admin/Textarea.jsx'
import { ImageWithFallback } from '../../components/domain/admin/ImageWithFallback.jsx'
import { adminService } from '../../services/admin.service.js';
import { Alert } from "../../components/common/Alert.jsx";
import { useAlert } from '../../hooks/useAlert.js';
import { Popconfirm } from 'antd';
import dayjs from "dayjs";

export function EventDetail() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState(null);
    const [ticketTypes, setTicketTypes] = useState([]);
    const [agenda, setAgenda] = useState([]);
    const [error, setError] = useState(null);
    const { alert, showAlert, closeAlert } = useAlert();

    const fetchEvent = async () => {
        if (!id) return

        try {
            setLoading(true)
            const response = await adminService.getEventDetail(id)
            setEvent(response.data)
        } catch (error) {
            setError("Cannot load event detail");
            console.error(error)
        } finally {
            setLoading(false);
        }
    }

    const fetchTicketTypes = async () => {
        if (!id) return

        try {
            setLoading(true)
            const response = await adminService.getTicketTypes(id)
            setTicketTypes(response.data)
        } catch (error) {
            setError("Cannot load event ticket types");
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const fetchEventAgenda = async () => {
        if (!id) return

        try {
            setLoading(true)
            const response = await adminService.getEventAgenda(id)
            setAgenda(response.data)
        } catch (error) {
            setError("Cannot load event ticket types");
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) {
            fetchEvent()
            fetchTicketTypes()
            fetchEventAgenda()
        }
    }, [id]);

    const SALE_STATUS_CONFIG = {
        NOT_STARTED: {
            label: "Coming Soon",
            className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
        },
        ON_SALE: {
            label: "On Sale",
            className: "bg-green-100 text-green-700 hover:bg-green-100",
        },
        SOLD_OUT: {
            label: "Sold Out",
            className: "bg-red-100 text-red-700 hover:bg-red-100",
        },
        ENDED: {
            label: "Ended",
            className: "bg-gray-200 text-gray-700 hover:bg-gray-200",
        },
    }

    const formatPrice = (price) =>
        new Intl.NumberFormat("vi-VN").format(price)

    const formatTime = (dateString) => {
        if (!dateString) return "";

        const date = new Date(dateString);

        return new Intl.DateTimeFormat("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }).format(date);
    };

    const isPending = event?.status === "PENDING"

    const [adminNotes, setAdminNotes] = useState("")
    const [checklist, setChecklist] = useState({
        basicInfo: false,
        imagesPolicy: false,
        contentQuality: false,
        pricingTransparency: false,
        legalPolicy: false
    })

    const checklistLables = {
        basicInfo: "Basic Info Verified",
        imagesPolicy: "Images Policy Compliant",
        contentQuality: "Content Quality Audit",
        pricingTransparency: "Pricing Transparency",
        legalPolicy: "Legal / Policy Review"
    }

    const handleApproveEvent = async () => {
        if (!id) return

        try {
            setLoading(true)
            await adminService.approveEvent(id)
            showAlert("success", 'Approve event successfully', 2500)
            await fetchEvent()
        } catch (error) {
            showAlert("error", "Operation failed", 4000)
            console.error(error)
        }
    }

    const buildRejectReason = () => {
        const failedItems = Object.entries(checklist)
            .filter(([_, value]) => !value)
            .map(([key]) => `- ${checklistLables[key]}`)
        let reason = ''

        if (failedItems.length > 0) {
            reason += 'The following review items were not satisfied:\n'
            reason += failedItems.join('\n')
            reason += '\n\n'
        }

        if (adminNotes.trim()) {
            reason += 'Admin Notes:\n'
            reason += adminNotes.trim()
        }

        return reason.trim()
    }

    const handleRejectEvent = async () => {
        if (!id) return

        const rejectionReason = buildRejectReason()

        if (!rejectionReason) {
            alert("Please provide rejection reason or checklist feedback.")
            return
        }

        try {
            setLoading(true)
            await adminService.rejectEvent(id, rejectionReason)
            showAlert("success", 'Reject event successfully', 2500)
            await fetchEvent()
        } catch (error) {
            showAlert("error", "Operation failed", 4000)
            console.error(error)
        }
    }

    const allChecklistComplete = Object.values(checklist).every(value => value)

    const handleChecklistChange = key => {
        setChecklist({ ...checklist, [key]: !checklist[key] })
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
                            <Link to="/admin" className="hover:text-gray-900">
                                Dashboard
                            </Link>
                            <ChevronRight className="h-4 w-4" />
                            <Link to="/admin/events" className="hover:text-gray-900">
                                Event Management
                            </Link>
                            <ChevronRight className="h-4 w-4" />
                            <span>Event Detail</span>
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
                </header>

                {/* Event Banner & Title Section */}
                <div className="relative">
                    {/* Banner Image */}
                    <div className="h-48 bg-gradient-to-r from-slate-800 to-slate-600 relative overflow-hidden">
                        {event?.bannerUrl ? (
                            <ImageWithFallback
                                src={event.bannerUrl}
                                alt={event.eventName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Calendar className="h-24 w-24 text-white/20" />
                            </div>
                        )}
                    </div>

                    {/* Event Title & Metadata */}
                    <div className="bg-[#f7f7f7] border-b border-gray-200 px-8 py-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <Badge
                                        variant={getStatusVariant(event?.status)}
                                        className={getStatusClasses(event?.status)}
                                    >
                                        ● {event?.status}
                                    </Badge>
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                    {event?.eventName}
                                </h1>
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Calendar className="h-5 w-5 mr-2" />
                                        <div>
                                            <div className="text-base font-semibold text-gray-600">
                                                {dayjs(event?.startDate).format("MMM DD, YYYY")}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {dayjs(event?.startDate).format("hh:mm A")} -{" "}
                                                {dayjs(event?.endDate).format("hh:mm A")}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <MapPin className="h-5 w-5 mr-2" />
                                        <div>
                                            <div className="text-base font-semibold text-gray-600">
                                                Location
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {event?.location}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <UserCircle className="h-5 w-5 mr-2" />
                                        <div className="text-base font-semibold text-gray-600">
                                            {event?.organizer?.fullName}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className={`p-8 ${isPending ? "grid grid-cols-12 gap-6" : ""}`}>
                    <div className={isPending ? "col-span-8" : "col-span-12"}>
                        <Tabs defaultValue="general" className="w-full">
                            <TabsList className="h-12 bg-[#f7f7f7] border-b border-gray-200 w-full justify-start rounded-none p-0">
                                <TabsTrigger
                                    value="general"
                                    className="h-12 bg-transparent border-b-2 border-transparent data-[state=active]:border-[#7FA5A5] data-[state=active]:text-[#7FA5A5] rounded-none px-6 data-[state=active]:shadow-none"
                                >
                                    General Information
                                </TabsTrigger>
                                <TabsTrigger
                                    value="analytics"
                                    className="h-12 bg-transparent border-b-2 border-transparent data-[state=active]:border-[#7FA5A5] data-[state=active]:text-[#7FA5A5] rounded-none px-6 data-[state=active]:shadow-none"
                                >
                                    Analytics Preview
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="general" className="mt-6 space-y-6">
                                {/* Event Overview */}
                                <Card className="bg-[#f7f7f7] shadow-sm border border-gray-200">
                                    <CardHeader className="border-b border-gray-200">
                                        <CardTitle className="text-lg font-semibold">Event Overview</CardTitle>
                                        <CardDescription className='font-light text-gray-500'>
                                            Detailed event description and information
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-3">
                                        {/* <div className="prose max-w-none text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                            {event?.description}
                                        </div> */}
                                        <div
                                            className="prose max-w-none text-sm text-gray-700 leading-relaxed whitespace-pre-line"
                                            dangerouslySetInnerHTML={{ __html: event?.description }}
                                        />
                                    </CardContent>
                                </Card>

                                {/* Inventory & Pricing */}
                                <Card className="bg-[#f7f7f7] shadow-sm border border-gray-200">
                                    <CardHeader className="border-b border-gray-200">
                                        <CardTitle className="text-lg font-semibold">
                                            Inventory & Pricing
                                        </CardTitle>
                                        <CardDescription className='font-light text-gray-500'>
                                            Ticket tiers and availability
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-2">
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b border-gray-200">
                                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                                            Ticket Tier
                                                        </th>
                                                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                                            Quantity
                                                        </th>
                                                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                                            Price (VND)
                                                        </th>
                                                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                                            Available
                                                        </th>
                                                        <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                                            Sale Status
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {ticketTypes?.map((ticket, index) => {
                                                        const status = SALE_STATUS_CONFIG[ticket.saleStatus] || {
                                                            label: ticket.saleStatus,
                                                            className: "bg-gray-100 text-gray-700",
                                                        }

                                                        return (
                                                            <tr
                                                                key={index}
                                                                className="border-b border-gray-100 last:border-0"
                                                            >
                                                                <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                                                    {ticket.ticketName}
                                                                </td>
                                                                <td className="py-3 px-4 text-sm text-gray-900 text-right">
                                                                    {ticket.quantity}
                                                                </td>
                                                                <td className="py-3 px-4 text-sm font-semibold text-gray-900 text-right">
                                                                    {formatPrice(ticket.price)}
                                                                </td>
                                                                <td className="py-3 px-4 text-sm text-gray-900 text-right">
                                                                    <span
                                                                        className={
                                                                            ticket.available === 0
                                                                                ? "text-red-600 font-medium"
                                                                                : ""
                                                                        }
                                                                    >
                                                                        {ticket.available}
                                                                    </span>
                                                                </td>
                                                                <td className="py-3 px-4 text-center">
                                                                    <Badge
                                                                        variant="secondary"
                                                                        className={status.className}
                                                                    >
                                                                        {status.label}
                                                                    </Badge>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Event Timeline */}
                                <Card className="bg-[#f7f7f7] shadow-sm border border-gray-200">
                                    <CardHeader className="border-b border-gray-200">
                                        <CardTitle className="text-lg font-semibold">Event Timeline</CardTitle>
                                        <CardDescription className='font-light text-gray-500'>
                                            Scheduled sessions and activities
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <div className="space-y-4">
                                            {agenda?.map((item, index) => (
                                                <div key={index} className="flex gap-4">
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-8 h-8 bg-[#7FA5A5] text-white rounded-full flex items-center justify-center text-xs font-semibold">
                                                            {item.orderIndex}
                                                        </div>
                                                        {item.orderIndex < agenda.length && (
                                                            <div
                                                                className="w-0.5 flex-1 bg-gray-200 my-2"
                                                                style={{ minHeight: "40px" }}
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 pb-6">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Clock className="h-4 w-4 text-gray-400" />
                                                            <span className="text-sm font-semibold text-gray-900">
                                                                {formatTime(item.startTime)}
                                                            </span>
                                                        </div>
                                                        <div className="text-base font-medium text-gray-900 mb-1">
                                                            {item.title}
                                                        </div>
                                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                                            {item.location && (
                                                                <div className="flex items-center gap-1">
                                                                    <MapPin className="h-3 w-3" />
                                                                    <span>{item.location}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="analytics" className="mt-6">
                                <Card className="bg-[#f7f7f7] shadow-sm border border-gray-200">
                                    <CardHeader className="border-b border-gray-100">
                                        <CardTitle className="text-lg">Analytics Preview</CardTitle>
                                        <CardDescription>
                                            Event performance metrics and insights
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <p className="text-sm text-gray-600">
                                            Analytics data would be displayed here...
                                        </p>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Review & Approve Panel - Only show if status is Pending */}
                    {isPending && (
                        <div className="col-span-4">
                            <Card className="bg-[#f7f7f7] shadow-sm sticky top-8 border border-gray-200">
                                <CardHeader className="border-b border-gray-200">
                                    <CardTitle className="text-lg font-semibold">Review & Approve</CardTitle>
                                    <CardDescription>
                                        Complete checklist before approval
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-6">
                                    {/* Review Checklist */}
                                    <div>
                                        <label className="text-base font-semibold text-gray-900 mb-3 block">
                                            Review Checklist
                                        </label>
                                        <div className="space-y-3">
                                            <div className="flex items-center">
                                                <Checkbox
                                                    id="basicInfo"
                                                    checked={checklist.basicInfo}
                                                    onCheckedChange={() =>
                                                        handleChecklistChange("basicInfo")
                                                    }
                                                />
                                                <label
                                                    htmlFor="basicInfo"
                                                    className="ml-3 text-sm text-gray-700 cursor-pointer"
                                                >
                                                    Basic Info Verified
                                                </label>
                                            </div>
                                            <div className="flex items-center">
                                                <Checkbox
                                                    id="imagesPolicy"
                                                    checked={checklist.imagesPolicy}
                                                    onCheckedChange={() =>
                                                        handleChecklistChange("imagesPolicy")
                                                    }
                                                />
                                                <label
                                                    htmlFor="imagesPolicy"
                                                    className="ml-3 text-sm text-gray-700 cursor-pointer"
                                                >
                                                    Images Policy Compliant
                                                </label>
                                            </div>
                                            <div className="flex items-center">
                                                <Checkbox
                                                    id="contentQuality"
                                                    checked={checklist.contentQuality}
                                                    onCheckedChange={() =>
                                                        handleChecklistChange("contentQuality")
                                                    }
                                                />
                                                <label
                                                    htmlFor="contentQuality"
                                                    className="ml-3 text-sm text-gray-700 cursor-pointer"
                                                >
                                                    Content Quality Audit
                                                </label>
                                            </div>
                                            <div className="flex items-center">
                                                <Checkbox
                                                    id="pricingTransparency"
                                                    checked={checklist.pricingTransparency}
                                                    onCheckedChange={() =>
                                                        handleChecklistChange("pricingTransparency")
                                                    }
                                                />
                                                <label
                                                    htmlFor="pricingTransparency"
                                                    className="ml-3 text-sm text-gray-700 cursor-pointer"
                                                >
                                                    Pricing Transparency
                                                </label>
                                            </div>
                                            <div className="flex items-center">
                                                <Checkbox
                                                    id="legalPolicy"
                                                    checked={checklist.legalPolicy}
                                                    onCheckedChange={() =>
                                                        handleChecklistChange("legalPolicy")
                                                    }
                                                />
                                                <label
                                                    htmlFor="legalPolicy"
                                                    className="ml-3 text-sm text-gray-700 cursor-pointer"
                                                >
                                                    Legal / Policy Review
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Internal Admin Notes */}
                                    <div>
                                        <label className="text-base font-semibold text-gray-900 mb-2 block">
                                            Internal Admin Notes
                                        </label>
                                        <Textarea
                                            placeholder="Add observations for the organizer..."
                                            value={adminNotes}
                                            onChange={e => setAdminNotes(e.target.value)}
                                            className="min-h-[120px] resize-none border border-gray-200"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            For rejection cases only
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-2 pt-4">
                                        <Button
                                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                                            disabled={!allChecklistComplete}
                                            onClick={handleApproveEvent}
                                        >
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            Approve Event
                                        </Button>

                                        <Popconfirm
                                            title="Reject event"
                                            description="Are you sure to reject this event?"
                                            onConfirm={handleRejectEvent}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button
                                                variant="destructive"
                                                className="w-full"
                                            >
                                                <X className="mr-2 h-4 w-4" />
                                                Reject Submission
                                            </Button>
                                        </Popconfirm>
                                    </div>

                                    {!allChecklistComplete && (
                                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                                            <p className="text-xs text-orange-800">
                                                Complete all checklist items to enable approval
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}
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
