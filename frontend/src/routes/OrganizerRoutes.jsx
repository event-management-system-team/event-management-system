import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import OrganizerLayout from "../components/layout/OrganizerLayout";


import MyEventsPage from "../pages/organizer/MyEventsPage";
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
                    <Route path="/my-events" element={<MyEventsPage />} />
                    {/* <Route path="/create-event" element={<CreateEventPage />} /> */}
                    <Route path="/feedback/feedbacklist/:eventId" element={<FeedbackList />} />
                    <Route path="/feedback/createform/:eventId" element={<FeedbackBuilder />} />
                    <Route path="/feedback/:feedbackId" element={<FeedbackDetail />} />
                    <Route path="/recruitmentlist/:eventId" element={<RecruitmentList />} />
                    <Route path="/recruitmentcreate/:eventId" element={<RecruitmentBuilder />} />
                    <Route path="/applications/:recruitmentId" element={<ApplicationList />} />
                    <Route path="/recruitments/:recruitmentId" element={<RecruitmentDetail />} />
                    <Route path="/:id/staff" element={<StaffManagement />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default OrganizerRoutes;