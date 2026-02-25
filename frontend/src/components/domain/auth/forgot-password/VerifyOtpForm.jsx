// src/pages/auth/forgot-password/VerifyOtpForm.jsx
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../../common/Button";
import { MdArrowForward } from "react-icons/md";
import { MdMarkEmailRead } from "react-icons/md";
import { IoMdArrowBack } from "react-icons/io";
import LogoImg from "../../../../assets/logo.png";

const OTP_LENGTH = 6;

export const VerifyOtpForm = ({
  email = "example@email.com",
  onSubmit,
  isLoading,
  onResend,
  onBack,
}) => {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Format countdown MM:SS
  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    const newOtp = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpStr = otp.join("");
    if (otpStr.length < OTP_LENGTH) {
      setError("Please enter all 6 digits");
      return;
    }
    // TODO: gắn logic sau
    onSubmit?.({ otp: otpStr });
  };

  const handleResend = () => {
    setCountdown(60);
    setOtp(Array(OTP_LENGTH).fill(""));
    setError("");
    onResend?.();
  };

  const maskedEmail = email.replace(
    /(.{2})(.*)(@.*)/,
    (_, a, b, c) => a + "*".repeat(b.length) + c,
  );

  return (
    <div className="w-full md:w-1/2 bg-[#F1F0E8] flex flex-col items-center justify-center px-6 py-12 md:px-20 lg:px-32">
      <div className="w-full max-w-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-[#8aa8b2] transition-colors mb-8 group w-fit"
        >
          <IoMdArrowBack className="text-xl group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-semibold">Back to Login</span>
        </button>

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
            <MdMarkEmailRead className="text-4xl text-[#8aa8b2]" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Enter verification code
          </h2>
          <p className="text-gray-500">
            We have sent a 6-digit OTP code to <br />
            <span className="font-bold text-gray-700">{maskedEmail}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div
            className="flex justify-between gap-2 sm:gap-4"
            onPaste={handlePaste}
          >
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                placeholder="•"
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className={`size-12 sm:size-14 text-center text-xl font-bold rounded-xl border
                  bg-white text-gray-900 outline-none transition-all
                  focus:ring-2 focus:ring-[#8aa8b2] focus:border-transparent
                  ${
                    error
                      ? "border-red-400 bg-red-50"
                      : digit
                        ? "border-[#8aa8b2] bg-[#8aa8b2]/5"
                        : "border-gray-300"
                  }`}
              />
            ))}
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center -mt-4">{error}</p>
          )}

          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">
              Code valid for{" "}
              <span className="text-[#8aa8b2] font-bold">
                {formatTime(countdown)}
              </span>
            </p>
          </div>

          <Button type="submit" disabled={isLoading}>
            <span>{isLoading ? "Verifying..." : "Confirm"}</span>
            <span className="group-hover:translate-x-1 transition-transform">
              <MdArrowForward className="text-xl" />
            </span>
          </Button>
        </form>

        <p className="mt-10 text-center text-gray-600 text-sm font-medium">
          Didn't receive the code?{" "}
          {countdown > 0 ? (
            <span className="text-gray-400 font-bold">
              Resend in {formatTime(countdown)}
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-[#FF6B35] font-bold hover:underline"
            >
              Resend
            </button>
          )}
        </p>
      </div>
    </div>
  );
};
