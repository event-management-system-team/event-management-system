/*import React from "react";

export const InputField = ({ label, type = "text", placeholder, id }) => {
  return (
    <div className="relative">
      <label className="block text-sm font-bold text-gray-70mb-2" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <input
          className="w-full h-12 px-6 rounded-full border border-gray-300 bg-white text-gray-900focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-400"
          id={id}
          placeholder={placeholder}
          type={type}
        />
      </div>
    </div>
  );
};*/
import React, { useState } from "react";

import { IoEyeOffOutline } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";

export const InputField = ({ label, type = "text", placeholder, id }) => {
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
          className="w-full h-12 px-6 rounded-full border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-400"
          id={id}
          placeholder={placeholder}
          type={inputType}
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
    </div>
  );
};
