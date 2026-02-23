import { Search } from "lucide-react";
import useEventSearch from '../../hooks/useEventSearch'

const SearchBar = () => {

    const { keyword, setKeyword, handleSearch, handleKeyDown } = useEventSearch()
    return (
        <>
            <div className="hidden lg:flex items-center bg-white/50  px-3 py-2 rounded-full border border-[#d8ddde] focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all cursor-text">
                <button className="cursor-pointer">
                    <Search className=" text-gray-400 text-lg"
                        onClick={handleSearch} />
                </button>


                <input className="bg-transparent border-none outline-none focus:ring-0 text-sm ml-2 w-64 placeholder:text-gray-400 "
                    placeholder="Search..."
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={handleKeyDown} />
            </div>
        </>

    )
}

export default SearchBar


