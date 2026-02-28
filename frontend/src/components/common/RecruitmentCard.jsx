import { Briefcase, MapPin } from "lucide-react";
import { Link } from 'react-router-dom'

const RecruitmentCard = ({ positions = [], eventName, eventSlug, eventBannerUrl, deadline, createdAt, location, organizer }) => {

    const isNew = (new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24) <= 3;

    const dateObj = new Date(deadline);
    const month = dateObj.toLocaleString('vi-VN', { month: 'short' });
    const day = dateObj.getDate();

    return (
        <Link to={`/recruitments/${eventSlug}`} className="block">
            <div className="relative bg-white rounded-2xl flex items-stretch border border-gray-100 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer group overflow-hidden h-28 sm:h-[150px]">

                {isNew && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[9px] sm:text-[10px] font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-bl-xl z-20 shadow-sm tracking-wider">
                        NEW
                    </span>
                )}

                <div className="w-24 sm:w-32 md:w-48 shrink-0 bg-[#F1F0E8] relative overflow-hidden">
                    {eventBannerUrl ? (
                        <img
                            src={eventBannerUrl}
                            alt={eventName}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary/40 group-hover:bg-primary group-hover:text-white transition-colors">
                            <Briefcase className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={1.5} />
                        </div>
                    )}
                </div>

                <div className="flex-1 p-3 sm:p-5 flex items-center gap-2 sm:gap-4 min-w-0">
                    <div className="flex-1 min-w-0 flex flex-col justify-center">

                        <h4 className="font-bold text-base sm:text-lg text-gray-900 truncate group-hover:text-primary transition-colors">
                            {eventName}
                        </h4>

                        <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-1.5 text-[10px] sm:text-xs text-slate-500">
                            {location && (
                                <span className="flex items-center gap-1 font-medium truncate max-w-[120px] sm:max-w-[200px]">
                                    <MapPin size={12} className="text-slate-400 shrink-0" />
                                    <span className="truncate">{location}</span>
                                </span>
                            )}
                            {organizer && (
                                <>

                                    <span className="text-slate-300 hidden sm:inline">•</span>
                                    <span className="truncate max-w-37.5 font-medium hidden sm:inline">{organizer.fullName}</span>
                                </>
                            )}
                        </div>

                        <div className="mt-2 sm:mt-3.5 flex items-center gap-1.5 sm:gap-2 overflow-hidden w-full">

                            <span className="hidden sm:inline-block text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">JOB OPENINGS:</span>

                            <div className="flex items-center gap-1.5 sm:gap-2 overflow-hidden flex-nowrap flex-1 min-w-0">
                                {positions.slice(0, 2).map((pos, idx) => (
                                    <span
                                        key={idx}
                                        className="inline-flex items-center gap-1 sm:gap-1.5 bg-slate-50 border border-slate-200 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[9px] sm:text-[11px] font-bold text-slate-500 min-w-0"
                                    >

                                        <span className="truncate max-w-[60px] sm:max-w-25 md:max-w-32.5" title={pos.positionName}>
                                            {pos.positionName}
                                        </span>
                                    </span>
                                ))}

                                {positions.length > 2 && (
                                    <span className="inline-flex items-center py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-[11px] font-bold text-slate-500 shrink-0">
                                        +{positions.length - 2}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="shrink-0 border-l border-gray-100 pl-3 sm:pl-6 ml-1 flex flex-col items-center justify-center min-w-[50px] sm:min-w-[70px]">
                        <div className="text-[9px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest mb-0.5 sm:mb-1 text-center">{month}</div>
                        <div className="font-black text-2xl sm:text-3xl flex items-center justify-center leading-none">
                            {day}
                        </div>
                    </div>
                </div>

            </div>
        </Link>
    );
};

export default RecruitmentCard;