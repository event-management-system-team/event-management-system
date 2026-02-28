import React from "react";
import { MdClose, MdCheckCircle, MdError } from "react-icons/md";

export const Alert = ({ type = "success", message, onClose }) => {
  if (!message) return null;

  const styles = {
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-800",
      icon: MdCheckCircle,
      iconColor: "text-green-600",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-300",
      text: "text-red-800",
      icon: MdError,
      iconColor: "text-red-600",
    },
  };

  const style = styles[type];
  const Icon = style.icon;

  return (
    <div
      className={`${style.bg} ${style.border} border rounded-2xl px-4 py-3 flex items-center gap-3 mb-6`}
    >
      <Icon className={`text-2xl ${style.iconColor}`} />
      <span className={`${style.text} text-sm font-medium flex-1`}>
        {message}
      </span>
      {onClose && (
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <MdClose className="text-xl" />
        </button>
      )}
    </div>
  );
};
