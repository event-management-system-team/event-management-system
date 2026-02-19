import { Search, MapPin, Calendar, ArrowRight, Flame } from "lucide-react";

const HeroSection = () => {
    return (
        <section className="relative pt-4 pb-12 px-6">
            <div className="max-w-7xl mx-auto">

                {/* 1. BANNER CHÍNH */}
                <div className="relative min-h-[560px] rounded-3xl overflow-hidden flex items-end p-10 lg:p-16">

                    {/* Background Image & Overlay */}
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                        style={{
                            backgroundImage: 'url("https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop")',
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
                            Experience the <br /> Unforgettable
                        </h1>

                        <div className="text-white/90 text-lg font-medium flex items-center gap-4">
                            <span className="flex items-center gap-2">
                                <Calendar className="text-orange-400" size={20} /> July 15, 2026
                            </span>~
                            <span className="w-1.5 h-1.5 bg-white/50 rounded-full"></span>~
                            <span className="flex items-center gap-2">
                                <MapPin className="text-orange-400" size={20} /> Stadium Arena
                            </span>
                        </div>

                        <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg shadow-orange-500/30 transition-all flex items-center gap-2 transform hover:-translate-y-1">
                            Book Tickets Now
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>

                {/* 2. SEARCH BAR (Nổi lên trên) */}
                <div className="relative -mt-12 z-20 mx-auto max-w-5xl px-4">
                    <div className="bg-white rounded-full shadow-2xl p-2 flex flex-col md:flex-row items-center gap-2 border border-gray-100">

                        {/* Keyword Input */}
                        <div className="flex-1 w-full px-6 py-2 flex items-center gap-3 md:border-r border-gray-100">
                            <Search className="text-primary" size={20} />
                            <div className="flex flex-col w-full">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Keyword</span>
                                <input className="bg-transparent border-none p-0 focus:ring-0 text-sm font-bold text-gray-700 w-full placeholder:text-gray-400 outline-none" placeholder="Concerts, Workshops..." type="text" />
                            </div>
                        </div>

                        {/* Location Select */}
                        <div className="flex-1 w-full px-6 py-2 flex items-center gap-3 md:border-r border-gray-100">
                            <MapPin className="text-primary" size={20} />
                            <div className="flex flex-col w-full">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Location</span>
                                <select className="bg-transparent border-none p-0 focus:ring-0 text-sm font-bold text-gray-700 w-full cursor-pointer outline-none">
                                    <option>Ho Chi Minh City</option>
                                    <option>Ha Noi</option>
                                    <option>Da Nang</option>
                                </select>
                            </div>
                        </div>

                        {/* Button */}
                        <button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white px-8 h-12 rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-md">
                            <Search size={18} />
                            Find Events
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};
export default HeroSection;