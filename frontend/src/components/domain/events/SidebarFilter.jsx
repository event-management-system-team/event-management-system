import FilterCategory from "./FilterCategory";
import FilterPrice from "./FilterPrice";
import FilterDate from "./FilterDate";

const SidebarFilter = ({ date, setDate, categories, setCategories, price, setPrice, isFree, setIsFree, handleApply, handleReset }) => {

    return (
        <aside className="w-full lg:w-[320px] shrink-0">
            <div className="sticky top-20 bg-cream rounded-xl p-6 border-2 border-primary/20 shadow-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

                <FilterCategory
                    categories={categories}
                    setCategories={setCategories} />

                <FilterPrice
                    price={price}
                    setPrice={setPrice}
                    isFree={isFree}
                    setIsFree={setIsFree} />

                <FilterDate
                    date={date}
                    setDate={setDate} />

                <div className="flex gap-3">
                    <button
                        onClick={handleReset}
                        className="flex-1 py-3 bg-red-400 text-white font-bold rounded-lg hover:brightness-90 transition-all cursor-pointer">
                        Reset
                    </button>

                    <button
                        onClick={handleApply}
                        className="flex-2 py-3 bg-primary text-white font-bold rounded-lg hover:brightness-90 transition-all cursor-pointer">
                        Apply Filters
                    </button>
                </div>

            </div>
        </aside>
    );
};

export default SidebarFilter;