import { Briefcase, CalendarDays } from "lucide-react";

const RecruitmentCard = ({ positionName, eventName, eventBannerUrl, availableSlots, deadline, createdAt }) => {

    const isNew = (new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24) <= 3;
    const formattedDeadline = new Date(deadline).toLocaleDateString('vi-VN');

    return (
        <div className="relative bg-white rounded-2xl flex items-stretch border border-gray-100 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer group overflow-hidden">

            {isNew && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10 shadow-sm">
                    NEW
                </span>
            )}

            <div className="w-32 sm:w-40 shrink-0 bg-[#F1F0E8] relative">
                {eventBannerUrl ? (
                    <img
                        src={eventBannerUrl}
                        alt={eventName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <Briefcase size={28} strokeWidth={1.5} />
                    </div>
                )}
            </div>

            <div className="flex-1 p-5 flex items-center gap-5 min-w-0">
                {/* Content ở giữa */}
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-lg text-gray-900 truncate group-hover:text-primary transition-colors">
                        {positionName}
                    </h4>

                    {/* --- Tên sự kiện & Ban tổ chức --- */}
                    <div className="flex flex-col gap-1 mt-1.5">
                        <div className="flex items-center gap-2 text-xs">
                            <span className="font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded truncate max-w-[200px]">
                                {eventName}
                            </span>

                            {/* {organizerName && (
                            <>
                                <span className="text-gray-300">•</span>
                                <span className="text-gray-500 truncate">{organizerName}</span>
                            </>
                        )} */}
                        </div>
                    </div>
                </div>

                <div className="text-right shrink-0">
                    <div className="text-emerald-600 font-extrabold text-lg flex items-center justify-end">
                        {availableSlots}
                        <span className="text-xs text-gray-400 font-normal ml-1 uppercase">Slot</span>
                    </div>

                    <div className="flex items-center justify-end gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-wide bg-gray-50 px-2 py-1 rounded-full mt-1 border border-gray-100">
                        <CalendarDays size={12} className="text-gray-400" />
                        Deadline: {formattedDeadline}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default RecruitmentCard;