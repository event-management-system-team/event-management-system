import { Search, MapPin } from "lucide-react";
import useEventSearch, { LOCATIONS } from "../../../hooks/useEventSearch";
import { Select } from "antd";
//import { useLocation } from "../../../hooks/useLocation";

const HeroSearchBar = () => {
  const {
    keyword,
    setKeyword,
    location,
    setLocation,
    handleSearch,
    handleKeyDown,
  } = useEventSearch();
  //const { data: locations, isLoading, isError } = useLocation();

  return (
    <div className="bg-white rounded-full shadow-2xl p-2 flex flex-col md:flex-row items-center gap-2 border border-gray-100">
      {/* Keyword Input */}
      <div className="flex-1 w-full px-6 py-2 flex items-center gap-3 md:border-r border-gray-100">
        <Search className="text-primary" size={20} />
        <div className="flex flex-col w-full">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Keyword
          </span>
          <input
            className="bg-transparent border-none p-0 focus:ring-0 text-sm font-bold text-gray-700 w-full placeholder:text-gray-400 outline-none"
            placeholder="Concerts, Workshops..."
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      {/* Location Select */}
      <div className="flex-1 w-full px-6 py-2 flex items-center gap-3 md:border-r border-gray-100">
        <MapPin className="text-primary" size={20} />
        <div className="flex flex-col w-full">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Location
          </span>
          <Select
            className="w-full -ml-3"
            defaultValue=""
            bordered={false}
            showSearch
            value={location}
            onChange={(value) => setLocation(value)}
            options={LOCATIONS}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </div>
      </div>

      {/* Button */}
      <button
        className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white px-8 h-12 rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-md"
        onClick={handleSearch}
      >
        <Search size={18} />
        Find Events
      </button>
    </div>
  );
};

export default HeroSearchBar;
