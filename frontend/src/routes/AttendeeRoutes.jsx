import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";

import ApplicationForm from "../pages/attendee/ApplicationForm";
import MyApplication from "../pages/attendee/MyApplication";
import MainLayout from "../components/layout/MainLayout";
import SubmitFeedback from "../pages/attendee/SubmitFeedback";


const AttendeeRoutes = () => {
    return (

        <Routes>
            <Route element={<MainLayout />}>
                <Route element={<ProtectedRoute allowedRoles={["ATTENDEE"]} />}>
                    <Route path="recruitments/:eventSlug/apply-staff" element={<ApplicationForm />} />
                    <Route path="applications/" element={<MyApplication />} />
                    <Route path="/submit-feedback/:eventId" element={<SubmitFeedback />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default AttendeeRoutes;
