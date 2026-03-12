import { useEffect, useState } from "react";
import organizerService from "../../../services/organizer.service";
import { Card, CardContent } from "../admin/Card";
import { TabsContent } from "../admin/Tabs";
import { CreateResourceModal } from "./CreateResourceModal";
import { Eye, Download, FileText, ImageIcon, } from "lucide-react";
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

    const handleFilePreview = (file) => {
        if (!file?.fileUrl) return;

        if (file.fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            const officeViewer = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(file.fileUrl)}`;
            // const googleViewer = `https://docs.google.com/gview?url=${encodeURIComponent(file.fileUrl)}&embedded=true`
            window.open(officeViewer, "_blank");
            return;
        }

        window.open(file.fileUrl, "_blank");
    };

    return (
        <>
            <TabsContent value="resources" className="space-y-4">
                {/* Recent Files */}
                <Card className="shadow-sm border-none">
                    <CardContent>
                        <div className="space-y-4">
                            {resources && resources.length > 0 ? (
                                resources.map(file => (
                                    <div
                                        key={file.resourceId}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="flex-shrink-0">{getFileIcon(file.fileType)}</div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {file.resourceName}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Uploaded {formatDate(file.createdAt)} • {formatFileSize(file.fileSize)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0"
                                                onClick={() => handleFileDownload(file)}
                                            >
                                                <Download className="h-4 w-4 text-gray-500" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0"
                                                onClick={() => handleFilePreview(file)}
                                            >
                                                <Eye className="h-4 w-4 text-gray-500" />
                                            </Button>
                                        </div>
                                    </div>
                                ))) : (
                                <div className="text-center text-gray-500 border-none">No resource yet.</div>
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
                showAlert={showAlert}
            />
        </>
    )
};

export default ResourceTab;