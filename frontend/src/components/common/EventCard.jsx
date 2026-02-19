import { MapPin, ShoppingCart } from "lucide-react";

const EventCard = ({ image, month, date, title, location, price, isLowStock }) => {
    return (
        <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 duration-300">
            <div className="relative aspect-[4/3] overflow-hidden">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={image} alt={title} />

                {/* Date Badge */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-center shadow-lg">
                    <span className="block text-xs font-bold text-primary uppercase">{month}</span>
                    <span className="block text-xl font-extrabold leading-none text-gray-900">{date}</span>
                </div>

                {/* Status Badge */}
                {isLowStock && (
                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-lg">
                        Low Stock
                    </div>
                )}
            </div>

            <div className="p-5 space-y-3">
                <h3 className="text-lg font-bold leading-tight text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                    {title}
                </h3>

                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                    <MapPin size={14} />
                    {location}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-2">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">From</span>
                        <span className="text-lg font-extrabold text-primary">${price}</span>
                    </div>
                    <button className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm">
                        <ShoppingCart size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};
export default EventCard;