import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";

import StaffLayout from "../components/layout/StaffLayout";
import StaffWorkspacePage from "../pages/staff/StaffWorkspace";
import MySchedulePage from "../pages/staff/MySchedule";
import ResourcesPage from "../pages/staff/Resources";
import ScanQRPage from "../pages/staff/ScanQRPage";
import AccessStaff from '../components/domain/staff/AccessStaff'

const StaffRoutes = () => {
    return (
        <Routes>
            <Route element={<StaffLayout />}>
                <Route element={<ProtectedRoute allowedRoles={["ATTENDEE"]} />}>
                    <Route element={<AccessStaff />} >
                        <Route path="/" element={<StaffWorkspacePage />} />
                        <Route path="/my-schedule" element={<MySchedulePage />} />
                        <Route path="/resource" element={<ResourcesPage />} />
                        <Route path="/scan-qr" element={<ScanQRPage />} />
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
};

export default StaffRoutes;
