import { CalendarDays, MapPin, ClipboardCheck, ArrowRight, BriefcaseBusiness } from 'lucide-react';

const ApplicationCard = ({ app, getStatusStyle, formatDate }) => {
    return (
        <>
            <div
                className="w-full md:w-36 h-36 md:h-auto rounded-2xl flex-shrink-0 bg-cover bg-center border border-gray-100 shadow-inner"
                style={{ backgroundImage: `url(${app.bannerUrl})` }}
                title={app.eventName}
            ></div>

            {/* CONTAINER CHIA 2 PHẦN (THÔNG TIN & TRẠNG THÁI) */}
            <div className="flex flex-col md:flex-row grow gap-4 justify-between py-1">

                {/* PHẦN BÊN TRÁI: CHỈ CHỨA TEXT THÔNG TIN */}
                <div className="flex flex-col">
                    <h3 className="text-xl font-extrabold mb-2">
                        {app.positionName}
                    </h3>
                    <p className="text-lg font-semibold text-[#8aa8b2] mb-4">
                        {app.eventName}
                    </p>

                    {/* THÔNG TIN CHI TIẾT */}
                    <div className="flex flex-wrap gap-5 text-gray-500">
                        <div className="flex items-center gap-1.5 text-sm">
                            <MapPin size={18} className="text-gray-400" />
                            <span>{app.location}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-sm">
                            <CalendarDays size={18} className="text-gray-400" />
                            <span>Applied: {formatDate(app.appliedAt)}</span>
                        </div>

                        {app.reviewedAt && (
                            <div className="flex items-center gap-1.5 text-sm">
                                <ClipboardCheck size={18} className="text-gray-400" />
                                <span>Reviewed: {formatDate(app.reviewedAt)}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* PHẦN BÊN PHẢI: CHỈ CHỨA TRẠNG THÁI HOẶC NÚT */}
                <div className="flex md:flex-col justify-end md:justify-start items-end min-w-[140px] pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 mt-2 md:mt-0">
                    {app.status === 'APPROVED' ? (
                        // Nếu APPROVED thì chỉ hiện nút Workspace
                        <button
                            className="flex items-center justify-center gap-2 bg-[#8aa8b2] hover:bg-[#72929d] text-white px-6 py-3 rounded-full text-sm font-bold transition-all w-full md:w-auto shadow-md shadow-[#8aa8b2]/30"
                            onClick={() => console.log(`Navigating to workspace for event: ${app.recruitmentId}`)}
                        >
                            <BriefcaseBusiness size={18} />
                            <span>Workspace</span>
                            <ArrowRight size={16} className="ml-1" />
                        </button>
                    ) : (
                        // Nếu không phải APPROVED thì hiện badge trạng thái
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusStyle(app.status)}`}>
                            {app.status}
                        </span>
                    )}
                </div>

            </div>
        </>
    )
}

export default ApplicationCard
