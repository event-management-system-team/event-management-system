import {
    Users,
    CheckCircle,
    Plus,
    Bell,
    ChevronRight,
    Search,
    UserCircle,
    MoreVertical,
    UserX,
    Eye,
    Download,
    ChevronLeft,
    Upload,
    Calendar1,
    FileText,
    ImageIcon,
    Trash2
} from 'lucide-react';
import { Link, useParams } from 'react-router';
import { useEffect, useRef, useState } from "react";
import { OrganizerSidebar } from "../../components/domain/organizer/OrganizerSidebar.jsx";
import { Button } from "../../components/domain/admin/Button.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/domain/admin/Avatar.jsx";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/domain/admin/Card.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/domain/admin/Tabs.jsx";
import { Input } from "../../components/domain/admin/Input.jsx";
import { Badge } from "../../components/domain/admin/Badge.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/domain/admin/Select.jsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "../../components/domain/admin/Dropdown-Menu.jsx";
import { organizerService } from "../../services/organizer.service.js";
import { adminService } from "../../services/admin.service.js";
import { AccountsPagination } from "../../components/domain/admin/AccountsPagination.jsx";
import { DatePicker, Space, Popconfirm, Calendar } from 'antd';
import { Alert } from "../../components/common/Alert.jsx";
import { useAlert } from '../../hooks/useAlert.js';
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
    createViewDay,
    createViewMonthAgenda,
    createViewMonthGrid,
    createViewWeek,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import 'temporal-polyfill/global'
import '@schedule-x/theme-default/dist/index.css'
import { CreateScheduleModal } from '../../components/domain/organizer/CreateScheduleModal.jsx';
import { AddShiftModal } from '../../components/domain/organizer/AddShiftModal.jsx';

const resources = [
    {
        id: "1",
        name: "Staff_Training_Manual_2026.pdf",
        type: "pdf",
        uploadDate: "Feb 10, 2026",
        size: "2.4 MB"
    },
    {
        id: "2",
        name: "Event_Floor_Plan.jpg",
        type: "image",
        uploadDate: "Feb 8, 2026",
        size: "1.8 MB"
    },
    {
        id: "3",
        name: "Staff_Schedule_Template.xlsx",
        type: "excel",
        uploadDate: "Feb 5, 2026",
        size: "156 KB"
    },
    {
        id: "4",
        name: "Emergency_Procedures.docx",
        type: "document",
        uploadDate: "Feb 1, 2026",
        size: "890 KB"
    },
    {
        id: "5",
        name: "Contact_List.pdf",
        type: "pdf",
        uploadDate: "Jan 28, 2026",
        size: "512 KB"
    }
]

export function StaffManagement() {

    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('staff');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [staffs, setStaffs] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState(resources)
    const fileInputRef = useRef(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
    const { alert, showAlert, closeAlert } = useAlert();

    const fetchStaffList = async () => {
        if (!id) return

        try {
            setLoading(true)
            const response = await organizerService.getEventStaff(id, currentPage, 10)

            setStaffs(response.data.content);
            setCurrentPage(response.data.number)
            setTotalPages(response.data.totalPages);
            setTotalItems(response.data.totalElements);
        } catch (error) {
            setError("Cannot load staff list");
            console.error(error)
        } finally {
            setLoading(false);
        }
    }

    const fetchAssignmentList = async () => {
        if (!id) return

        try {
            setLoading(true)
            const response = await organizerService.getStaffAssignmentByRole(id)
            setAssignments(response.data)
        } catch (error) {
            setError('Cannot load assignment list')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStaffList()
    }, [id, currentPage])

    useEffect(() => {
        fetchAssignmentList()
    }, [id]);

    const getTopRightAction = () => {
        switch (activeTab) {
            case "staff":
                return (
                    <div className="flex gap-3">
                        <Button
                            className="gap-2 bg-primary hover:bg-[#B3C8CF] text-white rounded-full px-5 py-5 h-12 w-32"
                        >
                            <Download className="h-4 w-4" />
                            Export List
                        </Button>
                    </div>
                )
            case "schedule":
                return (
                    <div className='flex gap-3'>
                        <Button
                            className="gap-2 bg-[#f7f7f7] hover:bg-[#B3C8CF] text-gray rounded-full px-5 py-5 h-12 w-40 border-1 border-gray-400"
                            onClick={openScheduleModal}
                        >
                            <Calendar1 className="h-4 w-4" />
                            Create Schedule
                        </Button>
                        {/* <Button
                            className="gap-2 bg-primary hover:bg-[#B3C8CF] text-white rounded-full px-5 py-5 h-12 w-32"
                            onClick={openShiftModal}
                        >
                            <Plus className="h-4 w-4" />
                            Add Shift
                        </Button> */}
                    </div>
                )
            default:
                return null
        }
    }

    const getFileIcon = type => {
        switch (type) {
            case "pdf":
                return <FileText className="h-8 w-8 text-red-500" />
            case "image":
                return <ImageIcon className="h-8 w-8 text-blue-500" />
            case "excel":
                return <FileText className="h-8 w-8 text-green-500" />
            case "document":
                return <FileText className="h-8 w-8 text-blue-600" />
            default:
                return <FileText className="h-8 w-8 text-gray-500" />
        }
    }

    const handleFileUpload = event => {
        const files = event.target.files
        if (files) {
            const newFiles = Array.from(files).map(file => {
                const fileType = file.type.includes("pdf")
                    ? "pdf"
                    : file.type.includes("image")
                        ? "image"
                        : file.type.includes("sheet") || file.name.endsWith(".xlsx")
                            ? "excel"
                            : "document"

                return {
                    id: Date.now().toString() + Math.random(),
                    name: file.name,
                    type: fileType,
                    uploadDate: new Date().toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                    }),
                    size:
                        file.size > 1024 * 1024
                            ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                            : `${(file.size / 1024).toFixed(0)} KB`
                }
            })
            setUploadedFiles([...uploadedFiles, ...newFiles])
            toast.success(`${newFiles.length} file(s) uploaded successfully`, {
                description: "Your resources have been added"
            })

            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        }
    }

    const handleFileDelete = fileId => {
        const file = uploadedFiles.find(f => f.id === fileId)
        setUploadedFiles(uploadedFiles.filter(f => f.id !== fileId))
        toast.success("File deleted", {
            description: `${file?.name} has been removed`
        })
    }

    const handleFileDownload = file => {
        // toast.info("Download started", {
        //     description: `Downloading ${file.name}`
        // })
        // In a real application, this would trigger an actual download
        console.log("Downloading file:", file.name)
    }

    const handleFilePreview = file => {
        // toast.info("Opening preview", {
        //     description: `Previewing ${file.name}`
        // })
        // In a real application, this would open a preview modal
        console.log("Previewing file:", file.name)
    }

    const handleDragOver = e => {
        e.preventDefault()
    }

    const handleDrop = e => {
        e.preventDefault()
        const files = e.dataTransfer.files
        if (files && files.length > 0) {
            const fakeEvent = {
                target: { files }
            }
            handleFileUpload(fakeEvent)
        }
    }

    const pageSize = 10;
    const startItem = currentPage * pageSize + 1;

    useEffect(() => {
        if (currentPage > totalPages - 1) {
            setCurrentPage(0);
        }
    }, [totalPages]);

    const handlePrev = () => {
        if (currentPage === 0) return;
        setCurrentPage(prev => prev - 1);
    };

    const handleNext = () => {
        if (currentPage >= totalPages - 1) return;
        setCurrentPage(prev => prev + 1);
    };

    const handlePageChange = (p) => {
        setCurrentPage(p - 1);
    };

    const openScheduleModal = () => {
        setIsScheduleModalOpen(true)
    };

    const openShiftModal = () => {
        setIsShiftModalOpen(true)
    };

    const closeScheduleModal = () => {
        setIsScheduleModalOpen(false);
    };

    const closeShiftModal = () => {
        setIsShiftModalOpen(false);
    };

    // const formatDate = (isoString) => {
    //     const date = new Date(isoString);

    //     return date.toLocaleDateString("en-US", {
    //         month: "short",
    //         day: "2-digit",
    //         year: "numeric",
    //     });
    // };

    const getStatusColor = (status) => {
        switch (status) {
            case "CONFIRMED":
                return "bg-green-500";
            case "ASSIGNED":
                return "bg-yellow-500";
            case "DECLINED":
                return "bg-red-500";
            default:
                return "bg-gray-400";
        }
    };

    const eventsService = useState(() => createEventsServicePlugin())[0]

    const tz = "Asia/Ho_Chi_Minh";

    const parseBackendTime = (time) => {
        const plain = Temporal.PlainDateTime.from(time);
        return plain.toZonedDateTime("Asia/Ho_Chi_Minh");
    };
    const calendar = useCalendarApp({
        timeZone: "Asia/Ho_Chi_Minh",
        views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
        plugins: [eventsService]
    })

    useEffect(() => {
        if (!assignments.length) return

        const events = assignments.map(a => ({
            // id: a.assignmentId,
            title: `${a.scheduleName} (${a.staffRole} Team)`,
            start: parseBackendTime(a.startTime),
            end: parseBackendTime(a.endTime),
            location: a.location
        }))

        // eventsService.set(events)
        calendar.events.set(events);

        // console.log(assignments[0])
        // console.log(parseBackendTime(assignments[0].startTime))
        // console.log(parseBackendTime(assignments[0].startTime).toString())
        // console.log(parseBackendTime("2026-03-06T08:00:00").toString())
        // console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)
    }, [assignments, calendar])

    const handleScheduleCreated = async () => {
        await fetchAssignmentList()
    }

    if (loading) return <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 animate-pulse z-10" />
    if (error) return <div>Something went wrong: {error}</div>;

    return (

        <div className="flex h-screen bg-[#F1F0E8]">
            {/* Sidebar */}
            <OrganizerSidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Header */}
                <header className="bg-[#f7f7f7] border-b border-gray-200 px-8 py-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>Dashboard</span>
                            <ChevronRight className="h-4 w-4" />
                            <span>Staff Management</span>
                        </div>
                        <div className="flex items-center gap-3">
                            {getTopRightAction()}
                        </div>
                    </div>
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-foreground text-2xl mb-1 font-semibold">Staff Management</h1>
                            <p className="text-gray-500 text-sm">
                                Oversee and manage system organizer accounts.
                            </p>
                        </div>
                    </div>
                </header>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="w-full justify-start bg-[#F1F0E8] rounded-none h-16">
                        <TabsTrigger
                            value="staff"
                            className="relative rounded-none px-8 py-5 border-b-2 border-transparent text-gray-600 data-[state=active]:border-b-2 data-[state=active]:border-b-[#7FA5A5] data-[state=active]:text-gray-700 data-[state=active]:font-semibold"
                        >
                            Staff Information
                        </TabsTrigger>
                        <TabsTrigger
                            value="schedule"
                            className="relative rounded-none px-8 py-5 border-b-2 border-transparent text-gray-600 data-[state=active]:border-b-2 data-[state=active]:border-b-[#7FA5A5] data-[state=active]:text-gray-700 data-[state=active]:font-semibold"
                        >
                            Work Schedule
                        </TabsTrigger>
                        <TabsTrigger
                            value="resources"
                            className="relative rounded-none px-8 py-5 border-b-2 border-transparent text-gray-600 data-[state=active]:border-b-2 data-[state=active]:border-b-[#7FA5A5] data-[state=active]:text-gray-700 data-[state=active]:font-semibold"
                        >
                            Resources
                        </TabsTrigger>
                    </TabsList>

                    {/* TAB 1: Staff Information */}
                    <TabsContent value="staff" className="space-y-4">
                        <div className="px-8 pb-8">
                            <Card className="bg-[#f7f7f7] shadow-sm border border-gray-200">
                                <CardContent className="p-0">
                                    {/* Table Header */}
                                    <div
                                        className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide items-center">
                                        <div className="col-span-5 ml-5">Staff Member</div>
                                        <div className="col-span-4">Phone Number</div>
                                        <div className="col-span-3">Role</div>
                                    </div>

                                    {/* Account Rows */}
                                    {staffs?.map(staff => (
                                        <div
                                            key={staff.staffId}
                                            className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 last:border-0 items-center hover:bg-[#eef3f5]"
                                        >
                                            <div className="col-span-5 flex items-center gap-3 ml-5">
                                                <Avatar className="w-10 h-10 mr-4">
                                                    {staff.avatarUrl ? (
                                                        <AvatarImage src={staff.avatarUrl} alt={staff.fullName} />
                                                    ) : (
                                                        <AvatarFallback className="bg-gray-300" />
                                                    )}
                                                </Avatar>

                                                <div>
                                                    <div className="font-medium text-sm text-gray-900">
                                                        {staff.fullName}
                                                    </div>
                                                    <div className="text-xs text-gray-500">{staff.email}</div>
                                                </div>
                                            </div>
                                            <div className="col-span-4 text-sm text-gray-600">
                                                {staff.phone}
                                            </div>
                                            <div className="col-span-3 text-sm text-gray-900 font-medium">
                                                <Badge className='text-white'>
                                                    {staff.role}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Footer with Pagination */}
                                    <div className="px-6 py-4 flex items-center justify-between text-sm text-gray-600">
                                        <div>
                                            Showing {totalItems === 0 ? 0 : startItem}–{Math.min((currentPage + 1) * pageSize, totalItems)} of {totalItems} results
                                        </div>

                                        <AccountsPagination
                                            handleNext={handleNext}
                                            handlePrev={handlePrev}
                                            handlePageChange={handlePageChange}
                                            page={currentPage + 1}
                                            totalPages={totalPages}
                                        />
                                    </div>

                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* TAB 2: Work Schedule */}
                    <TabsContent value="schedule" className="space-y-4">
                        <ScheduleXCalendar calendarApp={calendar} />
                    </TabsContent>

                    {/* TAB 3: Resources */}
                    <TabsContent value="resources" className="space-y-4">
                        {/* Upload Dropzone */}
                        <Card className="shadow-sm">
                            <CardContent className="p-8">
                                <div
                                    className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-[#7FA5A5] transition-colors cursor-pointer"
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                >
                                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-base font-medium text-gray-700 mb-2">
                                        Drop new resources here
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Support for PDF, DOCX, XLSX, JPG up to 10MB
                                    </p>
                                    <Button
                                        className="mt-4 bg-[#7FA5A5] hover:bg-[#6D9393] text-white"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        Click to Upload
                                    </Button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        multiple
                                        onChange={handleFileUpload}
                                        accept=".pdf, .docx, .xlsx, .jpg"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Files */}
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle>Recent Files</CardTitle>
                                <CardDescription>Manage and download event resources</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {uploadedFiles.map(file => (
                                        <div
                                            key={file.id}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="flex-shrink-0">{getFileIcon(file.type)}</div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {file.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Uploaded {file.uploadDate} • {file.size}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 ml-4">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                    onClick={() => handleFileDownload(file)}
                                                >
                                                    <Download className="h-4 w-4 text-gray-500" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                    onClick={() => handleFilePreview(file)}
                                                >
                                                    <Eye className="h-4 w-4 text-gray-500" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                    onClick={() => handleFileDelete(file.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                </Tabs>
            </main>

            {/* Global Alert */}
            <div className="fixed top-6 right-6 z-[999] w-[360px]">
                <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={closeAlert}
                />
            </div>

            {/* Create Schedule Modal */}
            <CreateScheduleModal
                eventId={id}
                isOpen={isScheduleModalOpen}
                onClose={closeScheduleModal}
                onCreated={handleScheduleCreated}
                onAlert={showAlert}
            />

            {/* Add Shift Modal */}
            {/* <AddShiftModal
                eventId={id}
                isOpen={isShiftModalOpen}
                onClose={closeShiftModal}
                onAlert={showAlert}
            /> */}
        </div>

    );
}