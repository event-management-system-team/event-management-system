import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Button = ({ children, className = "", variant = "primary", ...props }) => {
  const baseStyles =
    "px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-[#9ba9b4] hover:bg-[#8a9aa5] text-white shadow-sm",
    ghost: "bg-transparent hover:bg-gray-200 text-gray-600",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    gradient:
      "w-full h-14 bg-button-gradient text-white font-bold text-lg rounded-full shadow-lg hover:cursor-pointer hover:shadow-[#8aa8b2]/30",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};
