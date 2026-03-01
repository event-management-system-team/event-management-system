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
    Upload
} from 'lucide-react';
import { Link, useParams } from 'react-router';
import { useEffect, useMemo, useState } from "react";
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

export function StaffManagement() {

    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('staff');
    const [currentWeek, setCurrentWeek] = useState(dayjs());

    const [staffs, setStaffs] = useState([]);
    const [assignments, setAssignments] = useState([]);

    const weekDays = useMemo(
        () =>
            Array.from({ length: 7 }).map((_, i) =>
                currentWeek.startOf("week").add(i, "day")
            ),
        [currentWeek]
    );

    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [role, setRole] = useState("all");
    const [date, setDate] = useState(null);
    const [sortOption, setSortOption] = useState("newest");
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { alert, showAlert, closeAlert } = useAlert();
    const currentWeekStart = dayjs().startOf("week");

    const fetchStaffList = async () => {
        if (!id) return

        try {
            setLoading(true)
            const response = await organizerService.getEventStaff(id)
            setStaffs(response.data)
        } catch (error) {
            setError("Cannot load staff list");
            console.error(error)
        } finally {
            setLoading(false);
        }
    };

    const fetchShifts = async () => {
        if (!id) return

        try {
            setLoading(true)
            const response = await organizerService.getAssignment(id)
            setAssignments(response.data)
        } catch (error) {
            setError("Cannot load shifts list");
            console.error(error)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaffList()
        fetchShifts()
    }, [id]);

    const handleShiftClick = (shift, staff) => {
        setSelectedShift({ ...shift, staff })
        setIsEditShiftModalOpen(true)
    }

    const getTopRightAction = () => {
        switch (activeTab) {
            case "staff":
                return (
                    <div className="flex gap-3">
                        <Button variant="outline" className="gap-2">
                            <Download className="h-4 w-4" />
                            Export List
                        </Button>
                        <Button
                            className="gap-2 bg-[#F1F0E8] text-black"
                            onClick={() => setIsAddStaffModalOpen(true)}
                        >
                            <Plus className="h-4 w-4" />
                            Add Staff
                        </Button>
                    </div>
                )
            case "schedule":
                return (
                    <Button className="gap-2 bg-[#F1F0E8] text-black">
                        <Plus className="h-4 w-4" />
                        Add Shift
                    </Button>
                )
            case "resources":
                return (
                    <Button className="gap-2 bg-[#F1F0E8] text-black">
                        <Upload className="h-4 w-4" />
                        Upload New Resource
                    </Button>
                )
            default:
                return null
        }
    }

    const getShift = (staffId, day) => {
        const dateKey = day.format("YYYY-MM-DD");
        return assignments?.[staffId]?.[dateKey] || [];
    };

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

    // const pageSize = 10;
    // const startItem = currentPage * pageSize + 1;
    // const isSearching = searchTerm.trim().length > 0;

    // const totalItems = processedAccounts.length;
    // const totalPages = Math.max(
    //     1,
    //     Math.ceil(totalItems / pageSize)
    // );

    // useEffect(() => {
    //     if (currentPage > totalPages - 1) {
    //         setCurrentPage(0);
    //     }
    // }, [totalPages]);

    // const paginatedAccounts = processedAccounts.slice(
    //     currentPage * pageSize,
    //     (currentPage + 1) * pageSize
    // );

    // const handlePrev = () => {
    //     if (isSearching || currentPage === 0) return;
    //     setCurrentPage(prev => prev - 1);
    // };

    // const handleNext = () => {
    //     if (isSearching || currentPage >= totalPages - 1) return;
    //     setCurrentPage(prev => prev + 1);
    // };

    // const handlePageChange = (p) => {
    //     if (isSearching) return;
    //     setCurrentPage(p - 1);
    // };

    // const openModal = () => {
    //     setIsModalOpen(true);
    // };

    // const closeModal = () => {
    //     setIsModalOpen(false);
    // };

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
                            <Button
                                className="gap-2 bg-[#f7f7f7] hover:bg-[#B3C8CF] text-gray rounded-full px-5 py-5 h-12 w-32 border-1 border-gray-400"
                            // onClick={openModal}
                            >
                                <Download className="h-4 w-4" />
                                Export List
                            </Button>
                            <Button
                                className="gap-2 bg-primary hover:bg-[#B3C8CF] text-white rounded-full px-5 py-5 h-12 w-32"
                            // onClick={openModal}
                            >
                                <Plus className="h-4 w-4" />
                                Add Staff
                            </Button>
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
                        <Card className="shadow-sm">
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Staff Member
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Role
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Shifts Assigned
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {/* {staffMembers.map((staff) => (
                                                <tr key={staff.id} className="hover:bg-gray-50 cursor-pointer transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="w-10 h-10">
                                                                <AvatarFallback className={`${staff.avatarBg} text-white`}>
                                                                    {staff.avatar}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <div className="font-medium text-gray-900">{staff.name}</div>
                                                                <div className="text-sm text-gray-500">{staff.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <Badge className={`${staff.roleBg} hover:${staff.roleBg}`}>
                                                            {staff.role}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{staff.shiftsAssigned} shifts</div>
                                                        <div className="text-xs text-gray-500">Next: {staff.nextShift}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <Badge
                                                            variant={staff.statusVariant}
                                                            className={
                                                                staff.status === 'Active'
                                                                    ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                                                    : staff.status === 'On Break'
                                                                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                                                                        : 'bg-red-100 text-red-700 hover:bg-red-100'
                                                            }
                                                        >
                                                            {staff.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                <MessageSquare className="h-4 w-4 text-gray-500" />
                                                            </Button>
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                <Edit className="h-4 w-4 text-gray-500" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))} */}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pagination */}
                        <div className="flex items-center justify-between px-4">
                            <p className="text-sm text-gray-500">
                                {/* Showing <span className="font-medium">1-5</span> of <span className="font-medium">{eventData.activeStaffCount}</span> staff members */}
                            </p>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">Previous</Button>
                                <Button variant="outline" size="sm" className="bg-[#7FA5A5] text-white hover:bg-[#6D9393] hover:text-white">1</Button>
                                <Button variant="outline" size="sm">2</Button>
                                <Button variant="outline" size="sm">Next</Button>
                            </div>
                        </div>
                    </TabsContent>

                    {/* TAB 2: Work Schedule */}
                    <TabsContent value="schedule" className="space-y-4">


                        {/* Calendar */}
                        <div className=" bg-white rounded-xl shadow p-2 justify-end">
                            <DatePicker
                                picker="week"
                                value={currentWeek}
                                onChange={(date) => date && setCurrentWeek(date)}
                                className="w-[220px]"
                            />
                        </div>

                        {/* Schedule Table */}
                        <div className="flex-1 overflow-x-auto">
                            <table className="w-full table-fixed border-separate border-spacing-0 px-5 bg-[#f7f7f7]">
                                <thead>
                                    <tr>
                                        <th className="w-56 px-4 py-8 text-left text-sm font-semibold text-gray-600 border-b">
                                            Staff Member
                                        </th>
                                        {weekDays.map((d) => (
                                            <th
                                                key={d.format("YYYY-MM-DD")}
                                                className="px-4 py-3 text-sm font-semibold text-gray-600 border-b"
                                            >
                                                <div className="text-xs uppercase text-gray-400">
                                                    {d.format("ddd")}
                                                </div>
                                                <div>{d.format("DD")}</div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {staffs?.map((staff) => (
                                        <tr key={staff.userId} className="hover:bg-gray-50">
                                            <td className="px-4 py-5 border-b border-gray-300">
                                                <div className="font-medium">{staff.fullName}</div>
                                                <div className="text-xs text-gray-400">{staff.positionName}</div>
                                            </td>

                                            {weekDays.map((d) => {
                                                const shifts = getShift(staff.userId, d);

                                                return (
                                                    <td
                                                        key={d.toString()}
                                                        className="px-3 py-2 border-b border-gray-300 align-top"
                                                    >
                                                        {shifts.map((shift) => (
                                                            <div
                                                                key={shift.assignmentId}
                                                                className={`text-white rounded-xl p-2 text-xs shadow-sm mb-1 ${getStatusColor(shift.status)}`}
                                                            >
                                                                <div className="font-semibold">
                                                                    {dayjs(shift.startTime).format("HH:mm")} –{" "}
                                                                    {dayjs(shift.endTime).format("HH:mm")}
                                                                </div>

                                                                <div className="opacity-90">
                                                                    {shift.scheduleName}
                                                                </div>

                                                                <div className="text-[10px] opacity-75">
                                                                    {shift.location}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* <Calendar
                            fullscreen={false}

                            dateFullCellRender={(date) => {
                                if (date.isSame(currentWeekStart, "week")) {
                                    return <div>{date.format("DD")}</div>;
                                }
                                return null;
                            }}
                        /> */}

                        {/* <Calendar />

                        <Calendar fullscreen={false} showWeek /> */}
                    </TabsContent>

                    {/* TAB 3: Resources */}
                    <TabsContent value="resources" className="space-y-4">
                        {/* Upload Dropzone */}
                        <Card className="shadow-sm">
                            <CardContent className="p-8">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-[#7FA5A5] transition-colors cursor-pointer">
                                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-base font-medium text-gray-700 mb-2">Drop new resources here</p>
                                    <p className="text-sm text-gray-500">Support for PDF, DOCX, XLSX, JPG up to 20MB</p>
                                    <Button className="mt-4 bg-[#7FA5A5] hover:bg-[#6D9393] text-white">
                                        Click to Upload
                                    </Button>
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
                                    {/* {resources.map((file) => (
                                        <div
                                            key={file.id}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="flex-shrink-0">{getFileIcon(file.type)}</div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                                    <p className="text-xs text-gray-500">
                                                        Uploaded {file.uploadDate} • {file.size}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 ml-4">
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <Download className="h-4 w-4 text-gray-500" />
                                                </Button>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))} */}
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
        </div>

    );
}