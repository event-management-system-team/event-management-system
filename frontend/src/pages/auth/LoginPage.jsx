import React from "react";
import { VisualSidebar } from "../../components/domain/auth/login/VisualSidebar";
import { LoginForm } from "../../components/domain/auth/login/LoginForm";

export default function LoginPage() {
  return (
    <div className="bg-[#F1F0E8] min-h-screen flex items-center justify-center overflow-x-hidden font-display">
      <div className="flex flex-col md:flex-row w-full min-h-screen">
        <VisualSidebar />
        <LoginForm />
      </div>
    </div>
  );
}
