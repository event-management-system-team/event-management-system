import {X, AlertCircle} from "lucide-react"
import {Button} from "./Button.jsx"
import {Input} from "./Input.jsx"
import {Label} from "./Label.jsx"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "./Select.jsx"
import {Badge} from "./Badge.jsx"
import {useState} from "react"
import {cn} from "./utils.js"
import {adminService} from "../../../services/admin.service.js";

export function EditAccountModal({isOpen, onClose, accountData, onSuccess}) {
    const [formData, setFormData] = useState({
        fullName: accountData.fullName || "",
        email: accountData.email || "",
        phone: accountData.phone || "",
    })

    const [errors, setErrors] = useState({})
    const isOrganizer = accountData.role === "ORGANIZER"

    const handleUpdateProfile = async () => {
        try {
            const res = await adminService.updateProfile(accountData.id, formData);
            alert("Profile updated successfully");

            if (onSuccess) {
                onSuccess(res.data);
            }

            onClose();
        } catch (error) {
            console.error(error)

            const message = error?.response?.data?.message || "Update profile failed"

            if (message.toLowerCase().includes("email")) {
                setErrors(prev => ({...prev, email: message}))
            } else {
                alert(message)
            }
        }
    }

    const handleInputChange = (field, value) => {
        setFormData({...formData, [field]: value})
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors({...errors, [field]: ""})
        }
    }

    const validateForm = () => {
        const newErrors = {}

        // Full name
        const fullName = formData.fullName.trim()
        if (!fullName) {
            newErrors.fullName = "Full name is required"
        } else if (fullName.length < 3) {
            newErrors.fullName = "Full name must be at least 3 characters"
        } else if (fullName.length > 50) {
            newErrors.fullName = "Full name must be less than 50 characters"
        } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(fullName)) {
            newErrors.fullName = "Full name cannot contain numbers or special characters"
        }

        // Email
        const email = formData.email.trim()
        if (!email) {
            newErrors.email = "Email is required"
        } else if (email.length > 100) {
            newErrors.email = "Email is too long"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
            newErrors.email = "Please enter a valid email address"
        }

        // Phone (VN)
        const phone = formData.phone.trim()
        if (!phone) {
            newErrors.phone = "Phone number is required"
        } else if (!/^(?!00)\d{10}$/.test(phone)) {
            newErrors.phone = "Phone number must be 10 digits and not start with 00"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSave = () => {
        if (!validateForm()) return;
         if (!hasChanges()) {
             alert("No changes detected");
             return;
         }
         handleUpdateProfile();
    }

    const hasChanges = () => {
        return (
            formData.fullName !== accountData.fullName ||
            formData.email !== accountData.email ||
            formData.phone !== (accountData.phone || "")
        )
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose}/>

            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div
                    className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-start justify-between z-10">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Edit Account Profile
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Update account information
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500"/>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-4">
                            {isOrganizer ? "Organization Information" : "Personal Information"}
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <Label
                                    htmlFor="fullName"
                                    className="text-sm font-medium text-gray-700 mb-1.5 block"
                                >
                                    {isOrganizer ? "Organization Name " : "Full Name "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="fullName"
                                    type="text"
                                    placeholder="e.g. John Doe"
                                    value={formData.fullName}
                                    onChange={e =>
                                        handleInputChange("fullName", e.target.value)
                                    }
                                    className={cn(
                                        "h-10",
                                        errors.fullName && "border-red-500"
                                    )}
                                />
                                {errors.fullName && (
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3"/>
                                        {errors.fullName}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-medium text-gray-700 mb-1.5 block"
                                >
                                    Email Address <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={e => handleInputChange("email", e.target.value)}
                                    className={cn("h-10", errors.email && "border-red-500")}
                                />
                                {errors.email && (
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3"/>
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label
                                    htmlFor="phone"
                                    className="text-sm font-medium text-gray-700 mb-1.5 block"
                                >
                                    Phone Number
                                </Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="0912345678"
                                    value={formData.phone}
                                    onChange={e => handleInputChange("phone", e.target.value)}
                                    className="h-10"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div
                        className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                        <Button variant="outline" onClick={onClose} className="px-6">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={Object.keys(errors).length > 0 || !hasChanges()}
                            className="px-6 bg-[#7FA5A5] hover:bg-[#6D9393] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Save Changes
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
