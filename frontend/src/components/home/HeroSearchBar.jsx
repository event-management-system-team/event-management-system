import { Search, MapPin, Calendar } from "lucide-react";
import useEventSearch from '../../hooks/useEventSearch'
import { DatePicker, Select } from 'antd';
import dayjs from 'dayjs';
import { useLocation } from "../../hooks/useLocation";

const HeroSearchBar = () => {

    const { data: locations, isLoading } = useLocation();
    const { keyword, setKeyword, location, setLocation, date, setDate, handleSearch, handleKeyDown } = useEventSearch()

    const onChange = (dateString) => {
        setDate(dateString);
    };

    return (
        <div className="bg-white rounded-full shadow-2xl p-2 flex flex-col md:flex-row items-center gap-2 border border-gray-100">

            {/* Keyword Input */}
            <div className="flex-1 w-full px-6 py-2 flex items-center gap-3 md:border-r border-gray-100">
                <Search className="text-primary" size={20} />
                <div className="flex flex-col w-full">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Keyword</span>
                    <input className="bg-transparent border-none p-0 focus:ring-0 text-sm  text-gray-700 w-full placeholder:text-gray-400 outline-none"
                        placeholder="Concerts, Workshops..."
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={handleKeyDown} />
                </div>
            </div>

            {/* Location Select */}
            <div className="flex-1 w-full px-6 py-2 flex items-center gap-3 md:border-r border-gray-100">
                <MapPin className="text-primary" size={20} />
                <div className="flex flex-col w-full">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Location</span>

                    <Select className="w-full px-0!"
                        defaultValue=""
                        bordered={false}
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
            <div className="flex-1 w-full px-6 py-2 flex items-center gap-3 md:border-r border-gray-100">
                <Calendar className="text-primary" size={20} />

                <div className="flex flex-col w-full">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Timer</span>

                    <DatePicker className="w-full px-0! bg-transparent shadow-none [&_input]:text-gray-700! [&_input::placeholder]:text-gray-400!"
                        bordered={false}
                        value={date ? dayjs(date, 'DD/MM/YYYY') : null}
                        onChange={onChange}
                        placeholder="Any date"
                        format="DD/MM/YYYY" />

                </div>

            </div>


            {/* Button */}
            <button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white px-6 h-12 rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                onClick={handleSearch}>
                <Search size={20} />
                Find Events
            </button>
        </div>
    )
}

export default HeroSearchBar
