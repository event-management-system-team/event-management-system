import { X, AlertCircle, Calendar, Clock, MapPin, Users } from "lucide-react"
import { Button } from "../admin/Button"
import { Input } from "../admin/Input"
import { Label } from "../admin/Label"
import { Textarea } from "../admin/Textarea"
import { Checkbox } from "../admin/Checkbox"
import { useEffect, useState } from "react"
import { cn } from "../admin/utils"
import { organizerService } from "../../../services/organizer.service"
import { SmileOutlined } from '@ant-design/icons';
import { Space, TimePicker, DatePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const availableRoles = [
    {
        id: 1,
        name: "Security",
        staffCount: 8,
        description: "Responsible for venue security and access control"
    },
    {
        id: 2,
        name: "VIP Host",
        staffCount: 4,
        description: "Manage VIP guest services and hospitality"
    },
    {
        id: 3,
        name: "Registration",
        staffCount: 6,
        description: "Handle attendee check-in and registration"
    },
    {
        id: 4,
        name: "Technical Support",
        staffCount: 5,
        description: "Provide technical assistance and equipment management"
    },
    {
        id: 5,
        name: "Catering Staff",
        staffCount: 10,
        description: "Food and beverage service"
    },
    {
        id: 6,
        name: "Cleaning Crew",
        staffCount: 7,
        description: "Maintain venue cleanliness"
    }
]

export function CreateScheduleModal({ eventId, isOpen, onClose, onAlert }) {
    const [roles, setRoles] = useState([])

    const fetchRoleList = async () => {
        try {
            const response = await organizerService.getRoleStats(eventId)
            setRoles(response.data)
        } catch (error) {
            // setError("Cannot load staff list");
            console.error(error)
        }
    }

    useEffect(() => {
        fetchRoleList()
    }, [])

    const onChange = (time, timeString) => {
        console.log(time, timeString);
    };

    const [formData, setFormData] = useState({
        scheduleName: "",
        description: "",
        location: "",
        date: "",
        startTime: "",
        endTime: ""
    })

    const [selectedRoles, setSelectedRoles] = useState([])
    const [errors, setErrors] = useState({})

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value })
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors({ ...errors, [field]: "" })
        }
    }

    const handleRoleToggle = roleId => {
        if (selectedRoles.includes(roleId)) {
            setSelectedRoles(selectedRoles.filter(id => id !== roleId))
        } else {
            setSelectedRoles([...selectedRoles, roleId])
        }
    }

    const handleSelectAllRoles = () => {
        if (selectedRoles.length === roles.length) {
            setSelectedRoles([])
        } else {
            setSelectedRoles(roles.map(role => role.role))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        // Basic validation
        if (!formData.scheduleName.trim()) {
            newErrors.scheduleName = "Schedule name is required"
        }
        if (!formData.location.trim()) {
            newErrors.location = "Location is required"
        }
        if (!formData.date.trim()) {
            newErrors.date = "Date is required"
        }
        if (!formData.startTime.trim()) {
            newErrors.startTime = "Start time is required"
        }
        if (!formData.endTime.trim()) {
            newErrors.endTime = "End time is required"
        }

        // Time validation
        if (formData.startTime && formData.endTime) {
            const [startHour, startMin] = formData.startTime.split(":").map(Number)
            const [endHour, endMin] = formData.endTime.split(":").map(Number)

            if (
                endHour < startHour ||
                (endHour === startHour && endMin <= startMin)
            ) {
                newErrors.endTime = "End time must be later than start time"
            }
        }

        // Role validation
        if (selectedRoles.length === 0) {
            newErrors.roles = "Please select at least one role"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleCreate = () => {
        if (validateForm()) {
            const selectedRoleNames = availableRoles
                .filter(role => selectedRoles.includes(role.id))
                .map(role => role.name)

            console.log("Creating schedule:", {
                ...formData,
                assignedRoles: selectedRoleNames
            })

            // toast.success("Schedule created successfully", {
            //     description: `${formData.scheduleName} has been added to the event`
            // })

            onClose()
            // Reset form
            setFormData({
                scheduleName: "",
                description: "",
                location: "",
                date: "",
                startTime: "",
                endTime: ""
            })
            setSelectedRoles([])
            setErrors({})
        }
    }

    const isFormValid = () => {
        return (
            formData.scheduleName.trim() &&
            formData.location.trim() &&
            formData.date.trim() &&
            formData.startTime.trim() &&
            formData.endTime.trim() &&
            selectedRoles.length > 0
        )
    }

    if (!isOpen) return null

    const isAllRolesSelected = selectedRoles.length === roles.length

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-start justify-between z-10">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Create Schedule
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Create a new schedule block for this event
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Section 1: Schedule Information */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-base font-semibold text-gray-900 mb-4">
                            Schedule Information
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <Label
                                    htmlFor="scheduleName"
                                    className="text-sm font-medium text-gray-700 mb-1.5 block"
                                >
                                    Schedule Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="scheduleName"
                                    type="text"
                                    placeholder="e.g. Morning Setup Crew"
                                    value={formData.scheduleName}
                                    onChange={e =>
                                        handleInputChange("scheduleName", e.target.value)
                                    }
                                    className={cn(
                                        "h-10",
                                        errors.scheduleName && "border-red-500"
                                    )}
                                />
                                {errors.scheduleName && (
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.scheduleName}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label
                                    htmlFor="description"
                                    className="text-sm font-medium text-gray-700 mb-1.5 block"
                                >
                                    Description
                                </Label>
                                <Textarea
                                    id="description"
                                    placeholder="Optional description of this schedule"
                                    value={formData.description}
                                    onChange={e =>
                                        handleInputChange("description", e.target.value)
                                    }
                                    className="min-h-[80px] border border-gray-200"
                                />
                            </div>

                            <div>
                                <Label
                                    htmlFor="location"
                                    className="text-sm font-medium text-gray-700 mb-1.5 block"
                                >
                                    Location <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="location"
                                        type="text"
                                        placeholder="e.g. Main Entrance"
                                        value={formData.location}
                                        onChange={e =>
                                            handleInputChange("location", e.target.value)
                                        }
                                        className={cn(
                                            "h-10 pl-10",
                                            errors.location && "border-red-500"
                                        )}
                                    />
                                </div>
                                {errors.location && (
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.location}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Date & Time Selection */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-base font-semibold text-gray-900 mb-4">
                            Date & Time Selection
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            <div>
                                <Label
                                    htmlFor="date"
                                    className="text-sm font-medium text-gray-700 mb-1.5 block"
                                >
                                    Select Date <span className="text-red-500">*</span>
                                </Label>
                                {/* <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="date"
                                        type="date"
                                        value={formData.date}
                                        onChange={e => handleInputChange("date", e.target.value)}
                                        className={cn(
                                            "h-10 pl-10",
                                            errors.date && "border-red-500"
                                        )}
                                    />
                                </div> */}

                                <Space vertical>
                                    <DatePicker onChange={onChange} className="w-60 h-10" />
                                </Space>

                                {errors.date && (
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.date}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label
                                    htmlFor="startTime"
                                    className="text-sm font-medium text-gray-700 mb-1.5 block"
                                >
                                    Start Time - End Time <span className="text-red-500">*</span>
                                </Label>

                                <Space vertical size={12}>
                                    <TimePicker.RangePicker prefix={<SmileOutlined />} className="w-80 h-10" />
                                </Space>

                                {/* <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="startTime"
                                            type="time"
                                            value={formData.startTime}
                                            onChange={e =>
                                                handleInputChange("startTime", e.target.value)
                                            }
                                            className={cn(
                                                "h-10 pl-10",
                                                errors.startTime && "border-red-500"
                                            )}
                                        />
                                    </div> */}
                                {errors.startTime && (
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.startTime}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Assign Staff Roles */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-semibold text-gray-900">
                                Assign Staff Roles
                            </h3>
                            {selectedRoles.length > 0 && (
                                <div className="text-sm">
                                    <span className="font-medium text-[#7FA5A5]">
                                        {selectedRoles.length}
                                    </span>
                                    <span className="text-gray-500 ml-1">
                                        role{selectedRoles.length !== 1 ? "s" : ""} selected
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <div className="max-h-[280px] overflow-y-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-12">
                                                <Checkbox
                                                    checked={isAllRolesSelected}
                                                    onCheckedChange={handleSelectAllRoles}
                                                />
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Role Name
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Staff Count
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {roles?.map(role => {
                                            const isSelected = selectedRoles.includes(role.role)

                                            return (
                                                <tr
                                                    key={role.role}
                                                    onClick={() => handleRoleToggle(role.role)}
                                                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                                                >
                                                    <td className="px-4 py-3">
                                                        <Checkbox
                                                            checked={isSelected}
                                                            onCheckedChange={() => handleRoleToggle(role.role)}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <Users className="h-4 w-4 text-gray-400" />
                                                            <span className="text-sm font-medium text-gray-900">
                                                                {role.role}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="text-sm text-gray-600">
                                                            {role.staffCount} staff
                                                        </span>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Helper Text */}
                        {selectedRoles.length === 0 && (
                            <div className="mt-3 flex items-start gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
                                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <p>Select at least one role to create this schedule.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
                    <Button variant="outline" onClick={onClose} className="px-6">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreate}
                        disabled={!isFormValid()}
                        className="px-6 bg-[#7FA5A5] hover:bg-[#6D9393] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Create Schedule
                    </Button>
                </div>
            </div>
        </div>
    )
}
