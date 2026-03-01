import { MapPin, ShoppingCart, Users } from "lucide-react";
import { Link } from "react-router-dom";

const EventCard = ({ startDate, totalCapacity, registeredCount, bannerUrl, eventName, category, location, isFree, minPrice, eventSlug }) => {

    const dateObj = new Date(startDate);
    const month = dateObj.toLocaleString('vi-VN', { month: 'short' });
    const day = dateObj.getDate();

    const isAlmostFull = totalCapacity > 0 && (totalCapacity - registeredCount <= 5);

    return (
        <Link className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 duration-300 flex flex-col"
            to={`/events/${eventSlug}`}>

            <div className="relative aspect-[4/3] overflow-hidden">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={bannerUrl}
                    alt={eventName} />

                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-center shadow-lg">
                    <span className="block text-xs font-bold text-primary uppercase">{month}</span>
                    <span className="block text-xl font-extrabold leading-none text-gray-900">{day}</span>
                </div>

                {category && (
                    <div
                        className="absolute bottom-4 left-4 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-lg"
                        style={{ backgroundColor: category.colorCode || '#3b82f6' }}
                    >
                        {category.categoryName}
                    </div>
                )}

                {isAlmostFull && (
                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-lg">
                        Low Stock
                    </div>
                )}
            </div>

            <div className="p-5 space-y-3 flex flex-col flex-1">
                <h3 className="text-lg font-bold leading-tight text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                    {eventName}
                </h3>

                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                    <MapPin size={14} />
                    {location}
                </div>

                <div className="flex-1">
                    {totalCapacity > 0 && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                            <Users size={14} className="shrink-0" />
                            <span>{registeredCount} / {totalCapacity} registered</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-2">
                    <div className="flex flex-col">

                        {isFree ? (
                            <span className="px-3 py-1 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm font-extrabold uppercase tracking-wider inline-block">FREE</span>
                        )
                            :
                            minPrice > 0 ? (
                                <span className="text-sm font-extrabold text-primary uppercase tracking-wider">
                                    From {minPrice.toLocaleString('vi-VN')}đ
                                </span>
                            )
                                : (
                                    <span className=" text-gray-500 text-sm font-extrabold uppercase italic">updating</span>
                                )

                        }
                    </div>
                    <button className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm">
                        <ShoppingCart size={18} />
                    </button>
                </div>
            </div>
        </Link>

    );
};
export default EventCard;