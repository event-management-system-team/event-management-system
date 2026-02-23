import React from "react";
import { Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { ProfileCard } from "./components/domain/profile/ProfileCard";

import { logoutUser } from "./store/slices/auth.slice";
import { useDispatch } from "react-redux";
import PublicRoutes from "./routes/PublicRoutes";
import AppRoutes from "./routes";
function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/logout"
        element={
          <ProtectedRoute>
            <ProfileCard />
          </ProtectedRoute>
        }
      />

      <Route path="/*" element={<AppRoutes />} />
    </Routes>
  );
}

export default App;
