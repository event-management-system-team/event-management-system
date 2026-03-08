import {
    X,
    Upload,
    FileText,
    Image as ImageIcon,
    CheckCircle,
    AlertCircle
} from "lucide-react"
import { Button } from "../admin/Button"
import { Input } from "../admin/Input"
import { Label } from "../admin/Label"
import { Textarea } from "../admin/Textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "../admin/Select"
import { useState, useRef } from "react"
import { cn } from "../admin/utils"
import organizerService from "../../../services/organizer.service"

export function CreateResourceModal({ eventId, isOpen, onClose, onAlert }) {

    const [isSubmitting, setIsSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        resourceName: "",
        description: "",
        resourceType: ""
    })

    const [errors, setErrors] = useState({
        resourceName: "",
        description: "",
        resourceType: ""
    });

    const [uploadedFile, setUploadedFile] = useState(null)

    const validateResourceName = (resourceName = "") => {
        const value = resourceName.trim();
        if (!value) {
            return "Resource name is required";
        } else if (value.length > 100) {
            return "Resource name must be no more than 100 characters";
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

    const validateField = (fieldName) => {
        let error = null;

        switch (fieldName) {
            case "resourceName":
                error = validateResourceName(formData.resourceName);
                break;

            case "description":
                error = validateDescription(formData.description);
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

        const resourceNameError = validateResourceName(formData.resourceName);
        if (resourceNameError) newErrors.resourceName = resourceNameError;

        const descriptionError = validateDescription(formData.description);
        if (descriptionError) newErrors.description = descriptionError;

        setErrors({
            resourceName: resourceNameError || null,
            description: descriptionError || null,
        });
        return Object.keys(newErrors).length === 0;
    };

    const fileInputRef = useRef(null)

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value })
        if (errors[field]) {
            setErrors({ ...errors, [field]: "" })
        }
    }

    const handleFileUpload = e => {
        const file = e.target.files?.[0]
        if (!file) return

        const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/png",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ]

        if (!allowedTypes.includes(file.type)) {
            setErrors(prev => ({ ...prev, file: "Unsupported file type" }))
            return
        }

        if (file.size > 10 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, file: "File must be < 10MB" }))
            return
        }

        setUploadedFile(file)

        setErrors(prev => ({
            ...prev,
            file: ""
        }))
    }

    const handleRemoveFile = () => {
        setUploadedFile(null)
    }

    const handleDragOver = e => {
        e.preventDefault()
    }

    const handleDrop = e => {
        e.preventDefault()

        const file = e.dataTransfer.files?.[0]
        if (!file) return

        setUploadedFile(file)
    }

    const formatFileSize = (bytes) => {
        return (bytes / (1024 * 1024)).toFixed(2) + " MB";
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

    const handleCreateResource = async () => {
        if (isSubmitting) return;

        const isValid = validateForm();
        if (!isValid) {
            onAlert("error", "Please fix the validation errors before submitting");
            return;
        }

        try {
            setIsSubmitting(true)
            const payload = {
                resourceName: formData.resourceName,
                description: formData.description,
                resourceType: formData.resourceType.toUpperCase()
            }

            const res = await organizerService.createResource(eventId, payload, uploadedFile)
            onAlert("success", "Created resource successfully")

            // reset form
            setFormData({
                resourceName: "",
                description: "",
                resourceType: ""
            })
            setUploadedFile(null)

            // onCreated(res.data);
            onClose();

        } catch (err) {
            const msg = err.response?.data?.message || "Failed to create resource. Please try again";
            onAlert("err", msg)
        } finally {
            setIsSubmitting(false)
        }
    }

    const isFormValid = () => {
        return (
            formData.resourceName.trim() &&
            formData.resourceType &&
            uploadedFile !== null
        )
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-start justify-between z-10">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Upload New Resource
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Add a new resource for staff members
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
                    {/* Resource Information */}
                    <div className="space-y-4">
                        <div>
                            <Label
                                htmlFor="resourceName"
                                className="text-sm font-medium text-gray-700 mb-1.5 block"
                            >
                                Resource Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="resourceName"
                                type="text"
                                placeholder="e.g. Staff Safety Guidelines"
                                value={formData.resourceName}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    setFormData({ ...formData, resourceName: value });

                                    const error = validateResourceName(value);
                                    setErrors((prev) => ({
                                        ...prev,
                                        resourceName: error,
                                    }));
                                }}
                                onBlur={() => validateField("resourceName")}
                                className={cn(
                                    "h-10",
                                    errors.resourceName && "border-red-500"
                                )}
                            />
                            {errors.resourceName && (
                                <p className="text-xs text-red-500 mt-1">{errors.resourceName}</p>
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
                                placeholder="Brief description of this resource (optional)"
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
                                htmlFor="resourceType"
                                className="text-sm font-medium text-gray-700 mb-1.5 block"
                            >
                                Resource Type <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.resourceType}
                                onValueChange={value =>
                                    handleInputChange("resourceType", value)
                                }
                            >
                                <SelectTrigger
                                    className={cn(
                                        "h-10 border border-gray-200",
                                        errors.resourceType && "border-red-500"
                                    )}
                                >
                                    <SelectValue placeholder="Select resource type" />
                                </SelectTrigger>
                                <SelectContent className="border border-gray-200">
                                    <SelectItem value="DOCUMENT">Document</SelectItem>
                                    <SelectItem value="GUIDE">Guide</SelectItem>
                                    <SelectItem value="MATERIAL">Material</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.resourceType && (
                                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.resourceType}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* File Upload Section */}
                    <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">
                            Upload File <span className="text-red-500">*</span>
                        </Label>

                        {!uploadedFile ? (
                            <div
                                className={cn(
                                    "border-2 border-dashed rounded-lg p-8 text-center hover:border-[#7FA5A5] transition-colors cursor-pointer",
                                    errors.file ? "border-red-500" : "border-gray-300"
                                )}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleFileUpload}
                                    accept=".pdf,.jpg,.jpeg,.png,.docx,.xlsx"
                                />
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                        <Upload className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-900 mb-1">
                                        Click to upload or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        PDF, DOCX, XLSX, JPG, PNG up to 10MB
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                                            {getFileIcon(uploadedFile.type)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {uploadedFile.name}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <span>{formatFileSize(uploadedFile.size)}</span>
                                                <span>•</span>
                                                <span className="text-green-600 flex items-center gap-1">
                                                    <CheckCircle className="h-3 w-3" />
                                                    Ready to upload
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-gray-400 hover:text-red-600"
                                        onClick={handleRemoveFile}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {errors.file && (
                            <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {errors.file}
                            </p>
                        )}
                    </div>

                    {/* Helper Text */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs text-blue-700 flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>
                                Only one file can be uploaded per resource.
                            </span>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
                    <Button variant="outline" onClick={onClose} className="px-6">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreateResource}
                        disabled={!isFormValid() || isSubmitting}
                        className="px-6 bg-[#7FA5A5] hover:bg-[#6D9393] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Upload
                    </Button>
                </div>
            </div>
        </div>
    )
}
