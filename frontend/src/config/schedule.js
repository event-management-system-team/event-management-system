import {
    viewDay,
    viewMonthAgenda,
    viewMonthGrid,
    viewWeek,
    viewList
} from '@schedule-x/calendar';
import 'temporal-polyfill/global';
import '@schedule-x/theme-default/dist/index.css';

export const configSchedule = {
    locale: 'vi-VN',
    timezone: 'Asia/Ho_Chi_Minh',
    firstDayOfWeek: 1,
    views: [viewMonthGrid, viewMonthAgenda, viewWeek, viewDay, viewList],
    defaultView: viewMonthGrid.name,

    weekOptions: {
        gridHeight: 1200,
        nDays: 7,
        eventWidth: 95,
        timeAxisFormatOptions: { hour: '2-digit', minute: '2-digit' },
        eventOverlap: true,
        gridStep: 60,
    },

    monthGridOptions: {
        nEventsPerDay: 4,
    },

    showWeekNumbers: false,
    isResponsive: true,
    skipValidation: true,

    callbacks: {
        isCalendarSmall($app) {
            return $app.elements.calendarWrapper?.clientWidth < 700;
        }
    }
};