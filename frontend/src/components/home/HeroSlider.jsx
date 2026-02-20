import { MapPin, Calendar, ArrowRight, Flame } from "lucide-react";
import { Carousel } from 'antd';

const HeroSlider = ({ events }) => {

    const formatDate = (dateString) => {
        if (!dateString) return 'Updating';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="rounded-3xl overflow-hidden shadow-2xl relative">

            <Carousel
                autoplay
                autoplaySpeed={4000}
                effect="fade">
                {events.map((event) => (
                    <div key={event.eventId} className="outline-none">
                        <div className="relative min-h-[560px] rounded-3xl overflow-hidden flex items-end p-10 lg:p-16">

                            {/* Background Image & Overlay */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                                style={{
                                    backgroundImage: `url("${event.bannerUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070'}")`,
                                }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            </div>

                            {/* Content */}
                            <div className="relative z-10 max-w-2xl space-y-6">
                                <div className="inline-flex items-center gap-2 bg-orange-500/90 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                                    <Flame size={14} fill="currentColor" />
                                    Hot Event
                                </div>

                                <h1 className="text-white text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight">
                                    {event.eventName}
                                </h1>

                                <div className="text-white/90 text-lg font-medium flex items-center gap-4">
                                    <span className="flex items-center gap-2">
                                        <Calendar className="text-orange-400" size={20} />
                                        {formatDate(event.startDate)}
                                    </span>
                                    <span className="w-1.5 h-1.5 bg-white/50 rounded-full"></span>
                                    <span className="flex items-center gap-2">
                                        <MapPin className="text-orange-400" size={20} />
                                        {event.location || "Updating"}
                                    </span>
                                </div>

                                <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg shadow-orange-500/30 transition-all flex items-center gap-2 transform hover:-translate-y-1">
                                    Book Tickets Now
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}



            </Carousel>

        </div>

    )
}

export default HeroSlider
