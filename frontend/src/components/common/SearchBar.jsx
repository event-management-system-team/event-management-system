import { Search } from "lucide-react";


const SearchBar = () => {
    return (
        <>
            <div className="hidden lg:flex items-center bg-white/50  px-3 py-2 rounded-full border border-[#d8ddde] focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all cursor-text">
                <Search className=" text-gray-400 text-lg" />

                <input className="bg-transparent border-none outline-none focus:ring-0 text-sm ml-2 w-64 placeholder:text-gray-400"
                    placeholder="Search..."
                    type="text" />
            </div>
        </>

    )
}

export default SearchBar


