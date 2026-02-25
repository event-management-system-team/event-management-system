// src/pages/auth/forgot-password/ResetPasswordForm.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { InputField } from "../../../common/InputField";
import { Button } from "../../../common/Button";
import { MdArrowForward } from "react-icons/md";
import { FaRegCheckCircle, FaRegCircle } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import LogoImg from "../../../../assets/logo.png";

export const ResetPasswordForm = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const passwordStrength = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    match: confirmPassword.length > 0 && newPassword === confirmPassword,
  };

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
          <div className="size-16 bg-[#8aa8b2]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <RiLockPasswordFill className="text-4xl text-[#171a1b]" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create new password
          </h2>
          <p className="text-gray-500">
            New password must be different from the old one and strong enough
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            id="newPassword"
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <InputField
            id="confirmPassword"
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium">
              {passwordStrength.length ? (
                <FaRegCheckCircle className="text-green-500 text-sm shrink-0" />
              ) : (
                <FaRegCircle className="text-gray-300 text-sm shrink-0" />
              )}
              At least 8 characters
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium">
              {passwordStrength.uppercase ? (
                <FaRegCheckCircle className="text-green-500 text-sm shrink-0" />
              ) : (
                <FaRegCircle className="text-gray-300 text-sm shrink-0" />
              )}
              One uppercase letter
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium">
              {passwordStrength.number ? (
                <FaRegCheckCircle className="text-green-500 text-sm shrink-0" />
              ) : (
                <FaRegCircle className="text-gray-300 text-sm shrink-0" />
              )}
              One number
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium">
              {passwordStrength.match ? (
                <FaRegCheckCircle className="text-green-500 text-sm shrink-0" />
              ) : (
                <FaRegCircle className="text-gray-300 text-sm shrink-0" />
              )}
              Passwords must match
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={isLoading}>
              <span>{isLoading ? "Resetting..." : "Reset Password"}</span>
              <span className="group-hover:translate-x-1 transition-transform">
                <MdArrowForward className="text-xl" />
              </span>
            </Button>
          </div>
        </form>

        <p className="mt-8 text-center text-gray-600 text-sm font-medium">
          Back to{" "}
          <Link
            to="/login"
            className="text-[#8aa8b2] font-bold hover:underline ml-1"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
