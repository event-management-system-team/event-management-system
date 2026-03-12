import Holidays from 'date-holidays';
import { useMemo } from 'react';
import { formatTime } from '../../utils/formatTimeSchedule.utils'

const useNationalHolidays = () => {
    const rawHolidays = useMemo(() => {
        const hd = new Holidays('VN');
        const currentYear = new Date().getFullYear();
        const combinedHolidays = [...hd.getHolidays(currentYear), ...hd.getHolidays(currentYear + 1)];

        return combinedHolidays
            .filter(h => h.type === 'public')
            .map((holiday, index) => {
                const dateStr = holiday.date.substring(0, 10);
                return {
                    id: `holiday-${dateStr}-${index}`,
                    title: `${holiday.name}`,
                    start: formatTime(`${dateStr} 00:00`),
                    end: formatTime(`${dateStr} 23:59`),
                    location: 'National Holiday'
                };
            });
    }, []);

    return { rawHolidays };
};

export default useNationalHolidays;