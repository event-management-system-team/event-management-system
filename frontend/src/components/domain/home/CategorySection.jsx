import {
  Monitor,
  Music,
  GraduationCap,
  Trophy,
  Palette,
  Briefcase,
  Utensils,
  Plane,
  HeartPulse,
  Users,
  LayoutGrid,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../../store/slices/category.slice";
import { useEffect } from "react";
import EmptyState from "../../common/EmptyState";
import LoadingState from "../../common/LoadingState";

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
  Users: <Users size={32} />,
};

const CategorySection = () => {
  const dispatch = useDispatch();
  const { categories, isLoading, isError } = useSelector(
    (state) => state.category,
  );

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  const isEmpty = isError || !categories || categories.length === 0;

  return (
    <section className="py-12 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className=" mb-5">
          <h2 className="text-3xl font-extrabold ">Browse by Category</h2>
        </div>

        {isLoading ? (
          <LoadingState className="h-[200px]" />
        ) : isEmpty ? (
          <EmptyState className="h-[200px]" message="No categories found" />
        ) : (
          <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scrollbar-hide pt-5">
            {categories.map((cat) => (
              <div
                key={cat.categoryId}
                className="flex-shrink-0 w-32 snap-start group flex flex-col items-center gap-4 cursor-pointer"
              >
                <div className="size-20 bg-[#F1F0E8] rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:-translate-y-2 transition-all duration-300 shadow-sm">
                  {IconMap[cat.iconUrl] || <LayoutGrid size={32} />}
                </div>
                <span className="font-bold text-gray-700 group-hover:text-primary transition-colors text-center">
                  {cat.categoryName}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
export default CategorySection;
