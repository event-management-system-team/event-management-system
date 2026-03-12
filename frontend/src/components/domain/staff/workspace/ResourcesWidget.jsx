import { ExternalLink, FileText, FolderOpen } from 'lucide-react'
import { Link, useParams } from 'react-router';

const ResourcesWidget = ({ resources = [] }) => {

    const { eventSlug } = useParams();

    const getFileTypeName = (fileType) => {
        if (!fileType) return 'Document';
        if (fileType.includes('pdf')) return 'PDF Document';
        if (fileType.includes('spreadsheet') || fileType.includes('excel') || fileType.includes('xlsx')) return 'Excel Spreadsheet';
        if (fileType.includes('video')) return 'Video File';
        if (fileType.includes('image')) return 'Image File';
        return 'Document';
    };

    return (
        <div className="w-full lg:w-1/2 bg-white rounded-[40px] p-6 2xl:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col z-10">

            <div className="flex justify-between items-center mb-5 shrink-0">
                <h3 className="text-xl 2xl:text-2xl font-black text-[#2C3E50]">Resources</h3>
                <Link
                    to={`/staff/${eventSlug}/resource`}
                    className="size-10 2xl:size-12 rounded-2xl bg-[#89A8B2]/10 text-[#89A8B2] flex items-center justify-center hover:bg-[#89A8B2]/20 transition-colors cursor-pointer"
                >
                    <FolderOpen size={20} />
                </Link>
            </div>

            <div className="space-y-3 flex-1">
                {resources.length === 0 && (
                    <div className="pl-4 text-sm text-gray-500 italic">
                        Not yet resources
                    </div>
                )}

                {resources.map((file) => (
                    <a
                        key={file.resourceId}
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/file flex items-center p-3 2xl:p-4 bg-gray-50 hover:bg-[#89A8B2]/5 rounded-3xl transition-colors cursor-pointer border border-transparent hover:border-[#89A8B2]/20"
                    >
                        <div className="size-10 2xl:size-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mr-4 text-[#89A8B2] group-hover/file:scale-110 transition-transform shrink-0">
                            <FileText size={18} />
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-[#2C3E50] text-xs 2xl:text-sm group-hover/file:text-[#89A8B2] transition-colors truncate">
                                {file.resourceName}
                            </h4>
                            <p className="text-[10px] 2xl:text-xs text-gray-400 mt-0.5">
                                {getFileTypeName(file.fileType)}
                            </p>
                        </div>

                        <div className="text-gray-300 group-hover/file:text-[#89A8B2] p-2 shrink-0">
                            <ExternalLink size={16} />
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default ResourcesWidget
