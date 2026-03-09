import { CalendarDays, MapPin, ClipboardCheck, ArrowRight, BriefcaseBusiness } from 'lucide-react';
import { useNavigate } from 'react-router';

const ApplicationCard = ({ app, getStatusStyle, formatDate }) => {
    const navigate = useNavigate()

    return (
        <>
            <div
                className="w-full md:w-36 h-36 md:h-auto rounded-2xl flex-shrink-0 bg-cover bg-center border border-gray-100 shadow-inner"
                style={{ backgroundImage: `url(${app.bannerUrl})` }}
                title={app.eventName}
            ></div>

            <div className="flex flex-col md:flex-row grow gap-4 justify-between py-1">
                <div className="flex flex-col">
                    <h3 className="text-xl font-extrabold mb-2">
                        {app.positionName}
                    </h3>
                    <p className="text-lg font-semibold text-[#8aa8b2] mb-4">
                        {app.eventName}
                    </p>

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

                <div className="flex md:flex-col justify-end md:justify-start items-end min-w-[140px] pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 mt-2 md:mt-0">
                    {app.status === 'APPROVED' ? (
                        <button
                            className="flex items-center justify-center gap-2 bg-[#8aa8b2] hover:bg-[#72929d] text-white px-6 py-3 rounded-full text-sm font-bold transition-all w-full md:w-auto shadow-md shadow-[#8aa8b2]/30"
                            onClick={() => navigate(`/staff/${app.eventSlug}`)}
                        >
                            <BriefcaseBusiness size={18} />
                            <span>Workspace</span>
                            <ArrowRight size={16} className="ml-1" />
                        </button>
                    ) : (
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
