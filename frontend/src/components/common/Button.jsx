import React from "react";

export const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`w-full h-14 bg-button-gradient text-white font-bold text-lg rounded-full shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
