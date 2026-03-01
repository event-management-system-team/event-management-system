import { Briefcase } from 'lucide-react'

const DescriptionSection = ({ description, positions }) => {
    return (
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-[#E5E1DA]/50">
            <div className="space-y-8">
                <div>
                    <h3 className="text-lg font-extrabold text-slate-900 mb-4">Description</h3>
                    <p className="text-slate-600 text-[14px] leading-relaxed">
                        {description}
                    </p>
                </div>

                <div className="pt-8 border-t border-slate-100">
                    <h3 className="text-lg font-extrabold text-slate-900 mb-5">Open Positions & Requirements</h3>

                    <div className="space-y-4">
                        {positions?.map((pos) => (
                            <div key={pos.recruitmentId} className="p-5 bg-slate-50 rounded-xl border border-slate-100 hover:border-primary/30 transition-colors">
                                <div className="flex flex-wrap justify-between items-start sm:items-center gap-3 mb-3">
                                    <h4 className="font-bold text-slate-800 text-[15px] flex items-center gap-2">
                                        <Briefcase size={18} className="text-primary" />
                                        {pos.positionName}
                                    </h4>
                                    <span className="text-[11px] font-bold bg-primary/10 text-primary px-3 py-1.5 rounded-lg uppercase tracking-wide">
                                        Hiring: {pos.vacancy} slot
                                    </span>
                                </div>
                                <div className="text-[13px] text-slate-600 pl-6 border-l-2 border-slate-200 ml-1.5">
                                    <span className="font-semibold text-slate-700 block mb-1">Requirements:</span>
                                    {pos.requirements}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DescriptionSection
