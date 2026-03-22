import { CalendarDays } from 'lucide-react'
import EmptyState from '../../../common/EmptyState';
import { Link, useParams } from 'react-router';

const ScheduleWidget = ({ schedules }) => {

    const { eventSlug } = useParams();

    const formatWidgetTime = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);

        const timeStr = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

        const today = new Date();
        const isToday = date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');

        const dateStr = isToday ? 'TODAY' : `${day}/${month}`;

        return `${timeStr} - ${dateStr}`;
    };

    return (
        <div className="w-full lg:w-1/2 bg-white rounded-[40px] p-6 2xl:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group flex flex-col z-10">
            <div className="flex justify-between items-center mb-5 shrink-0">
                <h3 className="text-xl 2xl:text-2xl font-black text-[#2C3E50]">My Schedule</h3>
                <Link
                    to={`/staff/${eventSlug}/my-schedule`}
                    className="size-10 2xl:size-12 rounded-2xl bg-[#FF6B35]/10 text-[#FF6B35] flex items-center justify-center hover:bg-[#FF6B35]/20 transition-all cursor-pointer"
                >
                    <CalendarDays size={20} />
                </Link>
            </div>

            <div className="space-y-3 relative before:absolute before:inset-y-0 before:left-3.5 before:w-0.5 before:bg-gray-100">
                {schedules.length === 0 && (
                    <EmptyState message='You have no upcoming shifts' />
                )}

                {schedules.map((schedule, index) => {
                    const isFirst = index === 0;

                    return (
                        <div key={schedule.assignmentId || index} className={`relative pl-8 2xl:pl-10 ${!isFirst ? 'opacity-60' : ''}`}>
                            <div className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full ring-4 ring-white z-10 
                                ${isFirst ? 'bg-[#FF6B35] shadow-[0_0_10px_rgba(255,107,53,0.5)]' : 'bg-gray-300'}`}>
                            </div>

                            <div className={`p-3 2xl:p-4 rounded-[20px] 
                                ${isFirst ? 'bg-gradient-to-r from-[#FF6B35]/5 to-transparent border border-[#FF6B35]/10' : 'bg-gray-50'}`}>

                                <p className={`font-black text-[9px] 2xl:text-[10px] mb-1 uppercase 
                                    ${isFirst ? 'text-[#FF6B35]' : 'text-gray-400'}`}>
                                    {formatWidgetTime(schedule.startTime)}
                                </p>

                                <h4 className={`text-xs 2xl:text-sm font-bold mb-0.5 
                                    ${isFirst ? 'text-[#2C3E50]' : 'text-gray-600'}`}>
                                    {schedule.scheduleName}
                                </h4>

                                <p className="text-[10px] 2xl:text-xs text-gray-500">
                                    {schedule.location}
                                </p>
                            </div>
                        </div>
                    );
                })}


            </div>
        </div>
    )
}

export default ScheduleWidget
