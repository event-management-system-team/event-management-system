import { Briefcase, MapPin, Clock, DollarSign } from "lucide-react";

const RecruitmentCard = ({ title, eventName, type, time, salary, benefit, icon: Icon }) => {
    return (
        <div className="bg-white p-5 rounded-2xl flex items-center gap-5 border border-gray-100 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
            {/* Icon Box */}
            <div className="size-16 bg-[#F1F0E8] rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Icon size={32} strokeWidth={1.5} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0"> {/* min-w-0 giúp text không bị tràn */}
                <h4 className="font-bold text-lg text-gray-900 truncate">{title}</h4>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <span className="font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">{eventName}</span>
                    <span>• {type}</span>
                    <span>• {time}</span>
                </div>
            </div>

            {/* Salary & Benefit (Căn phải) */}
            <div className="text-right shrink-0">
                <div className="text-emerald-600 font-extrabold text-lg flex items-center justify-end">
                    {salary}
                    <span className="text-xs text-gray-400 font-normal ml-0.5">/hr</span>
                </div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide bg-gray-50 px-2 py-1 rounded-full inline-block mt-1">
                    {benefit}
                </div>
            </div>
        </div>
    );
};

export default RecruitmentCard;