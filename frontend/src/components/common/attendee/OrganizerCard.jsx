import { BadgeCheck, Star } from 'lucide-react'

const OrganizerCard = ({ events }) => {
    return (
        <div className="bg-white p-6 rounded-3xl border border-[#E5E1DA]">
            <h5 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Organizer</h5>
            <div className="flex items-center gap-4">

                {events?.organizer?.avatarUrl ? (
                    <img
                        src={events.organizer.avatarUrl}
                        alt={events.organizer.fullName}
                        className="size-12 rounded-xl object-cover"
                    />
                ) : (
                    <div className="size-12 rounded-xl bg-slate-100 flex items-center justify-center">
                        <Star className="w-6 h-6 text-primary fill-primary/20" />
                    </div>
                )}

                <div>
                    <div className="flex items-center gap-1.5">
                        <p className="font-bold">{events?.organizer?.fullName || 'Updating'}</p>
                        <BadgeCheck size={18} className="text-blue-500" />
                    </div>
                    <p className="text-xs text-primary ">{events?.organizer?.email}</p>
                </div>
            </div>
        </div>
    )
}

export default OrganizerCard
