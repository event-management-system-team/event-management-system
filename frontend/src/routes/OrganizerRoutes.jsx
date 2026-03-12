import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import OrganizerLayout from "../components/layout/OrganizerLayout";

import OrganizerDashboardPage from "../pages/organizer/OrganizerDashboardPage";
import MyEventsPage from "../pages/organizer/MyEventsPage";
import CreateEventPage from "../pages/organizer/CreateEventPage";
import EventDetailDashboard from "../pages/organizer/EventDetailDashboard";
import EventAttendeesPage from "../pages/organizer/EventAttendeesPage";

import FeedbackList from "../pages/organizer/FeedbackList";
import FeedbackBuilder from "../pages/organizer/FeedbackBuilder";
import FeedbackDetail from "../pages/organizer/FeedbackDetail";
import RecruitmentList from "../pages/organizer/RecruitmentList";
import RecruitmentBuilder from "../pages/organizer/RecruitmentBuilder";
import ApplicationList from "../pages/organizer/ApplicationList";
import RecruitmentDetail from "../pages/organizer/RecruitmentDetail";
import StaffManagement from "../pages/organizer/StaffManagement";

const OrganizerRoutes = () => {
    return (
        <Routes>
            <Route element={<ProtectedRoute allowedRoles={["ORGANIZER"]} />}>
                <Route element={<OrganizerLayout />}>
                    <Route path="dashboard" element={<OrganizerDashboardPage />} />
                    <Route path="my-events" element={<MyEventsPage />} />
                    <Route path="create-event" element={<CreateEventPage />} />
                    <Route path="events/:eventId" element={<EventDetailDashboard />} />
                    <Route path="events/:eventId/attendees" element={<EventAttendeesPage />} />

                    {/* Events */}
                    <Route path="my-events" element={<MyEventsPage />} />
                    <Route path="create-event" element={<CreateEventPage />} />
                    <Route path="edit-event/:eventId" element={<CreateEventPage />} />

                    {/* Feedback */}
                    <Route path="feedback/feedbacklist/:eventId" element={<FeedbackList />} />
                    <Route path="feedback/createform/:eventId" element={<FeedbackBuilder />} />
                    <Route path="feedback/:feedbackId" element={<FeedbackDetail />} />

                    {/* Recruitment */}
                    <Route path="recruitmentlist/:eventId" element={<RecruitmentList />} />
                    <Route path="recruitmentcreate/:eventId" element={<RecruitmentBuilder />} />
                    <Route path="applications/:recruitmentId" element={<ApplicationList />} />
                    <Route path="recruitments/:recruitmentId" element={<RecruitmentDetail />} />

                    {/* Staff */}
                    <Route path=":id/staff" element={<StaffManagement />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default OrganizerRoutes;
