
import { useEffect, useState, useMemo } from 'react';
import CustomEventModal from '../../components/domain/staff/schedule/CustomEventModal';
import { configSchedule } from '../../config/schedule';
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react';
import { createEventModalPlugin } from '@schedule-x/event-modal';
import { createScrollControllerPlugin } from '@schedule-x/scroll-controller';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import 'temporal-polyfill/global';
import '@schedule-x/theme-default/dist/index.css';
import staffService from '../../services/staff.service';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import LoadingState from '../../components/common/LoadingState';
import EmptyState from '../../components/common/EmptyState';
import '../../styles/schedule.css'
import useNationalHolidays from '../../hooks/useNationalHolidays';
import { formatTime } from '../../../utils/formatTimeSchedule.utils'
import CustomHeaderRightAppend, { TOGGLE_EVENT_NAME } from '../../components/domain/staff/schedule/CustomHeaderRightAppend'

const MySchedulePage = () => {
    const { eventSlug } = useParams();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['workspace', eventSlug],
        queryFn: () => staffService.getWorkspace(eventSlug),
        enabled: !!eventSlug
    });

    const [showHolidays, setShowHolidays] = useState(false);

    useEffect(() => {
        const handleToggle = (e) => setShowHolidays(e.detail);
        window.addEventListener(TOGGLE_EVENT_NAME, handleToggle);
        return () => window.removeEventListener(TOGGLE_EVENT_NAME, handleToggle);
    }, []);

    const [eventsService] = useState(() => createEventsServicePlugin());
    const [scrollController] = useState(() => createScrollControllerPlugin({ initialScroll: '07:00' }));
    const [cal, setCal] = useState(null);

    const { rawHolidays } = useNationalHolidays()

    const formattedEvents = useMemo(() => {
        if (!data || !data.schedules) return [];

        return data.schedules.map(item => ({
            ...item,
            id: String(item.assignmentId),
            title: item.scheduleName || 'Undefined',
            start: formatTime(item.startTime),
            end: formatTime(item.endTime),
        }));
    }, [data]);

    const calendar = useCalendarApp({
        ...configSchedule,
        plugins: [
            createEventModalPlugin(),
            scrollController,
            eventsService
        ]
    });

    useEffect(() => {
        let displayEvents = [...formattedEvents];

        if (showHolidays) {
            displayEvents = [...displayEvents, ...rawHolidays];
        }

        eventsService.set(displayEvents);
    }, [formattedEvents, rawHolidays, showHolidays, eventsService]);

    useEffect(() => {
        setCal(calendar);
    }, [calendar]);

    const customComponents = useMemo(() => ({
        eventModal: CustomEventModal,
        headerContentRightAppend: CustomHeaderRightAppend
    }), []);

    if (isLoading) return <LoadingState />;
    if (isError || !data) return <EmptyState className='h-[600px]' />;

    return (
        <div className="flex-1 h-full w-full bg-slate-50/50 p-4 md:p-6 flex flex-col font-sans">
            <div className="flex-1 w-full h-full bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden sx-custom-calendar">
                <ScheduleXCalendar
                    calendarApp={calendar}
                    customComponents={customComponents}
                />
            </div>
        </div>
    );
};

export default MySchedulePage;