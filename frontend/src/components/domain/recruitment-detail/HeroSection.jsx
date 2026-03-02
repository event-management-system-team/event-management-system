import { ChevronRight, Users } from 'lucide-react';

const HeroSection = ({ eventBannerUrl, eventName, totalVacancy }) => {
    return (
        <section className="relative min-h-105 pt-12 pb-28 overflow-hidden">
            <div className="absolute inset-0 z-0">
                <img alt={eventName} className="w-full h-full object-cover" src={eventBannerUrl} />
                <div className="absolute inset-0 bg-linear-to-r from-[#2C3E50]/90 via-[#2C3E50]/70 to-transparent"></div>
                <div className="absolute inset-0 bg-black/40"></div>
            </div>
            <div className="max-w-300 mx-auto px-6 relative z-10">

                <div className="flex items-center gap-2 text-white/80 text-xs font-medium mb-8">
                    <a className="hover:text-white transition-colors" href="/">Home</a>
                    <ChevronRight size={14} />
                    <a className="hover:text-white transition-colors" href="/recruitments">Recruitments</a>
                    <ChevronRight size={14} />
                    <span className="text-white">{eventName}</span>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                    <div className="flex-1">
                        <p className="text-[#4ECDC4] font-bold tracking-[0.2em] text-[11px] uppercase mb-3">
                            RECRUITMENT IS NOW OPEN
                        </p>
                        <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.15]">
                            {eventName}
                        </h1>
                    </div>

                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl min-w-50 flex items-center justify-between gap-2">

                        <div className="flex items-center gap-3 text-white/90">
                            <Users size={24} className="shrink-0 text-[#4ECDC4]" />

                            <p className="text-[13px] font-semibold tracking-wider uppercase w-20 leading-snug">
                                TOTAL OPENINGS
                            </p>
                        </div>

                        <p className="text-[#FF6B35] text-5xl font-extrabold shrink-0 leading-none">
                            {totalVacancy}
                        </p>

                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection
