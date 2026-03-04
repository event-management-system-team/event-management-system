import { ExternalLink, FileText, FolderOpen } from 'lucide-react'

const ResourcesWidget = () => {
    return (
        <div className="w-full lg:w-1/2 bg-white rounded-[40px] p-6 2xl:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col z-10">
            <div className="flex justify-between items-center mb-5 shrink-0">
                <h3 className="text-xl 2xl:text-2xl font-black text-[#2C3E50]">Resources</h3>
                <div className="size-10 2xl:size-12 rounded-2xl bg-[#89A8B2]/10 text-[#89A8B2] flex items-center justify-center">
                    <FolderOpen size={20} />
                </div>
            </div>

            <div className="space-y-3">
                {['Gate A Site Map.pdf', 'Staff Handbook 2025'].map((file, i) => (
                    <div key={i} className="group/file flex items-center p-3 2xl:p-4 bg-gray-50 hover:bg-[#89A8B2]/5 rounded-3xl transition-colors cursor-pointer border border-transparent hover:border-[#89A8B2]/20">
                        <div className="size-10 2xl:size-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mr-4 text-[#89A8B2] group-hover/file:scale-110 transition-transform shrink-0">
                            <FileText size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-[#2C3E50] text-xs 2xl:text-sm group-hover/file:text-[#89A8B2] transition-colors truncate">{file}</h4>
                            <p className="text-[10px] 2xl:text-xs text-gray-400 mt-0.5">PDF Document</p>
                        </div>
                        <button className="text-gray-300 group-hover/file:text-[#89A8B2] p-2 shrink-0">
                            <ExternalLink size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ResourcesWidget
