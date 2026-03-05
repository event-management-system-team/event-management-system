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
import { useParams } from 'react-router'
import { organizerService } from '../../services/organizer.service'

function TestCalendar() {
    const { id } = useParams();
    const [assignments, setAssignments] = useState([]);
    const eventsService = useState(() => createEventsServicePlugin())[0]
    const tz = 'Asia/Bangkok'

    const calendar = useCalendarApp({
        views: [
            createViewDay(),
            createViewWeek(),
            createViewMonthGrid(),
            createViewMonthAgenda()
        ],
        plugins: [eventsService]
    })

    const fetchAssignmentList = async () => {
        if (!id) return

        try {
            const response = await organizerService.getStaffAssignment(id)
            setAssignments(response.data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchAssignmentList()
    }, [id]);

    // const calendar = useCalendarApp({
    //     views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    //     events: [
    //         {
    //             id: '1',
    //             title: 'Advanced algebra - Checkin Team',
    //             start: Temporal.ZonedDateTime.from('2026-03-05T01:00:00+07:00[Asia/Bangkok]'),
    //             end: Temporal.ZonedDateTime.from('2026-03-05T03:00:00+07:00[Asia/Bangkok]'),
    //             location: 'The grand lecture hall',
    //         }
    //     ],

    //     plugins: [eventsService]
    // })

    useEffect(() => {
        if (!assignments.length) return

        const events = assignments.map(a => ({
            id: a.assignmentId,
            title: `${a.scheduleName} (${a.staffRole} Team)`,
            start: Temporal.PlainDateTime.from(a.startTime).toZonedDateTime(tz),
            end: Temporal.PlainDateTime.from(a.endTime).toZonedDateTime(tz),
            location: a.location
        }))

        eventsService.set(events)

    }, [assignments])

    return (
        <div>
            <ScheduleXCalendar calendarApp={calendar} />
        </div>
    )
}

export default TestCalendar