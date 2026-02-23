import HeroSlider from "./HeroSlider";
import HeroSearchBar from "./HeroSearchBar";
import { useHotEvents } from "../../../hooks/useHotEvents";
import LoadingState from "../../common/LoadingState";
import EmptyState from "../../common/EmptyState";

const HeroSection = () => {
  const { data: hotEvents, isLoading, isError } = useHotEvents();

  const isEmpty = isError || !hotEvents || hotEvents.length === 0;

  return (
    <section className="relative pt-4 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {isLoading ? (
          <LoadingState className="h-[560px]" />
        ) : isEmpty ? (
          <EmptyState className="h-[560px]" />
        ) : (
          <HeroSlider events={hotEvents} />
        )}

        <div className="relative -mt-12 z-20 mx-auto max-w-5xl px-4">
          <HeroSearchBar />
        </div>
      </div>
    </section>
  );
};
export default HeroSection;
