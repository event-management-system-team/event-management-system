import { CalendarDays, ChevronRight, Clock, MapPin, Tag } from 'lucide-react'
import DynamicBreadcrumb from '../../common/DynamicBreadcrumb';

const HeroSection = ({ bannerUrl, location, eventName, startDate, endDate, category }) => {

    // 1. Hàm chỉ lấy Ngày 
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    // 2. Hàm chỉ lấy Giờ 
    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    const isSameDay = formatDate(startDate) === formatDate(endDate);

    return (
        <div>
            <section className="relative w-full h-125 bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center opacity-60"
                    style={{ backgroundImage: `url('${bannerUrl}')` }}
                ></div>
                <div className="absolute inset-0 bg-linear-to-b from-primary/40 to-background-dark/90"></div>
                <div className="relative max-w-300 mx-auto h-full px-6 flex flex-col justify-between py-10">

                    <DynamicBreadcrumb baseColor='!text-slate-300' activeColor='text-white' />

                    <div className="mb-10">
                        <div className="inline-flex items-center gap-2 bg-primary text-white px-4 py-1.5 rounded-full text-xs font-bold mb-4 uppercase tracking-wider"
                            style={{ backgroundColor: `${category.colorCode}` }}
                        >
                            <Tag className="w-4 h-4" />
                            {category.categoryName || 'Event'}
                        </div>

                        <h1 className="text-white text-4xl lg:text-6xl font-extrabold my-6 max-w-3xl text-balance">
                            {eventName}
                        </h1>


                        <div className="flex flex-wrap gap-x-8 gap-y-4 text-white/90 font-medium">

                            {/* Location*/}
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-primary" />
                                <span>{location}</span>
                            </div>

                            {/* Date */}
                            <div className="flex items-center gap-2">
                                <CalendarDays className="w-5 h-5 text-primary" />
                                <span>
                                    {isSameDay
                                        ? formatDate(startDate)
                                        : `${formatDate(startDate)} - ${formatDate(endDate)}`}
                                </span>
                            </div>

                            {/* Time */}
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-primary" />
                                <span>
                                    {formatTime(startDate)} - {formatTime(endDate)}
                                </span>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HeroSection
