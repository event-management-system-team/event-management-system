import EventCard from "../common/EventCard";
import { Compass } from "lucide-react";

const EVENTS = [
    {
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1000",
        month: "AUG", date: "12", title: "Summer Music Fest 2026", location: "Grand Arena Stadium", price: "45.00", isLowStock: true
    },
    {
        image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1000",
        month: "SEP", date: "05", title: "AI & Tech Expo Global", location: "Convention Center", price: "120.00", isLowStock: false
    },
    {
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000",
        month: "OCT", date: "18", title: "Gourmet Food Trail", location: "Riverside Walk", price: "25.00", isLowStock: false
    },
    {
        image: "https://images.unsplash.com/photo-1560439514-4e9645039924?q=80&w=1000",
        month: "NOV", date: "02", title: "International Art Week", location: "Modern Art Gallery", price: "0.00", isLowStock: false
    },
];

const EventSection = () => {
    return (
        <section className="py-16 px-6 bg-[#F1F0E8]/30">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10">
                    <h2 className="text-3xl font-extrabold text-gray-900">Featured Events</h2>
                    <p className="text-gray-500 mt-2">The most popular experiences picked just for you</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {EVENTS.map((evt, idx) => (
                        <EventCard key={idx} {...evt} />
                    ))}
                </div>

                <div className="mt-12 flex justify-center">
                    <button className="group flex items-center gap-2 bg-white border-2 border-primary text-primary px-8 py-3 rounded-full font-bold hover:bg-primary hover:text-white transition-all shadow-sm">
                        View More Events
                        <Compass size={18} className="group-hover:rotate-90 transition-transform" />
                    </button>
                </div>
            </div>
        </section>
    );
};
export default EventSection;