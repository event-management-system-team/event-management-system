import React, { useState, forwardRef } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

export const InputField = forwardRef(
  ({ label, type = "text", placeholder, id, error, ...rest }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <div className="relative">
        <label
          className="block text-sm font-bold text-gray-700 mb-2"
          htmlFor={id}
        >
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref} // ✅ Quan trọng: Forward ref cho React Hook Form
            className={`w-full h-12 px-6 rounded-full border ${
              error ? "border-red-500" : "border-gray-300"
            } bg-white text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-400`}
            id={id}
            placeholder={placeholder}
            type={inputType}
            {...rest} // ✅ Spread các props từ register()
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword ? (
                <IoEyeOutline size={24} />
              ) : (
                <IoEyeOffOutline size={24} />
              )}
            </button>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <span>⚠️</span>
            <span>{error.message}</span>
          </p>
        )}
      </div>
    );
  },
);

InputField.displayName = "InputField";
