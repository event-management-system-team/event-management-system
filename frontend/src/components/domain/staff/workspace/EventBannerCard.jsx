import { Bell, Clock, Map, MapPin } from 'lucide-react'
import React from 'react'

const EventBannerCard = () => {
    return (
        <div className="w-full lg:w-8/12 bg-white rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-3 flex flex-col md:flex-row gap-4 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-500">
            <div className="w-full md:w-5/12 h-48 md:h-auto min-h-[240px] rounded-[32px] overflow-hidden relative group shrink-0">
                <img src="https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Event" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                    <div className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-xl w-fit border border-white/30 text-white text-[10px] font-bold uppercase tracking-wider mb-2">
                        Ongoing Event
                    </div>
                    <h2 className="text-xl 2xl:text-2xl font-black text-white leading-tight">BridgeFest Music Festival</h2>
                </div>
            </div>

            <div className="py-4 px-6 flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-gray-600">
                            <div className="size-10 2xl:size-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] 2xl:text-xs font-bold text-gray-400 uppercase tracking-wider">Location</p>
                                <p className="text-sm 2xl:text-base font-bold text-[#2C3E50]">Ho Chi Minh City</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-gray-600">
                            <div className="size-10 2xl:size-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                                <Clock size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] 2xl:text-xs font-bold text-gray-400 uppercase tracking-wider">Date & Time</p>
                                <p className="text-sm 2xl:text-base font-bold text-[#2C3E50]">Oct 24, 2026</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-5 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="size-8 2xl:size-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="team" className="w-full h-full object-cover" />
                            </div>
                        ))}
                        <div className="size-8 2xl:size-10 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-500">
                            +5
                        </div>
                    </div>
                    <button className="flex items-center justify-center gap-2 px-5 py-2 2xl:px-6 2xl:py-3 bg-[#2C3E50] hover:bg-[#1a252f] text-white rounded-xl 2xl:rounded-2xl text-xs 2xl:text-sm font-bold transition-colors shadow-md">
                        <Map size={16} />
                        <span>View Map</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EventBannerCard
