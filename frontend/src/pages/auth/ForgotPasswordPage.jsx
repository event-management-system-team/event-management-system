import React from "react";
import { VisualSidebar } from "../../components/domain/auth/forgot-password/VisualSidebar";
import { ForgotPasswordForm } from "../../components/domain/auth/forgot-password/ForgotPasswordForm";
import { VerifyOtpForm } from "../../components/domain/auth/forgot-password/VerifyOtpForm";
import { ResetPasswordForm } from "../../components/domain/auth/forgot-password/ResetPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="bg-[#F1F0E8] min-h-screen flex items-center justify-center overflow-x-hidden font-display">
      <div className="flex flex-col md:flex-row w-full min-h-screen">
        <VisualSidebar />
        <ResetPasswordForm />
      </div>
    </div>
  );
}
