import { useEffect, useState } from "react";
import organizerService from "../../../services/organizer.service";
import { Card, CardContent } from "../admin/Card";
import { TabsContent } from "../admin/Tabs";
import { CreateResourceModal } from "./CreateResourceModal";
import { Eye, Download, FileText, ImageIcon, Calendar1 } from "lucide-react";
import { Button } from "../admin/Button.jsx";

const ResourceTab = ({ id, isResourceModalOpen, closeResourceModal, onLoading, onError, showAlert }) => {

    const [resources, setResources] = useState([])

    const fetchResources = async () => {
        if (!id) return

        try {
            onLoading(true)
            const response = await organizerService.getResources(id)

            setResources(response.data)
        } catch (error) {
            onError("Cannot load resources");
            console.error(error)
        } finally {
            onLoading(false);
        }
    }

    useEffect(() => {
        fetchResources()
    }, [id])

    const handleResourceCreated = async () => {
        await fetchResources()
    }

    const formatFileSize = (bytes) => {
        return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const normalizeFileType = (mime) => {
        if (!mime) return "document"

        if (mime.startsWith("image/")) return "image"
        if (mime.includes("pdf")) return "pdf"
        if (mime.includes("excel") || mime.includes("spreadsheet")) return "excel"
        if (mime.includes("word") || mime.includes("document")) return "document"

        return "document"
    }

    const getFileIcon = (mimeType) => {
        const type = normalizeFileType(mimeType)

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

    const handleFileDownload = (file) => {
        if (!file?.fileUrl) return;

        const downloadUrl = file.fileUrl.replace(
            "/upload/",
            "/upload/fl_attachment/"
        );

        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = file.resourceName || "download";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFilePreview = (e, file) => {
        e.preventDefault();
        if (!file?.fileUrl) return;

        const officeTypes = [
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
            "application/msword", // .doc
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
            "application/vnd.ms-excel", // .xls
            "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
            "application/vnd.ms-powerpoint" // .ppt
        ];

        if (officeTypes.includes(file.fileType)) {
            const officeViewer = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(file.fileUrl)}`;
            window.open(officeViewer, "_blank");
            return;
        }

        window.open(file.fileUrl, "_blank");
    };
    return (
        <>
            <TabsContent value="resources" className="px-8 mt-2">
                <Card className="shadow-sm border border-gray-100 bg-white rounded-xl overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Event Resources</h3>
                            <p className="text-sm text-gray-500 mt-1">Files and guidelines available for staff members</p>
                        </div>
                    </div>
                    <CardContent className="p-0">
                        <div className="divide-y divide-gray-100">
                            {resources && resources.length > 0 ? (
                                resources.map(file => (
                                    <div
                                        key={file.resourceId}
                                        className="flex items-center justify-between p-5 hover:bg-gray-50/80 transition-all group"
                                    >
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="flex-shrink-0 mt-0.5 p-2 bg-gray-50 rounded-lg group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-gray-100 transition-all">{getFileIcon(file.fileType)}</div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate mb-1">
                                                    {file.resourceName}
                                                </p>
                                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1.5"><Calendar1 className="w-3.5 h-3.5"/> {formatDate(file.createdAt)}</span>
                                                    <span>•</span>
                                                    <span>{formatFileSize(file.fileSize)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 ml-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 w-8 p-0 rounded-full border-gray-200 hover:border-[#7FA5A5] hover:text-[#7FA5A5]"
                                                onClick={(e) => handleFilePreview(e, file)}
                                                title="Preview file"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 w-8 p-0 rounded-full border-gray-200 hover:border-[#7FA5A5] hover:text-[#7FA5A5]"
                                                onClick={() => handleFileDownload(file)}
                                                title="Download file"
                                            >
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))) : (
                                <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                                    <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 mb-5">
                                        <FileText className="w-8 h-8 text-gray-400" />
                                    </div>

                                    <h3 className="text-base font-semibold text-gray-900">
                                        No resources available
                                    </h3>

                                    <p className="text-sm text-gray-500 mt-2 max-w-sm">
                                        Upload documents and materials for your event staff.
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Create Resource Modal */}
            <CreateResourceModal
                eventId={id}
                isOpen={isResourceModalOpen}
                onClose={closeResourceModal}
                onCreated={handleResourceCreated}
                onAlert={showAlert}
            />
        </>
    )
};

export default ResourceTab;