import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
    createViewDay,
    createViewMonthAgenda,
    createViewMonthGrid,
    createViewWeek,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import 'temporal-polyfill/global'
import '@schedule-x/theme-default/dist/index.css'
import { useEffect, useState } from 'react'

function TestCalendar() {
    const eventsService = useState(() => createEventsServicePlugin())[0]
    const tz = 'Asia/Bangkok'

    const calendar = useCalendarApp({
        views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
        events: [
            {
                id: '1',
                title: 'Advanced algebra - Checkin Team',
                start: Temporal.ZonedDateTime.from('2026-03-05T01:00:00+07:00[Asia/Bangkok]'),
                end: Temporal.ZonedDateTime.from('2026-03-05T03:00:00+07:00[Asia/Bangkok]'),
                location: 'The grand lecture hall',
            }
        ],

        plugins: [eventsService]
    })

    useEffect(() => {
        // get all events
        eventsService.getAll()
    }, [])

    return (
        <div>
            <ScheduleXCalendar calendarApp={calendar} />
        </div>
    )
}

export default TestCalendar