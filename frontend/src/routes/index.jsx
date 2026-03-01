import { Route, Routes } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import AttendeeRoutes from "./AttendeeRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Public/Protected Routes */}
      <Route path="/*" element={<PublicRoutes />} />
      <Route path="/attendee/*" element={<AttendeeRoutes />} />

    </Routes>
  );
};

export default AppRoutes;
