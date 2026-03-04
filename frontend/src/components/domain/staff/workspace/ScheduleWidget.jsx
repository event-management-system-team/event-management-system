import { CalendarDays } from 'lucide-react'
import React from 'react'

const ScheduleWidget = () => {
    return (
        <div className="w-full lg:w-1/2 bg-white rounded-[40px] p-6 2xl:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group flex flex-col z-10">
            <div className="flex justify-between items-center mb-5 shrink-0">
                <h3 className="text-xl 2xl:text-2xl font-black text-[#2C3E50]">My Schedule</h3>
                <div className="size-10 2xl:size-12 rounded-2xl bg-[#FF6B35]/10 text-[#FF6B35] flex items-center justify-center">
                    <CalendarDays size={20} />
                </div>
            </div>

            <div className="space-y-3 relative before:absolute before:inset-y-0 before:left-3.5 before:w-0.5 before:bg-gray-100">
                <div className="relative pl-8 2xl:pl-10">
                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#FF6B35] ring-4 ring-white shadow-[0_0_10px_rgba(255,107,53,0.5)] z-10"></div>
                    <div className="p-3 2xl:p-4 bg-gradient-to-r from-[#FF6B35]/5 to-transparent rounded-[20px] border border-[#FF6B35]/10">
                        <p className="text-[#FF6B35] font-black text-[9px] 2xl:text-[10px] mb-1">14:00 - TODAY</p>
                        <h4 className="text-xs 2xl:text-sm font-bold text-[#2C3E50] mb-0.5">Check-in Duty</h4>
                        <p className="text-[10px] 2xl:text-xs text-gray-500">Gate A - Main Entrance</p>
                    </div>
                </div>
                <div className="relative pl-8 2xl:pl-10 opacity-60">
                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-gray-300 ring-4 ring-white z-10"></div>
                    <div className="p-3 2xl:p-4 bg-gray-50 rounded-[20px]">
                        <p className="text-gray-400 font-bold text-[9px] 2xl:text-[10px] mb-1">18:30 - TODAY</p>
                        <h4 className="text-xs 2xl:text-sm font-bold text-gray-600 mb-0.5">Dinner Break</h4>
                        <p className="text-[10px] 2xl:text-xs text-gray-500">Staff Cafeteria</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ScheduleWidget
