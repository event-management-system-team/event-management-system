import {
    CheckCircle,
    X,
    Upload,
    FileText,
    Trash2,
    Eye,
    EyeOff,
} from 'lucide-react';
import {Button} from './Button.jsx';
import {Input} from './Input.jsx';
import {Label} from './Label.jsx';
import {useState} from 'react';
import {cn} from './utils.js';
import {adminService} from "../../../services/admin.service.js";

export function CreateOrganizerModal({isOpen, onClose, onCreated}) {
    const [currentStep, setCurrentStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([])

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

    const steps = [
        {number: 1, label: "General", id: "general"},
        {number: 2, label: "Verification", id: "verification"}
    ]

    const handleNext = async () => {
        if (currentStep === 1) {
            const isValid = await validateStep1();
            if (!isValid) return;
        }

        setCurrentStep((prev) => prev + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleFileUpload = e => {
        const files = e.target.files
        if (files) {
            const newFiles = Array.from(files).map(file => ({
                name: file.name,
                size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                id: Math.random()
                    .toString(36)
                    .substring(7)
            }))
            setUploadedFiles([...uploadedFiles, ...newFiles])
        }
    }

    const handleRemoveFile = id => {
        setUploadedFiles(uploadedFiles.filter(file => file.id !== id))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValid = await validateStep1();
        if (!isValid) return;

        try {
            const response = await adminService.createOrganizer(formData);
            alert("Created successfully");
            onCreated(response.data);
            onClose();
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }

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
            return "Phone number is required";
        } else if (/\D/.test(phone) && phone.charAt(0) !== "+") {
            return "Phone number must contain only digits";
        } else if (phone.charAt(0) !== "+" && phone.charAt(0) !== "0") {
            return "Phone number must start with 0 or a country code";
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
        } else if ( !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(pw)) {
           return "Password must include at least one uppercase letter, one lowercase letter and one number";
        }
        return null;
    }

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

    const isStep1Valid =
        !!formData.fullName &&
        !!formData.email &&
        !!formData.phone &&
        !!formData.password;

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
                    {/* Step Indicator */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-2">
                            {steps.map((step, index) => (
                                <div key={step.id} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center flex-1">
                                        <div
                                            className={cn(
                                                'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm mb-2 transition-colors',
                                                currentStep > step.number
                                                    ? 'bg-green-500 text-white'
                                                    : currentStep === step.number
                                                        ? 'bg-[#7FA5A5] text-white'
                                                        : 'bg-gray-200 text-gray-500'
                                            )}
                                        >
                                            {currentStep > step.number ? (
                                                <CheckCircle className="h-5 w-5"/>
                                            ) : (
                                                step.number
                                            )}
                                        </div>
                                        <span
                                            className={cn(
                                                'text-xs font-medium',
                                                currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'
                                            )}
                                        >
                      {step.label}
                    </span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div
                                            className={cn(
                                                'h-0.5 flex-1 mx-4 mb-8',
                                                currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                                            )}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Step 1 - General Information */}
                    {currentStep === 1 && (
                        <div>
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                                    Step 1: General Information
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
                                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
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
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
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
                                            onChange={(e) => setFormData({...formData, password: e.target.value})}
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
                    )}

                    {/* Step 2 - Verification Documents */}
                    {currentStep === 2 && (
                        <div>
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                                    Step 2: Verification Documents
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Upload business licenses or identity proof for verification.
                                </p>
                            </div>

                            <div className="space-y-5">
                                {/* Upload Area */}
                                <div
                                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#7FA5A5] transition-colors">
                                    <input
                                        type="file"
                                        id="fileUpload"
                                        multiple
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                    <label htmlFor="fileUpload" className="cursor-pointer">
                                        <div className="flex flex-col items-center">
                                            <div
                                                className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                                <Upload className="h-6 w-6 text-gray-400"/>
                                            </div>
                                            <p className="text-sm font-medium text-gray-900 mb-1">
                                                Click to upload or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                PDF, JPG, PNG up to 10MB
                                            </p>
                                        </div>
                                    </label>
                                </div>

                                {/* Uploaded Files */}
                                {uploadedFiles.length > 0 && (
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-700">Uploaded Documents</Label>
                                        {uploadedFiles.map((file) => (
                                            <div
                                                key={file.id}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <FileText className="h-5 w-5 text-blue-600"/>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                                            <span>{file.size}</span>
                                                            <span>•</span>
                                                            <span className="text-green-600 flex items-center gap-1">
                                <CheckCircle className="h-3 w-3"/>
                                Uploaded
                              </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-gray-400 hover:text-red-600"
                                                    onClick={() => handleRemoveFile(file.id)}
                                                >
                                                    <Trash2 className="h-4 w-4"/>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/*<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">*/}
                                {/*    <p className="text-sm text-blue-800">*/}
                                {/*        <strong>Note:</strong> Documents will be reviewed within 24-48 hours. You'll*/}
                                {/*        receive an email notification once the account is approved.*/}
                                {/*    </p>*/}
                                {/*</div>*/}
                            </div>
                        </div>
                    )}

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
                                variant="outline"
                                onClick={handleBack}
                                disabled={currentStep === 1}
                                className="px-6"
                            >
                                Back
                            </Button>
                            {currentStep < 2 ? (
                                <Button
                                    onClick={handleNext}
                                    disabled={
                                        (currentStep === 1 && !isStep1Valid)
                                    }
                                    className="px-6 bg-[#7FA5A5] hover:bg-[#6D9393] text-white"
                                >
                                    Next: Verification
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    className="px-6 bg-[#7FA5A5] hover:bg-[#6D9393] text-white"
                                >
                                    Create Account
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
