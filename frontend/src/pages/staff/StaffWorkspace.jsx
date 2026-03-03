import {
    CalendarDays,
    FolderOpen,
    MapPin,
    Clock,
    FileText,
    ExternalLink,
    ScanLine,
    Bell,
    Map
} from 'lucide-react';
import ProfileCard from '../../components/domain/staff/workspace/ProfileCard';

const StaffWorkspacePage = () => {
    return (
        <div className="h-screen w-full bg-[#F3F4F6] font-sans overflow-hidden flex flex-col relative">
            <div className="w-full h-full overflow-y-auto custom-scrollbar">

                <div className="max-w-[1400px] w-full mx-auto flex flex-col gap-6 p-4 lg:p-6 pb-24 lg:pb-10">

                    {/* 1. TOP ROW: Profile & Event Card */}
                    <div className="flex-none flex flex-col lg:flex-row gap-6">

                        {/* Profile Card */}
                        <ProfileCard />

                        {/* Event Banner Card */}
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
                                    <button className="size-10 2xl:size-12 rounded-2xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                                        <Bell size={18} />
                                    </button>
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
                    </div>

                    {/* 2. BOTTOM ROW: WIDGETS (Schedule & Resources) */}
                    <div className="flex-none flex flex-col lg:flex-row gap-6">

                        {/* Schedule Widget */}
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

                        {/* Resources Widget */}
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

                    </div>
                </div>
            </div>

            {/* Floating Action Button */}
            <button className="fixed bottom-6 lg:bottom-8 right-6 lg:right-8 z-50 flex items-center justify-center size-14 lg:size-16 rounded-[1.5rem] bg-gradient-to-tr from-[#89A8B2] to-[#608b99] text-white shadow-[0_10px_25px_rgba(137,168,178,0.5)] transition-all duration-300 hover:scale-110 hover:shadow-[0_15px_35px_rgba(137,168,178,0.6)]">
                <ScanLine size={24} className="lg:w-7 lg:h-7" />
            </button>
        </div>
    );
};

export default StaffWorkspacePage;