import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import OrganizerLayout from "../components/layout/OrganizerLayout";

import OrganizerDashboardPage from "../pages/organizer/OrganizerDashboardPage";
import MyEventsPage from "../pages/organizer/MyEventsPage";
import CreateEventPage from "../pages/organizer/CreateEventPage";

const OrganizerRoutes = () => {
    return (
        <Routes>
            <Route element={<ProtectedRoute allowedRoles={["ORGANIZER"]} />}>
                <Route element={<OrganizerLayout />}>
                    <Route path="/dashboard" element={<OrganizerDashboardPage />} />
                    <Route path="/my-events" element={<MyEventsPage />} />
                    <Route path="/create-event" element={<CreateEventPage />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default OrganizerRoutes;
