import { Route, Routes } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import AdminRoutes from "./AdminRoutes";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import AttendeeRoutes from "./AttendeeRoutes";
import OrganizerRoutes from "./OrganizerRoutes";
import StaffRoutes from "./StaffRoutes";
import ScrollToTop from '../hooks/useScrollToTop'


const AppRoutes = () => {
  return (
    <ScrollToTop>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* Organizer Routes */}
        <Route path="/organizer/*" element={<OrganizerRoutes />} />

        {/* Public/Protected Routes */}
        <Route path="/*" element={<PublicRoutes />} />
        <Route path="/attendee/*" element={<AttendeeRoutes />} />
        <Route path="/staff/:eventSlug/*" element={<StaffRoutes />} />

      </Routes>
    </ScrollToTop>
  );
};

export default AppRoutes;
