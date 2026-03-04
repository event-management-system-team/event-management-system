import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";

import StaffLayout from "../components/layout/StaffLayout";
import StaffWorkspacePage from "../pages/staff/StaffWorkspace";
import MySchedulePage from "../pages/staff/MySchedule";
import ResourcesPage from "../pages/staff/Resources";

const StaffRoutes = () => {
    return (
        <Routes>
            <Route element={<StaffLayout />}>
                <Route element={<ProtectedRoute allowedRoles={["ATTENDEE"]} />}>
                    <Route path="/" element={<StaffWorkspacePage />} />
                    <Route path="/my-schedule" element={<MySchedulePage />} />
                    <Route path="/resource" element={<ResourcesPage />} />

                </Route>
            </Route>
        </Routes>
    );
};

export default StaffRoutes;
