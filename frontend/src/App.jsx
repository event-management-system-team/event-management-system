import React from "react";
import { Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { ProfileCard } from "./components/domain/profile/ProfileCard";

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
    </Routes>
  );
}

export default App;
