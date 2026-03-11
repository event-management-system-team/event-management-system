import { useEffect, useState } from "react";
import organizerService from "../../../services/organizer.service";
import { TabsContent } from "../admin/Tabs";
import { CreateScheduleModal } from "./CreateScheduleModal.jsx";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);
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

const WorkScheduleTab = ({ id, isScheduleModalOpen, closeScheduleModal, onLoading, onError, showAlert }) => {

    const [assignments, setAssignments] = useState([]);

    const fetchAssignmentList = async () => {
        if (!id) return

        try {
            onLoading(true)
            const response = await organizerService.getStaffAssignmentByRole(id)
            setAssignments(response.data)
        } catch (error) {
            onError('Cannot load assignment list')
            console.error(error)
        } finally {
            onLoading(false)
        }
    }

    useEffect(() => {
        fetchAssignmentList()
    }, [id])

    const eventsService = useState(() => createEventsServicePlugin())[0]

    const tz = "Asia/Ho_Chi_Minh";

    const parseBackendTime = (time) => {
        const plain = Temporal.PlainDateTime.from(time);
        return plain.toZonedDateTime("Asia/Ho_Chi_Minh");
    };
    const calendar = useCalendarApp({
        timeZone: "Asia/Ho_Chi_Minh",
        views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
        plugins: [eventsService]
    })

    useEffect(() => {
        if (!assignments.length) return

        const events = assignments.map(a => ({
            // id: a.assignmentId,
            title: `${a.scheduleName} (${a.staffRole} Team)`,
            start: parseBackendTime(a.startTime),
            end: parseBackendTime(a.endTime),
            location: a.location
        }))

        // eventsService.set(events)
        calendar.events.set(events);

        // console.log(assignments[0])
        // console.log(parseBackendTime(assignments[0].startTime))
        // console.log(parseBackendTime(assignments[0].startTime).toString())
        // console.log(parseBackendTime("2026-03-06T08:00:00").toString())
        // console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)
    }, [assignments])

    const handleScheduleCreated = async () => {
        await fetchAssignmentList()
    }

    return (
        <>
            <TabsContent value="schedule" className="space-y-4">
                <ScheduleXCalendar
                    calendarApp={calendar}
                />
            </TabsContent>

            {/* Create Schedule Modal */}
            <CreateScheduleModal
                eventId={id}
                isOpen={isScheduleModalOpen}
                onClose={closeScheduleModal}
                onCreated={handleScheduleCreated}
                onAlert={showAlert}
            />
        </>
    )
};

export default WorkScheduleTab;