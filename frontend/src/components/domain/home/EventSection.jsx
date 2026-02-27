import EventCard from "../../common/EventCard";
import { ChevronLeft, ChevronRight, Compass } from "lucide-react";
import { useFeaturedEvents } from '../../../hooks/useFeaturedEvents'
import LoadingState from '../../common/LoadingState'
import EmptyState from "../../common/EmptyState";
import { Link } from "react-router-dom"
import { useRef } from "react";

const EventSection = () => {

  const { data: featuredEvents, isLoading, isError } = useFeaturedEvents();

  const isEmpty = isError || !featuredEvents || featuredEvents.length === 0;

  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };


  return (
    <section className="py-16 px-6 bg-[#F1F0E8]/30 overflow-hidden pb-0">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold ">Featured Events</h2>
          <p className="text-gray-500 mt-2">The most popular experiences picked just for you</p>
        </div>

        {isLoading ? (
          <LoadingState className="h-[400px]" />
        )
          :
          isEmpty ? (
            <EmptyState className="h-[400px]" message="No featured events found" />
          )
            :
            (
              <div className="relative">
                <button
                  onClick={() => scroll('left')}
                  className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-10 bg-black/30 rounded-r-2xl items-center justify-center text-white hover:bg-black/60 transition-all duration-300 cursor-pointer"
                >
                  <ChevronLeft size={20} />
                </button>
                <div ref={scrollContainerRef}
                  className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-4 -mx-6 px-6 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {featuredEvents.map((event) => (
                    <div
                      key={event.eventId}
                      className="w-[85vw] sm:w-[320px] shrink-0 snap-start"
                    >
                      <EventCard key={event.eventId} {...event} />
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => scroll('right')}
                  className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-10 bg-black/30 rounded-l-2xl items-center justify-center text-white hover:bg-black/60 transition-all duration-300 cursor-pointer"
                >
                  <ChevronRight size={28} />
                </button>
              </div>
            )
        }

        <div className="mt-12 flex justify-center">
          <Link to={'/events'}>
            <button className="group flex items-center gap-2 bg-white border-2 border-primary text-primary px-8 py-3 rounded-full font-bold hover:bg-primary hover:text-white transition-all shadow-sm"
            >
              View More Events
              <Compass size={18} className="group-hover:rotate-90 transition-transform" />
            </button>
          </Link>

        </div>
      </div>
    </section >
  );
};
export default EventSection;
