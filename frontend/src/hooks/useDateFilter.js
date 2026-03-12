import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const useDateFilter = (date, setDate) => {
    const DATE_FORMAT = 'DD/MM/YYYY';

    const dateValue = date ? dayjs(date, DATE_FORMAT) : null;

    const handleDateChange = (dateObj, dateString) => {
        setDate(dateString);
    };

    const handleQuickSelect = (type) => {
        let newDate;
        switch (type) {
            case 'today':
                newDate = dayjs();
                break;
            case 'tomorrow':
                newDate = dayjs().add(1, 'day');
                break;
            case 'this_weekend':
                newDate = dayjs().day(6);
                break;
            default:
                newDate = null;
        }

        if (newDate && newDate.format(DATE_FORMAT) === date) {
            setDate('');
        } else if (newDate) {
            setDate(newDate.format(DATE_FORMAT));
        }
    };

    return {
        DATE_FORMAT,
        dateValue,
        handleDateChange,
        handleQuickSelect
    };
};

export default useDateFilter;