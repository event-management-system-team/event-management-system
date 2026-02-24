import { CalendarDays, LayoutGrid, Wallet } from "lucide-react";

const SidebarFilter = () => {

    // { category, setCategory, price, setPrice, handleSearch }
    const categoriesList = [
        { id: 'music', name: 'Music' },
        { id: 'workshops', name: 'Workshops' },
        { id: 'tech', name: 'Tech' },
        { id: 'sports', name: 'Sports' }
    ];

    return (
        <aside className="w-full lg:w-[320px] shrink-0">
            <div className="sticky top-20 bg-cream rounded-xl p-6 border-2 border-primary/20 shadow-sm max-h-[calc(100vh-6rem)] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold">Filters</h3>
                </div>

                {/* Danh mục (Đã chia 2 cột) */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <LayoutGrid className="text-primary w-5 h-5" strokeWidth={2.5} />
                        <span className="font-bold text-sm">Categories</span>
                    </div>

                    {/* Dùng grid grid-cols-2 để chia đều 2 bên */}
                    <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                        {categoriesList.map(cat => (
                            <label key={cat.id} className="flex items-center gap-3 group cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary shrink-0"
                                // checked={category === cat.id}
                                // onChange={() => setCategory(cat.id)}
                                />
                                <span className="text-sm font-medium group-hover:text-primary transition-colors truncate">
                                    {cat.name}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Kéo thả Giá tiền */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Wallet className="text-primary w-5 h-5" strokeWidth={2.5} />
                        <span className="font-bold text-sm">Price Range</span>
                    </div>
                    <div className="px-2">
                        <input
                            type="range"
                            min="0" max="5000000" step="50000"
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent-orange"
                        // value={price || 5000000}
                        // onChange={(e) => setPrice(e.target.value)}
                        />
                        <div className="flex justify-between mt-4">
                            <span className="text-xs font-bold text-gray-500">0đ</span>
                            <span className="text-xs font-bold text-primary">
                                {/* {price ? `${Number(price).toLocaleString('vi-VN')}đ` : 'Any'} */}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Ngày tháng */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <CalendarDays className="text-primary w-5 h-5" strokeWidth={2.5} />
                        <span className="font-bold text-sm">Date</span>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                        <button className="py-2 px-3 text-left rounded-lg text-sm font-medium bg-white hover:bg-primary/10 hover:text-primary transition-all cursor-pointer">Today</button>
                        <button className="py-2 px-3 text-left rounded-lg text-sm font-medium bg-white hover:bg-primary/10 hover:text-primary transition-all cursor-pointer">This Weekend</button>
                        <button className="py-2 px-3 text-left rounded-lg text-sm font-medium bg-primary/20 text-primary ring-1 ring-primary/30 cursor-pointer">Next Month</button>
                    </div>
                </div>


                <div className="flex gap-3">
                    <button
                        // onClick={handleReset} 
                        className="flex-1 py-3 bg-red-400 text-white font-bold rounded-lg hover:brightness-90 transition-all cursor-pointer">
                        Reset
                    </button>

                    <button
                        // onClick={handleSearch}
                        className="flex-2 py-3 bg-primary text-white font-bold rounded-lg hover:brightness-90 transition-all cursor-pointer">
                        Apply Filters
                    </button>
                </div>

            </div>
        </aside>
    );
};

export default SidebarFilter;