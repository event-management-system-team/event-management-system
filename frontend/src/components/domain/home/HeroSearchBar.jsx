import { Search, MapPin, Calendar } from "lucide-react";
import { DatePicker, Select } from 'antd';
import { useLocation } from "../../../hooks/useLocation";
import useDateFilter from "../../../hooks/useDateFilter";
import useSearchEvents from "../../../hooks/useSearchEvents";

const HeroSearchBar = () => {

  const { data: locations, isLoading } = useLocation();

  const { keyword, setKeyword, location, setLocation, date, setDate, handleSearch, handleKeyDown } = useSearchEvents()

  const { DATE_FORMAT, dateValue, handleDateChange } = useDateFilter(date, setDate)

  return (
    <div className="bg-white rounded-full shadow-2xl p-1 md:p-2 flex items-center border border-gray-100 w-full overflow-hidden">

      {/* Keyword Input */}
      <div className="flex-1 flex items-center gap-1.5 md:gap-3 px-2 md:px-6 py-1 md:py-2 border-r border-gray-100 min-w-0">
        <Search className="text-primary shrink-0 w-4 h-4 md:w-5 md:h-5" />
        <div className="flex flex-col w-full min-w-0">
          <span className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">Keyword</span>
          <input className="bg-transparent border-none p-0 focus:ring-0 text-xs md:text-sm text-gray-700 w-full placeholder:text-gray-400 outline-none truncate"
            placeholder="Concerts..."
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown} />
        </div>
      </div>

      {/* Location Select */}
      <div className="flex-1 flex items-center gap-1.5 md:gap-3 px-2 md:px-6 py-1 md:py-2 border-r border-gray-100 min-w-0">
        <MapPin className="text-primary shrink-0 w-4 h-4 md:w-5 md:h-5" />
        <div className="flex flex-col w-full min-w-0">
          <span className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">Location</span>
          <Select className=" portal w-full px-0!"
            defaultValue=""
            variant="borderless"
            showSearch
            value={location}
            onChange={(value) => setLocation(value)}
            options={locations}
            loading={isLoading}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        </div>
      </div>

      {/* Date Select */}
      <div className="flex-1 flex items-center gap-1.5 md:gap-3 px-2 md:px-6 py-1 md:py-2 min-w-0">
        <Calendar className="text-primary shrink-0 w-4 h-4 md:w-5 md:h-5" />
        <div className="flex flex-col w-full min-w-0">
          <span className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">Timer</span>
          <DatePicker className="w-full px-0! bg-transparent shadow-none [&_input]:text-xs md:[&_input]:text-sm [&_input]:text-gray-700! [&_input::placeholder]:text-gray-400!"
            variant="borderless"
            value={dateValue}
            onChange={handleDateChange}
            placeholder="Any date"
            format={DATE_FORMAT} />
        </div>
      </div>

      {/* Button */}
      <button className="bg-primary hover:bg-primary/90 text-white w-10 h-10 md:w-auto md:px-6 md:h-12 rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer shrink-0 ml-1 md:ml-0"
        onClick={handleSearch}>
        <Search className="w-4 h-4 md:w-5 md:h-5" />
        <span className="hidden md:block">Find Events</span>
      </button>
    </div>
  )
}

export default HeroSearchBar
