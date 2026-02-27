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
import { Input } from "../../components/domain/admin/Input.jsx";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/domain/admin/Card.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/domain/admin/Select.jsx";
import { AdminSidebar } from "../../components/domain/admin/AdminSidebar.jsx";
import { Badge } from "../../components/domain/admin/Badge.jsx";
import { Progress } from '../../components/domain/admin/Progress.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/domain/admin/Tabs.jsx';
import { Checkbox } from '../../components/domain/admin/Checkbox.jsx'
import { Textarea } from '../../components/domain/admin/Textarea.jsx'
import { ImageWithFallback } from '../../components/domain/admin/ImageWithFallback.jsx'
import { adminService } from '../../services/admin.service.js';
import { Alert } from "../../components/common/Alert.jsx";
import { useAlert } from '../../hooks/useAlert.js';
import { Popconfirm } from 'antd';
import dayjs from "dayjs";

// Mock event data - in a real app, this would be fetched based on the ID
// const eventData = {
//     "1": {
//         id: 1,
//         name: "Tech Conference 2026",
//         status: "Approved",
//         statusVariant: "default",
//         date: "March 15, 2026",
//         time: "09:00 AM - 05:00 PM",
//         location: "San Francisco Convention Center, CA",
//         organizer: "Sarah Johnson",
//         organization: "TechEvents Inc.",
//         bannerUrl: null,
//         description:
//             "Join us for the most anticipated technology conference of 2026! This year's Tech Conference brings together industry leaders, innovators, and developers from around the globe to explore the latest trends in artificial intelligence, cloud computing, cybersecurity, and software development.\n\nOur conference features 50+ expert speakers, hands-on workshops, networking sessions, and an expo showcasing cutting-edge technology products and services. Whether you're a seasoned professional or just starting your tech career, this conference offers valuable insights and connections that will shape your future in the technology industry.",
//         tickets: [
//             {
//                 tier: "Early Bird",
//                 quantity: 300,
//                 price: 45,
//                 available: 0,
//                 feeStatus: "Included"
//             },
//             {
//                 tier: "General Admission",
//                 quantity: 500,
//                 price: 65,
//                 available: 153,
//                 feeStatus: "Included"
//             },
//             {
//                 tier: "VIP Pass",
//                 quantity: 150,
//                 price: 120,
//                 available: 50,
//                 feeStatus: "Excluded"
//             },
//             {
//                 tier: "Student Discount",
//                 quantity: 50,
//                 price: 30,
//                 available: 3,
//                 feeStatus: "Included"
//             }
//         ],
//         timeline: [
//             {
//                 time: "09:00 AM",
//                 title: "Registration & Breakfast",
//                 location: "Main Lobby",
//                 speaker: "Event Staff"
//             },
//             {
//                 time: "10:00 AM",
//                 title: "Opening Keynote: The Future of AI",
//                 location: "Grand Hall",
//                 speaker: "Dr. Emily Chen, AI Research Lead"
//             },
//             {
//                 time: "11:30 AM",
//                 title: "Workshop: Building Scalable Applications",
//                 location: "Room A",
//                 speaker: "Michael Rodriguez, Senior Architect"
//             },
//             {
//                 time: "01:00 PM",
//                 title: "Lunch & Networking",
//                 location: "Terrace Level",
//                 speaker: "Open Networking"
//             },
//             {
//                 time: "02:30 PM",
//                 title: "Panel: Cybersecurity Best Practices",
//                 location: "Grand Hall",
//                 speaker: "Industry Experts Panel"
//             },
//             {
//                 time: "04:00 PM",
//                 title: "Closing Remarks & Q&A",
//                 location: "Grand Hall",
//                 speaker: "Sarah Johnson, Event Director"
//             }
//         ]
//     },
//     "3": {
//         id: 3,
//         name: "Workshop Series: Design Thinking",
//         status: "Pending",
//         statusVariant: "secondary",
//         date: "February 28, 2026",
//         time: "10:00 AM - 04:00 PM",
//         location: "Workshop Co. Studio, New York, NY",
//         organizer: "Emma Williams",
//         organization: "Workshop Co.",
//         bannerUrl: null,
//         description:
//             "Unlock your creative potential with our comprehensive Design Thinking workshop. This interactive session is designed for professionals, entrepreneurs, and anyone interested in human-centered design principles.\n\nLearn the five stages of design thinking: Empathize, Define, Ideate, Prototype, and Test. Through hands-on activities and real-world case studies, you'll develop practical skills to solve complex problems and drive innovation in your organization.",
//         tickets: [
//             {
//                 tier: "Individual Pass",
//                 quantity: 150,
//                 price: 85,
//                 available: 44,
//                 feeStatus: "Included"
//             },
//             {
//                 tier: "Team Pass (3 people)",
//                 quantity: 50,
//                 price: 220,
//                 available: 50,
//                 feeStatus: "Excluded"
//             }
//         ],
//         timeline: [
//             {
//                 time: "10:00 AM",
//                 title: "Welcome & Introduction to Design Thinking",
//                 location: "Main Studio",
//                 speaker: "Emma Williams"
//             },
//             {
//                 time: "11:00 AM",
//                 title: "Empathy Mapping Exercise",
//                 location: "Break-out Rooms",
//                 speaker: "Workshop Facilitators"
//             },
//             {
//                 time: "12:30 PM",
//                 title: "Lunch Break",
//                 location: "Cafeteria",
//                 speaker: ""
//             },
//             {
//                 time: "01:30 PM",
//                 title: "Ideation & Prototyping Session",
//                 location: "Design Lab",
//                 speaker: "Emma Williams"
//             },
//             {
//                 time: "03:00 PM",
//                 title: "Group Presentations & Feedback",
//                 location: "Main Studio",
//                 speaker: "All Participants"
//             }
//         ]
//     },
//     "7": {
//         id: 7,
//         name: "Indie Film Festival",
//         status: "Pending",
//         statusVariant: "secondary",
//         date: "May 18, 2026",
//         time: "07:00 PM - 11:00 PM",
//         location: "Regal Cinema Downtown, Los Angeles, CA",
//         organizer: "Amanda Garcia",
//         organization: "Arts & Culture Foundation",
//         bannerUrl: null,
//         description:
//             "Celebrate independent cinema at our annual Indie Film Festival! This year's event showcases 12 carefully curated short films and 3 feature-length movies from emerging filmmakers around the world.\n\nExperience powerful storytelling, innovative cinematography, and thought-provoking themes. After each screening, join us for Q&A sessions with the directors and cast members. This is a unique opportunity to support independent artists and discover the next generation of filmmaking talent.",
//         tickets: [
//             {
//                 tier: "General Admission",
//                 quantity: 300,
//                 price: 25,
//                 available: 300,
//                 feeStatus: "Included"
//             },
//             {
//                 tier: "Premium Seating",
//                 quantity: 100,
//                 price: 40,
//                 available: 100,
//                 feeStatus: "Excluded"
//             }
//         ],
//         timeline: [
//             {
//                 time: "07:00 PM",
//                 title: "Doors Open & Welcome Reception",
//                 location: "Main Lobby",
//                 speaker: "Event Staff"
//             },
//             {
//                 time: "07:30 PM",
//                 title: "Short Film Block #1",
//                 location: "Theater 1",
//                 speaker: "Various Directors"
//             },
//             {
//                 time: "09:00 PM",
//                 title: "Feature Film Premiere",
//                 location: "Theater 1",
//                 speaker: "Director Q&A Following"
//             },
//             {
//                 time: "10:45 PM",
//                 title: "Closing Remarks & Awards",
//                 location: "Theater 1",
//                 speaker: "Festival Director"
//             }
//         ]
//     }
// }

export function EventDetail() {
    const { id } = useParams()
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState(null);
    const [error, setError] = useState(null);
    const { alert, showAlert, closeAlert } = useAlert();

    const fetchEvent = async () => {
        if (!id) return;

        try {
            setLoading(true);
            const response = await adminService.getEventDetail(id)
            setEvent(response.data)
        } catch (error) {
            setError("Cannot load event detail");
            console.error(error)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (id) fetchEvent()
    }, [id]);

    const isPending = event?.status === "PENDING"

    const [checklist, setChecklist] = useState({
        basicInfo: false,
        imagesPolicy: false,
        contentQuality: false,
        pricingTransparency: false,
        legalPolicy: false
    })

    const [adminNotes, setAdminNotes] = useState("")

    const allChecklistComplete = Object.values(checklist).every(value => value)

    const handleChecklistChange = key => {
        setChecklist({ ...checklist, [key]: !checklist[key] })
    }

    const handleApprove = () => {
        alert("Event approved successfully!")
    }

    const handleReject = () => {
        if (window.confirm("Are you sure you want to reject this event?")) {
            alert("Event rejected.")
        }
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
                                        variant={getStatusVariant(event.status)}
                                        className={getStatusClasses(event.status)}
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
                                        <div className="prose max-w-none text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                            {event?.description}
                                        </div>
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
                                    <CardContent className="pt-6">
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
                                                            Price (USD)
                                                        </th>
                                                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                                            Available
                                                        </th>
                                                        <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                                            Fee Status
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {/* {event.tickets.map((ticket, index) => (
                                                        <tr
                                                            key={index}
                                                            className="border-b border-gray-100 last:border-0"
                                                        >
                                                            <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                                                {ticket.tier}
                                                            </td>
                                                            <td className="py-3 px-4 text-sm text-gray-900 text-right">
                                                                {ticket.quantity}
                                                            </td>
                                                            <td className="py-3 px-4 text-sm font-semibold text-gray-900 text-right">
                                                                ${ticket.price.toFixed(2)}
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
                                                                    variant={
                                                                        ticket.feeStatus === "Included"
                                                                            ? "default"
                                                                            : "secondary"
                                                                    }
                                                                    className={
                                                                        ticket.feeStatus === "Included"
                                                                            ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                                                                            : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                                                                    }
                                                                >
                                                                    {ticket.feeStatus}
                                                                </Badge>
                                                            </td>
                                                        </tr>
                                                    ))} */}
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
                                            {/* {event.timeline.map((item, index) => (
                                                <div key={index} className="flex gap-4">
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-8 h-8 bg-[#7FA5A5] text-white rounded-full flex items-center justify-center text-xs font-semibold">
                                                            {index + 1}
                                                        </div>
                                                        {index < event.timeline.length - 1 && (
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
                                                                {item.time}
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
                                                            {item.speaker && (
                                                                <div className="flex items-center gap-1">
                                                                    <UserCircle className="h-3 w-3" />
                                                                    <span>{item.speaker}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))} */}
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
                                <CardHeader className="border-b border-gray-100">
                                    <CardTitle className="text-lg">Review & Approve</CardTitle>
                                    <CardDescription>
                                        Complete checklist before approval
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-6">
                                    {/* Review Checklist */}
                                    {/* <div>
                                        <label className="text-sm font-semibold text-gray-900 mb-3 block">
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
                                    </div> */}

                                    {/* Internal Admin Notes */}
                                    {/* <div>
                                        <label className="text-sm font-semibold text-gray-900 mb-2 block">
                                            Internal Admin Notes
                                        </label>
                                        <Textarea
                                            placeholder="Add observations for the organizer..."
                                            value={adminNotes}
                                            onChange={e => setAdminNotes(e.target.value)}
                                            className="min-h-[120px] resize-none border border-gray-200"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Optional but recommended for rejection cases
                                        </p>
                                    </div> */}

                                    {/* Action Buttons */}
                                    {/* <div className="space-y-2 pt-4">
                                        <Button
                                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                                            disabled={!allChecklistComplete}
                                            onClick={handleApprove}
                                        >
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            Approve Event
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            className="w-full"
                                            onClick={handleReject}
                                        >
                                            <X className="mr-2 h-4 w-4" />
                                            Reject Submission
                                        </Button>
                                    </div>

                                    {!allChecklistComplete && (
                                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                                            <p className="text-xs text-orange-800">
                                                Complete all checklist items to enable approval
                                            </p>
                                        </div>
                                    )} */}
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
