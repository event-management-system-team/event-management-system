import React from "react";
import { VisualSidebar } from "../../components/domain/auth/register/VisualSidebar";
import { RegisterForm } from "../../components/domain/auth/register/RegisterForm";
export default function RegisterPage() {
  return (
    <div className="bg-[#F1F0E8] min-h-screen flex items-center justify-center overflow-x-hidden font-display">
      <div className="flex flex-col md:flex-row w-full min-h-screen">
        <VisualSidebar />
        <RegisterForm />
      </div>
    </div>
  );
}
