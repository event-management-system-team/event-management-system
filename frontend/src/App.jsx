import React from "react";
import {Routes, Route} from "react-router-dom";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { ProfileCard } from "./components/domain/profile/ProfileCard";

import {logoutUser} from "./store/slices/auth.slice";
import {useDispatch} from "react-redux";
import {AdminDashboard} from "./pages/admin/AdminDashboard.jsx";
import {AccountManagement} from "./pages/admin/AccountManagement.jsx";
import {AccountDetail} from "./pages/admin/AccountDetail.jsx";
import {EventManagement} from "./pages/admin/EventManagement.jsx";
import {EventDetail} from "./pages/admin/EventDetail.jsx";
import {EventAnalytics} from "./pages/admin/EventAnalytics.jsx";

function App() {
  return (
    <Routes>
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
            <Route path="/admin" element={<AdminDashboard/>}/>
            <Route path="/admin/accounts" element={<AccountManagement/>}/>
            <Route path="/admin/accounts/account-detail/:id" element={<AccountDetail/>}/>
            <Route path="/admin/events" element={<EventManagement/>}/>
            <Route path="/admin/events/event-detail/:id" element={<EventDetail/>}/>
            <Route path="/admin/analytics" element={<EventAnalytics/>}/>
        </Routes>
    );
}

export default App;
