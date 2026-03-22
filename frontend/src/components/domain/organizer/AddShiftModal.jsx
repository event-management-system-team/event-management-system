import {
    X,
    AlertCircle,
    Calendar,
    Clock,
    MapPin,
    Users,
    Info
} from "lucide-react"
import { Button } from "../admin/Button"
import { Input } from "../admin/Input"
import { Label } from "../admin/Label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "../admin/Select"
import { Checkbox } from "../admin/Checkbox"
import { useState } from "react"
import { cn } from "../admin/utils"
// import { toast } from "sonner@2.0.3"

const schedules = [
    {
        id: 1,
        name: "Morning Setup Crew",
        date: "May 20, 2026",
        startTime: "08:00",
        endTime: "12:00",
        location: "Main Entrance",
        assignedRoles: [1, 3] // Security and Registration already assigned
    },
    {
        id: 2,
        name: "Event Registration",
        date: "May 20, 2026",
        startTime: "14:00",
        endTime: "18:00",
        location: "Registration Desk",
        assignedRoles: [3, 2] // Registration and VIP Host already assigned
    },
    {
        id: 3,
        name: "Security Evening Shift",
        date: "May 21, 2026",
        startTime: "18:00",
        endTime: "23:00",
        location: "All Areas",
        assignedRoles: [1] // Only Security assigned
    },
    {
        id: 4,
        name: "VIP Guest Services",
        date: "May 21, 2026",
        startTime: "10:00",
        endTime: "16:00",
        location: "VIP Lounge",
        assignedRoles: [] // No roles assigned yet
    }
]

const availableRoles = [
    {
        id: 1,
        name: "Security",
        staffCount: 8
    },
    {
        id: 2,
        name: "VIP Host",
        staffCount: 4
    },
    {
        id: 3,
        name: "Registration",
        staffCount: 6
    },
    {
        id: 4,
        name: "Technical Support",
        staffCount: 5
    },
    {
        id: 5,
        name: "Catering Staff",
        staffCount: 10
    },
    {
        id: 6,
        name: "Cleaning Crew",
        staffCount: 7
    }
]

export function AddShiftModal({ eventId, isOpen, onClose, onAlert }) {
    const [schedules, setSchedules] = useState([])
    const [selectedScheduleId, setSelectedScheduleId] = useState("")
    const [selectedRoles, setSelectedRoles] = useState([])
    const [errors, setErrors] = useState({})

    // const fetchScheduleList = () => {

    // }

    const selectedSchedule = schedules.find(
        s => s.id === parseInt(selectedScheduleId)
    )

    const handleScheduleChange = value => {
        setSelectedScheduleId(value)
        const schedule = schedules.find(s => s.id === parseInt(value))

        // Auto-select already assigned roles
        if (schedule) {
            setSelectedRoles(schedule.assignedRoles)
        }

        // Clear error
        if (errors.scheduleId) {
            setErrors({ ...errors, scheduleId: "" })
        }
    }

    const handleRoleToggle = roleId => {
        // Check if role is already assigned (disabled)
        if (selectedSchedule?.assignedRoles.includes(roleId)) {
            return // Cannot toggle already assigned roles
        }

        if (selectedRoles.includes(roleId)) {
            setSelectedRoles(selectedRoles.filter(id => id !== roleId))
        } else {
            setSelectedRoles([...selectedRoles, roleId])
        }
    }

    const handleSelectAllRoles = () => {
        if (!selectedSchedule) return

        const alreadyAssignedRoles = selectedSchedule.assignedRoles
        const selectableRoles = availableRoles
            .filter(role => !alreadyAssignedRoles.includes(role.id))
            .map(role => role.id)

        const allSelectableSelected = selectableRoles.every(roleId =>
            selectedRoles.includes(roleId)
        )

        if (allSelectableSelected) {
            // Unselect all selectable roles, keep already assigned ones
            setSelectedRoles(alreadyAssignedRoles)
        } else {
            // Select all roles (both already assigned and selectable)
            setSelectedRoles([...alreadyAssignedRoles, ...selectableRoles])
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!selectedScheduleId) {
            newErrors.scheduleId = "Please select a schedule"
        }

        // At least one role must be selected
        if (selectedRoles.length === 0) {
            newErrors.roles = "Please select at least one role"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSave = () => {
        if (validateForm()) {
            const selectedRoleNames = availableRoles
                .filter(role => selectedRoles.includes(role.id))
                .map(role => role.name)

            console.log("Adding shift:", {
                scheduleId: selectedScheduleId,
                scheduleName: selectedSchedule?.name,
                assignedRoles: selectedRoleNames
            })

            // toast.success("Shift saved successfully", {
            //     description: `Roles have been assigned to ${selectedSchedule?.name}`
            // })

            onClose()
            // Reset form
            setSelectedScheduleId("")
            setSelectedRoles([])
            setErrors({})
        }
    }

    const isFormValid = () => {
        return selectedScheduleId && selectedRoles.length > 0
    }

    if (!isOpen) return null

    const alreadyAssignedRoles = selectedSchedule?.assignedRoles || []
    const selectableRoles = availableRoles.filter(
        role => !alreadyAssignedRoles.includes(role.id)
    )
    const isAllSelectableSelected = selectableRoles.every(role =>
        selectedRoles.includes(role.id)
    )

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-start justify-between z-10">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Add Shift</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Assign staff roles to an existing schedule
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
                    {/* Section 1: Select Schedule */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-base font-semibold text-gray-900 mb-4">
                            Select Schedule
                        </h3>
                        <div>
                            <Label
                                htmlFor="scheduleId"
                                className="text-sm font-medium text-gray-700 mb-1.5 block"
                            >
                                Choose Schedule <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={selectedScheduleId}
                                onValueChange={handleScheduleChange}
                            >
                                <SelectTrigger
                                    className={cn("h-10", errors.scheduleId && "border-red-500")}
                                >
                                    <SelectValue placeholder="Select a schedule" />
                                </SelectTrigger>
                                <SelectContent>
                                    {schedules.map(schedule => (
                                        <SelectItem
                                            key={schedule.id}
                                            value={schedule.id.toString()}
                                        >
                                            <div className="flex flex-col py-1">
                                                <span className="font-medium">{schedule.name}</span>
                                                <span className="text-xs text-gray-500">
                                                    {schedule.date} • {schedule.startTime} –{" "}
                                                    {schedule.endTime} • {schedule.location}
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.scheduleId && (
                                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.scheduleId}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Schedule Information (Auto Display) */}
                    {selectedSchedule && (
                        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Info className="h-5 w-5 text-blue-600" />
                                Schedule Information
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                                        Date
                                    </Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            type="text"
                                            value={selectedSchedule.date}
                                            disabled
                                            className="h-10 pl-10 bg-gray-100 text-gray-600 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                                        Location
                                    </Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            type="text"
                                            value={selectedSchedule.location}
                                            disabled
                                            className="h-10 pl-10 bg-gray-100 text-gray-600 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                                        Start Time
                                    </Label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            type="text"
                                            value={selectedSchedule.startTime}
                                            disabled
                                            className="h-10 pl-10 bg-gray-100 text-gray-600 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                                        End Time
                                    </Label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            type="text"
                                            value={selectedSchedule.endTime}
                                            disabled
                                            className="h-10 pl-10 bg-gray-100 text-gray-600 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Section 2: Assign Staff Roles */}
                    {selectedSchedule && (
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
                                            role{selectedRoles.length !== 1 ? "s" : ""} assigned
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
                                                        checked={isAllSelectableSelected}
                                                        onCheckedChange={handleSelectAllRoles}
                                                    />
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Role Name
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Staff Count
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {availableRoles.map(role => {
                                                const isSelected = selectedRoles.includes(role.id)
                                                const isAlreadyAssigned = alreadyAssignedRoles.includes(
                                                    role.id
                                                )

                                                return (
                                                    <tr
                                                        key={role.id}
                                                        onClick={() =>
                                                            !isAlreadyAssigned && handleRoleToggle(role.id)
                                                        }
                                                        className={cn(
                                                            "transition-colors",
                                                            !isAlreadyAssigned &&
                                                            "hover:bg-gray-50 cursor-pointer",
                                                            isAlreadyAssigned &&
                                                            "bg-gray-50/50 cursor-not-allowed"
                                                        )}
                                                    >
                                                        <td className="px-4 py-3">
                                                            <div className="relative group">
                                                                <Checkbox
                                                                    checked={isSelected}
                                                                    onCheckedChange={() =>
                                                                        handleRoleToggle(role.id)
                                                                    }
                                                                    disabled={isAlreadyAssigned}
                                                                />
                                                                {isAlreadyAssigned && (
                                                                    <div className="absolute left-0 top-full mt-1 hidden group-hover:block z-10">
                                                                        <div className="bg-gray-900 text-white text-xs rounded py-1.5 px-3 whitespace-nowrap shadow-lg">
                                                                            This role has already been assigned and
                                                                            cannot be removed
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-2">
                                                                <Users
                                                                    className={cn(
                                                                        "h-4 w-4",
                                                                        isAlreadyAssigned
                                                                            ? "text-gray-300"
                                                                            : "text-gray-400"
                                                                    )}
                                                                />
                                                                <span
                                                                    className={cn(
                                                                        "text-sm font-medium",
                                                                        isAlreadyAssigned
                                                                            ? "text-gray-400"
                                                                            : "text-gray-900"
                                                                    )}
                                                                >
                                                                    {role.name}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span
                                                                className={cn(
                                                                    "text-sm",
                                                                    isAlreadyAssigned
                                                                        ? "text-gray-400"
                                                                        : "text-gray-600"
                                                                )}
                                                            >
                                                                {role.staffCount} staff
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            {isAlreadyAssigned ? (
                                                                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                                    Already Assigned
                                                                </span>
                                                            ) : (
                                                                <span className="text-xs text-gray-500">
                                                                    Available
                                                                </span>
                                                            )}
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
                                    <p>Select at least one role to save this shift.</p>
                                </div>
                            )}
                            {alreadyAssignedRoles.length > 0 && (
                                <div className="mt-3 flex items-start gap-2 text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    <p>
                                        Roles marked as "Already Assigned" were previously added to
                                        this schedule and cannot be removed.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* No Schedule Selected Message */}
                    {!selectedSchedule && (
                        <div className="bg-gray-50 rounded-lg p-12 text-center border-2 border-dashed border-gray-300">
                            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-sm font-medium text-gray-700 mb-1">
                                No Schedule Selected
                            </p>
                            <p className="text-xs text-gray-500">
                                Please select a schedule above to assign roles
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
                    <Button variant="outline" onClick={onClose} className="px-6">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!isFormValid()}
                        className="px-6 bg-[#7FA5A5] hover:bg-[#6D9393] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Save Shift
                    </Button>
                </div>
            </div>
        </div>
    )
}
