import React, { useState } from "react";
import { VisualSidebar } from "../../components/domain/auth/forgot-password/VisualSidebar";
import { ForgotPasswordForm } from "../../components/domain/auth/forgot-password/ForgotPasswordForm";
import { VerifyOtpForm } from "../../components/domain/auth/forgot-password/VerifyOtpForm";
import { ResetPasswordForm } from "../../components/domain/auth/forgot-password/ResetPasswordForm";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");

  return (
    <div className="bg-[#F1F0E8] min-h-screen flex items-center justify-center overflow-x-hidden font-display">
      <div className="flex flex-col md:flex-row w-full min-h-screen">
        <VisualSidebar />
        {step === 1 && (
          <ForgotPasswordForm
            onSuccess={(email) => {
              setEmail(email);
              setStep(2);
            }}
          />
        )}
        {step === 2 && (
          <VerifyOtpForm
            email={email}
            onSuccess={(token) => {
              setResetToken(token);
              setStep(3);
            }}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && <ResetPasswordForm resetToken={resetToken} />}
      </div>
    </div>
  );
}
