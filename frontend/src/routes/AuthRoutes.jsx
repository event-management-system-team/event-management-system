import React from "react";
import { Routes, Route } from "react-router-dom";
import RegisterPage from "../pages/auth/RegisterPage";
import LoginPage from "../pages/auth/LoginPage";

function AuthRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/" element={<RegisterPage />} />
    </Routes>
  );
}

export default AuthRoutes;
