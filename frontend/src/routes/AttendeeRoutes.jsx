import { Route, Routes } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";

import ProfilePage from "../pages/profile/ProfilePage";
import ApplicationForm from "../pages/attendee/ApplicationForm";

const AttendeeRoutes = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="recruitments/:eventSlug/apply-staff" element={<ApplicationForm />} />
            </Route>
        </Routes>
    );
};

export default AttendeeRoutes;
