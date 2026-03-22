import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";

import { AdminDashboard } from "../pages/admin/AdminDashboard.jsx";
import { AccountManagement } from "../pages/admin/AccountManagement.jsx";
import { AccountDetail } from "../pages/admin/AccountDetail.jsx";
import { EventManagement } from "../pages/admin/EventManagement.jsx";
import { EventDetail } from "../pages/admin/EventDetail.jsx";
import { EventAnalytics } from "../pages/admin/EventAnalytics.jsx";
import AdminLayout from "../components/layout/AdminLayout.jsx";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route element={<AdminLayout />}>

          {/* Dashboard */}
          <Route index element={<AdminDashboard />} />

          {/* Account Management */}
          <Route path="accounts" element={<AccountManagement />} />
          <Route
            path="accounts/account-detail/:id"
            element={<AccountDetail />}
          />

          {/* Event Management */}
          <Route path="events" element={<EventManagement />} />
          <Route path="events/event-detail/:slug" element={<EventDetail />} />

          {/* Event Analytics */}
          <Route path="analytics" element={<EventAnalytics />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
