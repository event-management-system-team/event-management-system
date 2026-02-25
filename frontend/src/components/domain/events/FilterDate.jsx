import { CalendarDays } from 'lucide-react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import useDateFilter from '../../../hooks/useDateFilter';

const FilterDate = ({ date, setDate }) => {

    const { DATE_FORMAT, dateValue, handleDateChange, handleQuickSelect } = useDateFilter(date, setDate)

    const getButtonClass = (targetDate) => {
        const isActive = date === targetDate;
        return isActive
            ? "py-1.5 px-3 rounded-full text-[11px] font-bold bg-primary text-white shadow-sm transition-all cursor-pointer border border-primary uppercase tracking-wide"
            : "py-1.5 px-3 rounded-full text-[11px] font-bold bg-gray-50 text-gray-500 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer border border-gray-200 uppercase tracking-wide";
    };

    return (
        <div className="mb-8">

            <div className="flex items-center gap-2 mb-4">
                <CalendarDays className="text-primary w-5 h-5" strokeWidth={2.5} />
                <span className="font-bold text-sm">Date</span>
            </div>

            <div className="px-1">
                <DatePicker
                    className="w-full py-2 cursor-pointer rounded-lg"
                    format={DATE_FORMAT}
                    value={dateValue}
                    onChange={handleDateChange}
                    placeholder="Any date"
                />
            </div>

            <div className="flex flex-wrap gap-2 mt-3 px-1">
                <button
                    onClick={() => handleQuickSelect('today')}
                    className={getButtonClass(dayjs().format(DATE_FORMAT))}
                >
                    Today
                </button>
                <button
                    onClick={() => handleQuickSelect('tomorrow')}
                    className={getButtonClass(dayjs().add(1, 'day').format(DATE_FORMAT))}
                >
                    Tomorrow
                </button>
                <button
                    onClick={() => handleQuickSelect('this_weekend')}
                    className={getButtonClass(dayjs().day(6).format(DATE_FORMAT))}
                >
                    This weekend
                </button>
            </div>
        </div>
    );
}

export default FilterDate;