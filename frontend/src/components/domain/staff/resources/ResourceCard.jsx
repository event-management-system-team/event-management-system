import { getFileTypeName, getTypeBadgeStyle } from '../../../../../utils/resource.utils'

const ResourceCard = ({ resource, ActionIcon, IconComp, config }) => {
    return (
        <div className="group flex flex-col bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#2C3E50]/15 transition-all duration-300 border border-slate-100">

            <div className={`h-40 w-full ${config.bg} relative overflow-hidden flex items-center justify-center`}>
                <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

                <div className="absolute top-4 left-4 z-20">
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-lg border-none ${getTypeBadgeStyle(resource.resourceType)}`}>
                        {resource.resourceType}
                    </span>
                </div>

                <IconComp size={64} strokeWidth={1.5} className={`${config.color} opacity-60 group-hover:scale-110 group-hover:opacity-100 transition-all duration-500 relative z-10`} />
            </div>

            <div className="p-6 flex flex-col gap-4 flex-1 justify-between bg-white">
                <div>
                    <div className="flex items-start justify-between mb-2">
                        <div className="pr-4">
                            <p className="text-[#2C3E50] text-lg font-bold leading-snug line-clamp-2">
                                {resource.resourceName}
                            </p>

                            <p className="text-[#89A8B2] text-[11px] mt-2 uppercase tracking-wider font-bold">
                                {getFileTypeName(resource.fileType)}
                            </p>
                        </div>
                        <div className={`${config.bg} p-2.5 rounded-xl shrink-0`}>
                            <IconComp size={20} className={config.color} />
                        </div>
                    </div>
                </div>

                <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 w-full bg-slate-50 border border-slate-200 hover:bg-[#89A8B2] hover:border-[#89A8B2] hover:-translate-y-1 hover:shadow-md hover:shadow-[#89A8B2]/30 text-[#2C3E50] hover:text-white font-bold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                >
                    <ActionIcon size={18} className="text-[#89A8B2] group-hover/btn:text-white transition-colors" />
                    {config.actionText}
                </a>
            </div>
        </div>
    )
}

export default ResourceCard
