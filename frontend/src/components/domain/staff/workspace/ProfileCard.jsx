import { ShieldCheck } from 'lucide-react'

const ProfileCard = () => {
    return (
        <div className="w-full lg:w-4/12 bg-white rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group flex flex-col">
            <div className="absolute top-0 left-0 w-full h-28 bg-gradient-to-br from-[#5d727a] to-[#89a8b2] opacity-20"></div>
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative z-10">
                <div className="relative mb-4 mt-2">
                    <div className="size-24 2xl:size-28 rounded-[2rem] border-[4px] border-white overflow-hidden shadow-xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
                        <img alt="Profile" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 size-6 2xl:size-8 bg-[#4ECDC4] rounded-xl border-2 border-white flex items-center justify-center animate-bounce">
                        <div className="size-1.5 2xl:size-2 bg-white rounded-full"></div>
                    </div>
                </div>

                <h1 className="text-2xl 2xl:text-3xl font-black text-[#2C3E50] tracking-tight mb-2">Alex Johnson</h1>

                <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck size={18} className="text-[#89A8B2]" />
                    <span className="text-[#89A8B2] text-xs 2xl:text-sm font-bold uppercase tracking-wider">
                        Senior Event Coordinator
                    </span>
                </div>

                <span className="bg-[#89A8B2]/10 text-[#2C3E50] px-5 py-2 rounded-2xl text-[10px] 2xl:text-xs font-bold uppercase tracking-widest">
                    Official Staff
                </span>
            </div>
        </div>
    )
}

export default ProfileCard
