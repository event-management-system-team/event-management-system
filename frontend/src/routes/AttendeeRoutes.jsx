import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";

import ApplicationForm from "../pages/attendee/ApplicationForm";

const AttendeeRoutes = () => {
    return (
        <Routes>
            <Route element={<ProtectedRoute allowedRoles={["ATTENDEE"]} />}>
                <Route path="recruitments/:eventSlug/apply-staff" element={<ApplicationForm />} />
            </Route>
        </Routes>
    );
};

export default AttendeeRoutes;
