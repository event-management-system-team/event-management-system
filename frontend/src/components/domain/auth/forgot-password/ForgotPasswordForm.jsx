// src/pages/auth/forgot-password/ForgotPasswordForm.jsx
import { Link } from "react-router-dom";
import { useState } from "react";
import { InputField } from "../../../common/InputField";
import { Button } from "../../../common/Button";
import { MdArrowForward } from "react-icons/md";
import { MdLockReset } from "react-icons/md";
import LogoImg from "../../../../assets/logo.png";

export const ForgotPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: gắn logic sau
  };

  return (
    <div className="w-full md:w-1/2 bg-[#F1F0E8] flex flex-col items-center justify-center px-6 py-12 md:px-20 lg:px-32">
      <div className="w-full max-w-md">
        <div className="md:hidden flex items-center gap-2 mb-8 justify-center">
          <img
            src={LogoImg}
            alt="EventHub Logo"
            className="w-12 h-12 object-contain"
          />
          <span className="text-xl font-bold text-gray-900">EventHub</span>
        </div>

        <div className="text-center mb-10">
          <div className="size-16 bg-[#FF6B35]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <MdLockReset className="text-[#FF6B35] text-3xl" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Forgot password?
          </h2>
          <p className="text-gray-500">
            Enter your registered email, we will send a verification code to
            reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            id="email"
            label="Registered Email"
            placeholder="example@email.com"
            type="email"
          />

          <Button type="submit">
            <span>{isLoading ? "Sending..." : "Send Verification Code"}</span>
            <span className="group-hover:translate-x-1 transition-transform">
              <MdArrowForward className="text-xl" />
            </span>
          </Button>
        </form>

        <p className="mt-10 text-center text-gray-600 text-sm font-medium">
          Remember your password?{" "}
          <span className="text-[#8aa8b2] font-bold hover:underline ml-1">
            <Link to="/login">Back to Login</Link>
          </span>
        </p>
      </div>
    </div>
  );
};
