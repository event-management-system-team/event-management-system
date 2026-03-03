import { Route, Routes } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import AdminRoutes from "./AdminRoutes";
import OrganizerRoutes from "./OrganizerRoutes";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import AttendeeRoutes from "./AttendeeRoutes";


const AppRoutes = () => {
  return (
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

    </Routes>
  );
};

export default AppRoutes;
