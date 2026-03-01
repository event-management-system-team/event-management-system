import React from "react";
import { Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { ProfileCard } from "./components/domain/profile/ProfileCard";

import { AdminDashboard } from "./pages/admin/AdminDashboard.jsx";
import { AccountManagement } from "./pages/admin/AccountManagement.jsx";
import { AccountDetail } from "./pages/admin/AccountDetail.jsx";
import { EventManagement } from "./pages/admin/EventManagement.jsx";
import { EventDetail } from "./pages/admin/EventDetail.jsx";
import { EventAnalytics } from "./pages/admin/EventAnalytics.jsx";
import { useEffect } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { autoRefreshToken } from "./store/slices/auth.slice";

import AppRoutes from "./routes";

import OrganizerLayout from "./components/layout/OrganizerLayout";
import MyEventsPage from "./pages/organizer/MyEventsPage";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // ✅ Auto refresh token khi app load
  useEffect(() => {
    const initAuth = async () => {
      // Nếu chưa có access token nhưng có refresh token (cookie)
      if (!isAuthenticated) {
        try {
          await dispatch(autoRefreshToken()).unwrap();
          console.log("Auto refresh successful");
        } catch {
          console.log("No valid session");
        }
      }
    };

    initAuth();
  }, [dispatch, isAuthenticated]);

  return (
    <Routes>
      <Route path="/*" element={<AppRoutes />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/me"
        element={
          <ProtectedRoute>
            <ProfileCard />
          </ProtectedRoute>
        }
      />

      {/* Admin Pages */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/accounts" element={<AccountManagement />} />
      <Route path="/admin/accounts/account-detail/:id" element={<AccountDetail />} />
      <Route path="/admin/events" element={<EventManagement />} />
      <Route path="/admin/events/event-detail/:id" element={<EventDetail />} />
      <Route path="/admin/analytics" element={<EventAnalytics />} />

      {/* Organizer Pages */}
      <Route path="/organizer" element={<OrganizerLayout />}>
        <Route path="my-events" element={<MyEventsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
