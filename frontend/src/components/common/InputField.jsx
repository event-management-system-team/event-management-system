import React from "react";

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
};
