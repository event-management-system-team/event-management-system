import React from 'react';

const CheckInStats = ({ ticketStats }) => {
    return (
        <div className="bg-white rounded-3xl flex flex-col shadow-sm border border-slate-100 p-6 h-fit sticky top-0 transition-all flex-1">
            <div className="flex flex-col gap-5">
                <div className="flex justify-between items-end mb-2">
                    <div className="flex flex-col">
                        <h3 className="text-slate-500 text-xs font-extrabold uppercase tracking-wider">Total Check-In Progress</h3>
                        <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-5xl font-black text-[#2C3E50] tracking-tight">450</span>
                            <span className="text-lg text-slate-400 font-bold">/ 1,200</span>
                        </div>
                    </div>
                    <div className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm font-extrabold border border-green-100 shadow-sm">
                        37.5%
                    </div>
                </div>

                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner mb-2">
                    <div className="h-full bg-gradient-to-r from-[#89A8B2] to-[#4ECDC4] rounded-full relative" style={{ width: '37.5%' }}>
                        <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] animate-[pulse_2s_infinite]"></div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 pt-5 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Ticket Type Breakdown</h4>
                    {ticketStats.map((stat, index) => {
                        const IconComp = stat.icon;
                        return (
                            <div key={index} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className={`size-8 rounded-lg ${stat.bg} flex items-center justify-center border ${stat.border}`}>
                                        <IconComp size={16} className={stat.color} />
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-[#2C3E50] text-sm font-bold">{stat.type}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">Total: {stat.total}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[#2C3E50] font-black text-sm">{stat.checkedIn}</span>
                                    <span className="text-xs text-slate-400 font-medium"> in</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CheckInStats;