import { useEffect, useMemo, useState } from "react";
import { useTranslation } from 'react-i18next';
import organizerService from "../../../services/organizer.service";
import { TabsContent } from "../admin/Tabs";
import { CreateScheduleModal } from "./CreateScheduleModal.jsx";
import { configSchedule } from "../../../config/schedule";
import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createScrollControllerPlugin } from "@schedule-x/scroll-controller";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import "temporal-polyfill/global";
import "@schedule-x/theme-default/dist/index.css";
import CustomEventModal from "../staff/schedule/CustomEventModal.jsx";
import CustomHeaderRightAppend, {
    TOGGLE_EVENT_NAME,
} from "../staff/schedule/CustomHeaderRightAppend.jsx";
import useNationalHolidays from "../../../hooks/useNationalHolidays";
import { formatTime } from "../../../../utils/formatTimeSchedule.utils";
import "../../../styles/schedule.css";

const WorkScheduleTab = ({
    id,
    isScheduleModalOpen,
    closeScheduleModal,
    onLoading,
    onError,
    showAlert,
}) => {
    const { t } = useTranslation();
    const [assignments, setAssignments] = useState([]);
    const [showHolidays, setShowHolidays] = useState(false);
    const { rawHolidays } = useNationalHolidays();

    useEffect(() => {
        const handleToggle = (e) => setShowHolidays(e.detail);
        window.addEventListener(TOGGLE_EVENT_NAME, handleToggle);

        return () =>
            window.removeEventListener(TOGGLE_EVENT_NAME, handleToggle);
    }, []);

    const fetchAssignmentList = async () => {
        if (!id) return;

        try {
            onLoading(true);
            const response = await organizerService.getStaffAssignmentByRole(id);
            setAssignments(response.data);
        } catch (error) {
            console.error(error);
            onError(t('org_sch_load_error'));
        } finally {
            onLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignmentList();
    }, [id]);

    const [eventsService] = useState(() => createEventsServicePlugin());
    const [scrollController] = useState(() =>
        createScrollControllerPlugin({ initialScroll: "07:00" })
    );

    const formattedEvents = useMemo(() => {
        if (!assignments?.length) return [];

        return assignments.map((item) => ({
            ...item,
            id: String(item.assignmentId),
            title: `${item.scheduleName} (${item.staffRole} Team)`,
            start: formatTime(item.startTime),
            end: formatTime(item.endTime),
            location: item.location,
        }));
    }, [assignments]);

    const calendar = useCalendarApp({
        ...configSchedule,
        plugins: [
            createEventModalPlugin(),
            scrollController,
            eventsService,
        ],
    });

    useEffect(() => {
        let displayEvents = [...formattedEvents];

        if (showHolidays) {
            displayEvents = [...displayEvents, ...rawHolidays];
        }

        eventsService.set(displayEvents);
    }, [formattedEvents, rawHolidays, showHolidays, eventsService]);

    const handleScheduleCreated = async () => {
        await fetchAssignmentList();
    };

    const customComponents = useMemo(
        () => ({
            eventModal: CustomEventModal,
            headerContentRightAppend: CustomHeaderRightAppend,
        }),
        []
    );

    return (
        <>
            <TabsContent value="schedule" className="px-8 mt-2 h-[calc(100vh-230px)]">
                <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden font-sans">
                    <div className="flex-1 overflow-auto sx-custom-calendar px-4 py-4">
                        <ScheduleXCalendar
                            calendarApp={calendar}
                            customComponents={customComponents}
                        />
                    </div>
                </div>
            </TabsContent>

            <CreateScheduleModal
                eventId={id}
                isOpen={isScheduleModalOpen}
                onClose={closeScheduleModal}
                onCreated={handleScheduleCreated}
                onAlert={showAlert}
            />
        </>
    );
};

export default WorkScheduleTab;