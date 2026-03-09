import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";

import { AdminDashboard } from "../pages/admin/AdminDashboard.jsx";
import { AccountManagement } from "../pages/admin/AccountManagement.jsx";
import { AccountDetail } from "../pages/admin/AccountDetail.jsx";
import { EventManagement } from "../pages/admin/EventManagement.jsx";
import { EventDetail } from "../pages/admin/EventDetail.jsx";
import { EventAnalytics } from "../pages/admin/EventAnalytics.jsx";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route index element={<AdminDashboard />} />
        <Route path="accounts" element={<AccountManagement />} />
        <Route
          path="accounts/account-detail/:id"
          element={<AccountDetail />}
        />
        <Route path="events" element={<EventManagement />} />
        <Route path="events/event-detail/:id" element={<EventDetail />} />
        <Route path="analytics" element={<EventAnalytics />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
