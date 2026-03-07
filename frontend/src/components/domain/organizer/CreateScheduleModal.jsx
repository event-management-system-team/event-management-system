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
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("Asia/Ho_Chi_Minh");

export function CreateScheduleModal({ eventId, isOpen, onClose, onCreated, onAlert }) {
    const [roles, setRoles] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedDate, setSelectedDate] = useState(null)
    const [timeRange, setTimeRange] = useState(null)

    const disabledDate = (current) => {
        return current && current < dayjs().startOf("day");
    };

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

    const [formData, setFormData] = useState({
        scheduleName: "",
        description: "",
        location: "",
        startTime: "",
        endTime: ""
    })

    const [selectedRoles, setSelectedRoles] = useState([])
    const [errors, setErrors] = useState({
        scheduleName: "",
        description: "",
        location: "",
        date: "",
        time: ""
    });

    const handleDateChange = (date) => {
        setSelectedDate(date)
        setTimeRange(null)

        setErrors((prev) => ({
            ...prev,
            date: !date ? "Date is required" : null,
        }));
    }

    const handleTimeChange = (times) => {
        if (!times || !selectedDate) return

        let startTime = selectedDate
            .hour(times[0].hour())
            .minute(times[0].minute())
            .second(0)

        let endTime = selectedDate
            .hour(times[1].hour())
            .minute(times[1].minute())
            .second(0)

        if (startTime.isSame(endTime)) {
            endTime = endTime.add(1, "minute");
        }

        setTimeRange([startTime, endTime])

        setFormData((prev) => ({
            ...prev,
            startTime,
            endTime,
        }))

        setErrors((prev) => ({
            ...prev,
            time: null,
        }));
    }

    const validateScheduleName = (scheduleName = "") => {
        const value = scheduleName.trim();
        if (!value) {
            return "Schedule name is required";
        } else if (value.length > 100) {
            return "Schedule name must be no more than 100 characters";
        }
        return null;
    }

    const validateDescription = (description = "") => {
        const value = description.trim();
        if (value.length > 255) {
            return "Description must be no more than 255 characters";
        }
        return null;
    }

    const validateLocation = (location = "") => {
        const value = location.trim();
        if (!value) {
            return "Location is required";
        } else if (value.length > 100) {
            return "Location must be no more than 100 characters";
        }
        return null;
    }

    const validateTime = (startTime, endTime) => {
        if (!startTime || !endTime) {
            return "Start time and end time are required"
        }

        if (startTime === endTime) {
            return "Start time and end time cannot be the same"
        }

        return null
    }

    const disabledRangeTime = (_, type) => {
        if (!selectedDate) return {};

        const now = dayjs();

        if (!selectedDate.isSame(now, "day")) {
            return {};
        }

        const currentHour = now.hour();
        const currentMinute = now.minute();

        if (type === "start") {
            return {
                disabledHours: () => [...Array(currentHour).keys()],
                disabledMinutes: (hour) =>
                    hour === currentHour ? [...Array(currentMinute).keys()] : [],
            };
        }

        return {
            disabledHours: () => [...Array(currentHour).keys()],
            disabledMinutes: (hour) =>
                hour === currentHour ? [...Array(currentMinute).keys()] : [],
        };
    }

    const validateField = async (fieldName) => {
        let error = null;

        switch (fieldName) {
            case "scheduleName":
                error = validateScheduleName(formData.scheduleName);
                break;

            case "description":
                error = validateDescription(formData.description);
                break;

            case "location":
                error = validateLocation(formData.location);
                break;

            case "time":
                error = validateTime(formData.startTime, formData.endTime);
                break;

            default:
                break;
        }

        setErrors((prev) => ({
            ...prev,
            [fieldName]: error,
        }));
    };

    const validateForm = async () => {
        const newErrors = {};

        const scheduleNameError = validateScheduleName(formData.scheduleName);
        if (scheduleNameError) newErrors.scheduleName = scheduleNameError;

        const descriptionError = validateDescription(formData.description);
        if (descriptionError) newErrors.description = descriptionError;

        const locationError = validateLocation(formData.location);
        if (locationError) newErrors.location = locationError;

        const timeError = validateTime(formData.startTime, formData.endTime);
        if (timeError) newErrors.time = timeError;

        setErrors({
            scheduleName: scheduleNameError || null,
            description: descriptionError || null,
            location: locationError || null,
            time: timeError || null,
        });
        return Object.keys(newErrors).length === 0;
    };

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

    const isFormValid =
        !!formData.scheduleName &&
        !!formData.location &&
        !!formData.startTime &&
        !!formData.endTime &&
        !errors.scheduleName &&
        !errors.description &&
        !errors.location &&
        !errors.time

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        const isValid = await validateForm();
        if (!isValid) {
            onAlert("error", "Please fix the validation errors before submitting");
            return;
        }

        try {
            setIsSubmitting(true)

            const data = {
                ...formData,
                startTime: formData.startTime.format("YYYY-MM-DDTHH:mm:ss"),
                endTime: formData.endTime.format("YYYY-MM-DDTHH:mm:ss"),
                staffRoles: selectedRoles
            }

            console.log("payload", data)
            const response = await organizerService.createSchedule(eventId, data)
            onAlert("success", "Created schedule successfully")

            onCreated(response.data);
            setTimeout(() => {
                onClose();
            }, 500);
        } catch (error) {
            const msg = error.response?.data?.message || "Failed to create schedule. Please try again";
            onAlert("error", msg)
        } finally {
            setIsSubmitting(false);
        }
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
                                    onChange={(e) => {
                                        const value = e.target.value;

                                        setFormData({ ...formData, scheduleName: value });

                                        const error = validateScheduleName(value);
                                        setErrors((prev) => ({
                                            ...prev,
                                            scheduleName: error,
                                        }));
                                    }}
                                    onBlur={() => validateField("scheduleName")}
                                    className={cn(
                                        "h-10",
                                        errors.scheduleName && "border-red-500"
                                    )}
                                />
                                {errors.scheduleName && (
                                    <p className="text-xs text-red-500 mt-1">{errors.scheduleName}</p>
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
                                    onChange={(e) => {
                                        const value = e.target.value;

                                        setFormData({ ...formData, description: value });

                                        const error = validateDescription(value);
                                        setErrors((prev) => ({
                                            ...prev,
                                            description: error,
                                        }));
                                    }}
                                    onBlur={() => validateField("description")}
                                    className="min-h-[80px] border border-gray-200"
                                />
                                {errors.description && (
                                    <p className="text-xs text-red-500 mt-1">{errors.description}</p>
                                )}
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
                                        onChange={(e) => {
                                            const value = e.target.value;

                                            setFormData({ ...formData, location: value });

                                            const error = validateLocation(value);
                                            setErrors((prev) => ({
                                                ...prev,
                                                location: error,
                                            }));
                                        }}
                                        onBlur={() => validateField("location")}
                                        className={cn(
                                            "h-10 pl-10",
                                            errors.location && "border-red-500"
                                        )}
                                    />
                                </div>
                                {errors.location && (
                                    <p className="text-xs text-red-500 mt-1">{errors.location}</p>
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

                                <Space vertical>
                                    <DatePicker
                                        onChange={handleDateChange}
                                        className="w-60 h-10"
                                        disabledDate={disabledDate}
                                    />
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
                                    <TimePicker.RangePicker
                                        prefix={<SmileOutlined />}
                                        className="w-80 h-10"
                                        disabledTime={disabledRangeTime}
                                        onChange={handleTimeChange}
                                        value={timeRange}
                                        format="HH:mm"
                                    />
                                </Space>

                                {errors.time && (
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.time}
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
                        onClick={handleSubmit}
                        disabled={!isFormValid}
                        className="px-6 bg-[#7FA5A5] hover:bg-[#6D9393] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Create Schedule
                    </Button>
                </div>
            </div>
        </div>
    )
}
