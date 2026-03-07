import { CheckCircle2 } from 'lucide-react';

const SelectionRole = ({ recruitments, selectedRole, setSelectedRole }) => {
    return (
        <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <CheckCircle2 className="text-[#89A8B2]" size={20} />
                Which position are you applying for? <span className="text-red-500">*</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recruitments.map(pos => {
                    const isPosFull = pos.availableSlots <= 0;
                    return (
                        <label
                            key={pos.recruitmentId}
                            className={`relative flex items-center justify-center p-4 rounded-xl border-2 transition-all
                                                    ${isPosFull ? 'opacity-50 cursor-not-allowed bg-slate-100 border-slate-200' : 'cursor-pointer'}
                                                    ${selectedRole === pos.recruitmentId
                                    ? 'border-[#89A8B2] bg-[#89A8B2]/10 text-[#89A8B2] font-bold'
                                    : !isPosFull && 'border-[#d8ddde] hover:border-[#89A8B2]/50'
                                }`}
                        >
                            <input
                                type="radio"
                                name="roleSelection"
                                value={pos.recruitmentId}
                                className="hidden"
                                disabled={isPosFull}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                required
                            />
                            <div className="text-center">
                                <span className="block">{pos.positionName}</span>
                                {isPosFull && <span className="text-[10px] text-red-500 font-bold uppercase mt-1 block">Fully Booked</span>}
                            </div>
                        </label>
                    );
                })}
            </div>
        </section>
    )
}

export default SelectionRole
