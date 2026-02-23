import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CreateEvent from "./pages/CreateEvent/CreateEvent";
import TicketsPricing from "./pages/CreateEvent/TicketsPricing";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { ProfileCard } from "./components/domain/profile/ProfileCard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/create-event" element={<CreateEvent />} />
      <Route path="/create-event/tickets" element={<TicketsPricing />} />
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
