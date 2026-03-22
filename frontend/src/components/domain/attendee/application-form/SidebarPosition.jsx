import { AlertCircle, Info } from 'lucide-react'
import React from 'react'

const SidebarPosition = ({ selectedPosition, isFull, deadline, location }) => {
    return (
        <aside className="w-full lg:w-[320px] shrink-0 space-y-6 lg:mt-24 pt-8">
            <div className="bg-white p-6 rounded-[28px] border border-[#eceeef] sticky top-24 shadow-sm">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Info size={20} className="text-[#89A8B2]" />
                    Position Overview
                </h3>

                <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-[#f1f1f1]">
                        <span className="text-sm text-[#89A8B2]">Role</span>

                        {selectedPosition ? (
                            <span className="font-bold text-right ml-2 text-slate-600">
                                {selectedPosition.positionName}
                            </span>
                        ) : (
                            <span className="flex items-center gap-1.5 text-[13px] italic font-semibold text-[#f59e0b] text-right ml-2">
                                <Info size={14} />
                                Select a role
                            </span>
                        )}
                    </div>

                    <div className="flex justify-between items-center py-3 border-b border-[#f1f1f1]">
                        <span className="text-sm text-[#89A8B2]">Available Slots</span>
                        <span className={`font-bold ${isFull ? 'text-red-500' : 'text-[#FF6B35]'}`}>
                            {selectedPosition ? `${selectedPosition.availableSlots} / ${selectedPosition.vacancy}` : '---'}
                        </span>
                    </div>

                    <div className="flex justify-between items-center py-3 border-b border-[#f1f1f1]">
                        <span className="text-sm text-[#89A8B2]">Deadline</span>
                        <span className="font-bold text-slate-600">
                            {deadline
                                ? new Date(deadline).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
                                :
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#4ECDC4]/10 text-[#4ECDC4] text-[11px] font-bold uppercase tracking-wide border border-[#4ECDC4]/20">
                                    Open until filled
                                </span>}
                        </span>
                    </div>
                    <div className="flex gap-4 justify-between items-center py-3 border-b border-[#f1f1f1]">
                        <span className="text-sm text-[#89A8B2]">Location</span>
                        <span className="font-bold text-slate-600">
                            {location}
                        </span>
                    </div>
                </div>

                {selectedPosition ? (
                    <div className="mt-6 p-5 bg-[#89A8B2]/10 border border-[#89A8B2]/20 rounded-[16px]">
                        <p className="text-xs font-black text-[#89A8B2] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <AlertCircle size={15} /> Specific Requirements
                        </p>
                        <p className="text-sm text-slate-700 leading-relaxed">
                            {selectedPosition.requirements}
                        </p>
                    </div>
                ) : (
                    <div className="mt-6 p-5 bg-[#F1F0E8]/60 rounded-[16px]">
                        <p className="text-xs text-[#6a777c] italic leading-snug text-center">
                            Please select a position above to view specific requirements.
                        </p>
                    </div>
                )}
            </div>
        </aside>
    )
}

export default SidebarPosition
