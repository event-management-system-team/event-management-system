import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";

import StaffLayout from "../components/layout/StaffLayout";
import StaffWorkspacePage from "../pages/staff/StaffWorkspace";

const StaffRoutes = () => {
    return (
        <Routes>
            <Route element={<StaffLayout />}>
                <Route element={<ProtectedRoute allowedRoles={["ATTENDEE"]} />}>
                    <Route path="/" element={<StaffWorkspacePage />} />

                </Route>
            </Route>
        </Routes>
    );
};

export default StaffRoutes;
