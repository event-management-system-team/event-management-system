import {
  Monitor, Music, GraduationCap, Trophy, Palette,
  Briefcase, Utensils, Plane, HeartPulse, Users, LayoutGrid,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import EmptyState from '../../common/EmptyState'
import LoadingState from '../../common/LoadingState'
import useCategories from '../../../hooks/useCategories';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { useRef } from 'react';


const IconMap = {
  Monitor: <Monitor size={32} />,
  Music: <Music size={32} />,
  GraduationCap: <GraduationCap size={32} />,
  Trophy: <Trophy size={32} />,
  Palette: <Palette size={32} />,
  Briefcase: <Briefcase size={32} />,
  Utensils: <Utensils size={32} />,
  Plane: <Plane size={32} />,
  HeartPulse: <HeartPulse size={32} />,
  Users: <Users size={32} />
}


const CategorySection = () => {

  const { categories, isLoading, isEmpty } = useCategories();

  const navigate = useNavigate();

  const searchByCategory = (category) => {
    const queryString = createSearchParams({ categories: category }).toString()
    navigate(`/events?${queryString}`)
  }

  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 350;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-12 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className=" mb-5">
          <h2 className="text-3xl font-extrabold ">Browse by Category</h2>
        </div>

        <div className="hidden md:flex gap-3">


        </div>

        {isLoading ? (
          <LoadingState className="h-[200px]" />
        )
          : isEmpty ? (
            <EmptyState className="h-[200px]" message="No categories found" />
          )
            :
            <div className="relative">
              <button
                onClick={() => scroll('left')}
                className="flex absolute left-0 top-[40%] -translate-y-1/2 translate-x-2 z-9 w-8 h-8 bg-white/30 backdrop-blur-md rounded-full shadow-sm border border-white/40 items-center justify-center text-gray-500 hover:bg-white/60 hover:text-gray-700 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <ChevronLeft size={15} />
              </button>

              <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scrollbar-hide pt-5"
                ref={scrollContainerRef}>
                {categories.map((cat) => (
                  <button key={cat.categoryId}
                    onClick={() => searchByCategory(cat.categorySlug)}>
                    <div className="flex-shrink-0 w-32 snap-start group flex flex-col items-center gap-4 cursor-pointer">
                      <div className="size-20 bg-[#F1F0E8] rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:-translate-y-2 transition-all duration-300 shadow-sm">

                        {IconMap[cat.iconUrl] || <LayoutGrid size={32} />}

                      </div>
                      <span className="font-bold text-gray-700 group-hover:text-primary transition-colors text-center">
                        {cat.categoryName}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => scroll('right')}
                className="flex absolute right-0 top-[40%] -translate-y-1/2 translate-x-2  z-9 w-8 h-8 bg-white/30 backdrop-blur-md rounded-full shadow-sm border border-white/40 items-center justify-center text-gray-500 hover:bg-white/60 hover:text-gray-700 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <ChevronRight size={15} />
              </button>
            </div>
        }
      </div>
    </section >
  );
};
export default CategorySection;
