import {
    X,
    Eye,
    EyeOff,
} from 'lucide-react';
import {Button} from './Button.jsx';
import {Input} from './Input.jsx';
import {Label} from './Label.jsx';
import {useState} from 'react';
import {adminService} from "../../../services/admin.service.js";

export function CreateOrganizerModal({isOpen, onClose, onCreated, onAlert}) {
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: ""
    })

    const [errors, setErrors] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
    });

    const validateFullName = (fullName = "") => {
        const value = fullName.trim();
        if (!value) {
            return "Organization name is required";
        } else if (value.length > 50) {
            return "Organization name must be no more than 50 characters";
        } else if (!/^[A-Za-z\s]+$/.test(value)) {
           return "Organization name can only contain letters";
        }
        return null;
    }

    const validateEmail = async (email = "") => {
        if (!email) {
            return "Email is required";
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            return "Invalid email format";
        }

            try {
                const response = await adminService.checkEmailAvailability(email);
                if (response.data === true) {
                    return "Email already exists";
                }
            } catch (error) {
                console.error("Error checking email:", error);
            }

        return null;
    }

    const validatePhone = (phoneNumber ="") => {
        const phone = phoneNumber.trim();

        if (!phone) {
            return null;
        } else if (/\D/.test(phone) && phone.charAt(0) !== "+") {
            return "Phone number must contain only digits";
        } else if (phone.charAt(0) !== "0") {
            return "Phone number must start with 0";
        } else if (phone.length !== 10) {
            return "Phone number must be 10 digits long"
        } else if (phone.charAt(0) === "0" && phone.charAt(1) === "0") {
            return "Phone number cannot start with 00";
        }
        return null;
    }

    const validatePassword = (password = "") => {
        const pw = password.trim();
        if (!pw) {
            return "Password is required";
        } else if (pw.length < 8) {
            return "Password must be at least 8 characters long";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/.test(pw)) {
            return "Password must include uppercase, lowercase, number and special character";
        }
        return null;
    }

    const validateField = async (fieldName) => {
        let error = null;

        switch (fieldName) {
            case "email":
                error = await validateEmail(formData.email);
                break;

            case "password":
                error = validatePassword(formData.password);
                break;

            case "phone":
                error = validatePhone(formData.phone);
                break;

            case "fullName":
                error = validateFullName(formData.fullName);
                break;

            default:
                break;
        }

        setErrors((prev) => ({
            ...prev,
            [fieldName]: error,
        }));
    };

    const validateStep1 = async () => {
        const newErrors = {};

        const fullNameError = validateFullName(formData.fullName);
        if (fullNameError) newErrors.fullName = fullNameError;

        const emailError = await validateEmail(formData.email);
        if (emailError) newErrors.email = emailError;

        const phoneError = validatePhone(formData.phone);
        if (phoneError) newErrors.phone = phoneError;

        const passwordError = validatePassword(formData.password);
        if (passwordError) newErrors.password = passwordError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isStep1Valid =
        !!formData.fullName &&
        !!formData.email &&
        !!formData.password &&
        !errors.fullName &&
        !errors.email &&
        !errors.phone &&
        !errors.password;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        const isValid = await validateStep1();
        if (!isValid) {
            onAlert({
                type: "error",
                message: "Please fix the validation errors before submitting"
            });
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await adminService.createOrganizer(formData);
            onAlert("success", "Created organizer successfully");

            onCreated(response.data);
            setTimeout(() => {
                onClose();
            }, 500);
        } catch (error) {
            const msg = error.response?.data?.message || "Failed to create organizer account. Please try again";
            onAlert("error", msg);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose}/>

            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
                >
                    <X className="h-5 w-5 text-gray-500"/>
                </button>

                {/* Modal Content */}
                <div className="p-8">
                        <div>
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                                    General Information
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Please provide the primary contact details for this organizer account.
                                </p>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <Label htmlFor="fullName"
                                           className="text-sm font-medium text-gray-700 mb-1.5 block">
                                        Organization Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="fullName"
                                        type="text"
                                        placeholder="e.g. Vie Channel Ent."
                                        value={formData.fullName}
                                        onChange={(e) => {
                                            const value = e.target.value;

                                            setFormData({ ...formData, fullName: value });

                                            const error = validateFullName(value);
                                            setErrors((prev) => ({
                                                ...prev,
                                                fullName: error,
                                            }));
                                        }}
                                        onBlur={() => validateField("fullName")}
                                        className="h-10"
                                    />
                                    {errors.fullName && (
                                        <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1.5 block">
                                        Email Address <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@company.com"
                                        value={formData.email}
                                        onChange={(e) => {
                                            const value = e.target.value;

                                            setFormData({ ...formData, email: value });

                                            const error = validateEmail(value);
                                            setErrors((prev) => ({
                                                ...prev,
                                                email: error,
                                            }));
                                        }}
                                        onBlur={() => validateField("email")}
                                        className="h-10"
                                    />
                                    {errors.email && (
                                        <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-1.5 block">
                                        Phone Number
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="0123456789"
                                        value={formData.phone}
                                        onChange={(e) => {
                                            const value = e.target.value;

                                            setFormData({ ...formData, phone: value });

                                            const error = validatePhone(value);
                                            setErrors((prev) => ({
                                                ...prev,
                                                phone: error,
                                            }));
                                        }}
                                        onBlur={() => validateField("phone")}
                                        className="h-10"
                                    />
                                    {errors.phone && (
                                        <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="password"
                                           className="text-sm font-medium text-gray-700 mb-1.5 block">
                                        Password <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Min. 8 characters"
                                            value={formData.password}
                                            onChange={(e) => {
                                                const value = e.target.value;

                                                setFormData({ ...formData, password: value });

                                                const error = validatePassword(value);
                                                setErrors((prev) => ({
                                                    ...prev,
                                                    password: error,
                                                }));
                                            }}
                                            onBlur={() => validateField("password")}
                                            className="h-10 pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4"/>
                                            ) : (
                                                <Eye className="h-4 w-4"/>
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="px-6"
                        >
                            Cancel
                        </Button>

                        <div className="flex gap-2">
                                <Button
                                    onClick={handleSubmit}
                                    className="px-6 bg-[#7FA5A5] hover:bg-[#6D9393] text-white"
                                    disabled={!isStep1Valid}
                                >
                                    Create Account
                                </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
