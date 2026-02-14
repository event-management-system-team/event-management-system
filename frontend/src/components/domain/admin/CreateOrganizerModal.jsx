import {
    CheckCircle,
    X,
    Upload,
    FileText,
    Trash2,
    Eye,
    EyeOff,
    Building,
    Globe,
    Users,
    MapPin,
    Phone as PhoneIcon
} from 'lucide-react';
import {Button} from './Button.jsx';
import {Input} from './Input.jsx';
import {Label} from './Label.jsx';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from './Select.jsx';
import {Textarea} from './Textarea.jsx';
import {useState} from 'react';
import {cn} from './utils.js';

export function CreateOrganizerModal({isOpen, onClose}) {
    const [currentStep, setCurrentStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([])

    // Form state
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        companyName: "",
        industry: "",
        companySize: "",
        website: "",
        address: "",
        country: ""
    })

    const steps = [
        {number: 1, label: "Personal", id: "personal"},
        {number: 2, label: "Company", id: "company"},
        {number: 3, label: "Verification", id: "verification"}
    ]

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1)
        }
    }

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

    const handleSubmit = () => {
        // Handle form submission
        console.log("Form submitted:", formData)
        onClose()
        // Reset form
        setCurrentStep(1)
        setFormData({
            fullName: "",
            email: "",
            phone: "",
            password: "",
            companyName: "",
            industry: "",
            companySize: "",
            website: "",
            address: "",
            country: ""
        })
        setUploadedFiles([])
    }

    const isStep1Valid =
        formData.fullName && formData.email && formData.password.length >= 8
    const isStep2Valid = formData.companyName && formData.industry

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

                    {/* Step 1 - Personal Information */}
                    {currentStep === 1 && (
                        <div>
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                                    Step 1: Personal Information
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Please provide the primary contact details for this account.
                                </p>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <Label htmlFor="fullName"
                                           className="text-sm font-medium text-gray-700 mb-1.5 block">
                                        Full Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="fullName"
                                        type="text"
                                        placeholder="e.g. John Doe"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                        className="h-10"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1.5 block">
                                        Corporate Email <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@company.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="h-10"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-1.5 block">
                                        Phone Number
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+1 (555) 000-0000"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        className="h-10"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Include country code</p>
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
                                    {formData.password && formData.password.length < 8 && (
                                        <p className="text-xs text-red-500 mt-1">Password must be at least 8
                                            characters</p>
                                    )}
                                    {formData.password && formData.password.length >= 8 && (
                                        <p className="text-xs text-green-600 mt-1">Password strength: Good</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2 - Company Details */}
                    {currentStep === 2 && (
                        <div>
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                                    Step 2: Company Details
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Provide information about the organization or business.
                                </p>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <Label htmlFor="companyName"
                                           className="text-sm font-medium text-gray-700 mb-1.5 block">
                                        Company Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="companyName"
                                        type="text"
                                        placeholder="e.g. TechEvents Inc."
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                                        className="h-10"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="industry"
                                               className="text-sm font-medium text-gray-700 mb-1.5 block">
                                            Industry <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={formData.industry}
                                            onValueChange={(value) => setFormData({...formData, industry: value})}
                                        >
                                            <SelectTrigger className="h-10">
                                                <SelectValue placeholder="Select industry"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="technology">Technology</SelectItem>
                                                <SelectItem value="music">Music & Entertainment</SelectItem>
                                                <SelectItem value="education">Education</SelectItem>
                                                <SelectItem value="business">Business & Corporate</SelectItem>
                                                <SelectItem value="food">Food & Beverage</SelectItem>
                                                <SelectItem value="sports">Sports & Recreation</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="companySize"
                                               className="text-sm font-medium text-gray-700 mb-1.5 block">
                                            Company Size
                                        </Label>
                                        <Select
                                            value={formData.companySize}
                                            onValueChange={(value) => setFormData({...formData, companySize: value})}
                                        >
                                            <SelectTrigger className="h-10">
                                                <SelectValue placeholder="Select size"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1-10">1-10 employees</SelectItem>
                                                <SelectItem value="11-50">11-50 employees</SelectItem>
                                                <SelectItem value="51-200">51-200 employees</SelectItem>
                                                <SelectItem value="201-500">201-500 employees</SelectItem>
                                                <SelectItem value="500+">500+ employees</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="website" className="text-sm font-medium text-gray-700 mb-1.5 block">
                                        Website
                                    </Label>
                                    <Input
                                        id="website"
                                        type="url"
                                        placeholder="https://www.company.com"
                                        value={formData.website}
                                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                                        className="h-10"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="country" className="text-sm font-medium text-gray-700 mb-1.5 block">
                                        Country
                                    </Label>
                                    <Select
                                        value={formData.country}
                                        onValueChange={(value) => setFormData({...formData, country: value})}
                                    >
                                        <SelectTrigger className="h-10">
                                            <SelectValue placeholder="Select country"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="us">United States</SelectItem>
                                            <SelectItem value="ca">Canada</SelectItem>
                                            <SelectItem value="uk">United Kingdom</SelectItem>
                                            <SelectItem value="au">Australia</SelectItem>
                                            <SelectItem value="de">Germany</SelectItem>
                                            <SelectItem value="fr">France</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="address" className="text-sm font-medium text-gray-700 mb-1.5 block">
                                        Business Address
                                    </Label>
                                    <Textarea
                                        id="address"
                                        placeholder="Street address, city, state/province, postal code"
                                        value={formData.address}
                                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                                        className="min-h-20 resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3 - Verification Documents */}
                    {currentStep === 3 && (
                        <div>
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                                    Step 3: Verification Documents
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

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-blue-800">
                                        <strong>Note:</strong> Documents will be reviewed within 24-48 hours. You'll
                                        receive an email notification once the account is approved.
                                    </p>
                                </div>
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
                            {currentStep < 3 ? (
                                <Button
                                    onClick={handleNext}
                                    disabled={
                                        (currentStep === 1 && !isStep1Valid) ||
                                        (currentStep === 2 && !isStep2Valid)
                                    }
                                    className="px-6 bg-[#7FA5A5] hover:bg-[#6D9393] text-white"
                                >
                                    {currentStep === 1 ? 'Next: Company Details' : 'Next: Verification'}
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
