import { LayoutGrid } from "lucide-react"
import useCategories from '../../../hooks/useCategories';
import LoadingState from "../../common/LoadingState";
import EmptyState from "../../common/EmptyState";


const FilterCategory = ({ categories: initialCategories = [], setCategories }) => {

    const { categories, isLoading, isEmpty } = useCategories();

    const handleToggle = (isChecked, currentSlug) => {
        if (isChecked) {
            setCategories(initialCategories.filter(slug => slug !== currentSlug));
        } else {
            setCategories([...initialCategories, currentSlug]);
        }
    }

    return (
        <>

            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <LayoutGrid className="text-primary w-5 h-5" strokeWidth={2.5} />
                    <span className="font-bold text-sm">Categories</span>
                </div>

                {isLoading ? (
                    <LoadingState />
                ) : isEmpty ? (
                    <EmptyState />
                ) :
                    <div className="grid grid-cols-2 gap-y-3 gap-x-4">

                        {categories.map(cat => {

                            const isChecked = initialCategories.includes(cat.categorySlug)
                            return (
                                <label key={cat.categoryId} className="flex items-center gap-3 group cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary shrink-0"
                                        checked={isChecked}
                                        onChange={() => handleToggle(isChecked, cat.categorySlug)}
                                    />
                                    <span className="text-sm font-medium group-hover:text-primary transition-colors truncate">
                                        {cat.categoryName}
                                    </span>
                                </label>
                            )
                        })}
                    </div>
                }
            </div>


        </>
    )
}

export default FilterCategory
