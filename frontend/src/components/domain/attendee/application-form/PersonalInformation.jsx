import { Lock } from "lucide-react"

const PersonalInformation = ({ userProfile }) => {
    return (
        <section>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <h2 className="text-xl font-bold border-l-4 border-[#89A8B2] pl-4">Personal Information</h2>
                <span className="text-xs text-[#6a777c] flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full font-medium w-fit">
                    <Lock size={12} /> Auto-filled from Profile
                </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-500">Full Name</label>
                    <input type="text" value={userProfile.fullName} readOnly className="rounded-[16px] border-transparent bg-slate-100 h-12 px-4 text-slate-700 font-medium cursor-not-allowed focus:outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-500">Email Address</label>
                    <input type="email" value={userProfile.email} readOnly className="rounded-[16px] border-transparent bg-slate-100 h-12 px-4 text-slate-700 font-medium cursor-not-allowed focus:outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-500">Phone Number</label>
                    <input type="text" value={userProfile.phone} readOnly className="rounded-[16px] border-transparent bg-slate-100 h-12 px-4 text-slate-700 font-medium cursor-not-allowed focus:outline-none" />
                </div>
            </div>
            <p className="text-xs text-[#6a777c] mt-3 ml-2">
                Need to update your info? <a href="/me" className="text-[#89A8B2] hover:underline font-bold transition-colors">Edit Profile</a>
            </p>
        </section>
    )
}

export default PersonalInformation
