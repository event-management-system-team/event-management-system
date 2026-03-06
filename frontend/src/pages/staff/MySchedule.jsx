
import { useEffect, useState, useRef, useMemo } from 'react';
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

const formatTime = (timeStr) => {
    if (!timeStr) return null;
    const cleanTime = timeStr.substring(0, 16).replace(' ', 'T');
    const isoString = `${cleanTime}:00+07:00[Asia/Ho_Chi_Minh]`;
    return window.Temporal.ZonedDateTime.from(isoString);
};

const MySchedulePage = () => {
    const { eventSlug } = useParams();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['workspace', eventSlug],
        queryFn: () => staffService.getWorkspace(eventSlug),
        enabled: !!eventSlug
    });

    const [eventsService] = useState(() => createEventsServicePlugin());
    const [scrollController] = useState(() => createScrollControllerPlugin({ initialScroll: '07:00' }));
    const [cal, setCal] = useState(null);

    const formattedEvents = useMemo(() => {
        if (!data || !data.schedules) return [];

        return data.schedules.map(item => ({
            ...item,
            id: String(item.assignmentId),
            title: item.scheduleName || 'Chưa có tên',
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
        if (formattedEvents.length > 0) {
            eventsService.set(formattedEvents);
        }
    }, [formattedEvents, eventsService]);

    useEffect(() => {
        setCal(calendar);
    }, [calendar]);


    if (isLoading) return <LoadingState />;
    if (isError || !data) return <EmptyState className='h-[600px]' />;

    return (
        <div className="flex-1 h-full w-full bg-slate-50/50 p-4 md:p-6 flex flex-col font-sans">
            <div className="flex-1 w-full h-full bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden sx-custom-calendar">
                <ScheduleXCalendar
                    calendarApp={calendar}
                    customComponents={{
                        eventModal: CustomEventModal
                    }}
                />

                <style>{`
                    .sx-custom-calendar .sx-react-calendar-wrapper,
                    .sx-custom-calendar .sx__calendar-wrapper {
                        height: 100% !important;
                        width: 100% !important;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default MySchedulePage;