import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

export const FieldError = ({ msg }) =>
  msg ? (
    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
      <span>⚠</span>
      {msg}
    </p>
  ) : null;

export const inputCls = (hasError) =>
  `w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition bg-white ${
    hasError
      ? "border-red-400 focus:ring-red-200"
      : "border-gray-200 focus:ring-[#4a9e9e]/30 focus:border-[#4a9e9e]"
  }`;

export const StepIndicator = ({ currentStep }) => {
  const steps = [
    { id: 1, label: "Role Details" },
    { id: 2, label: "Requirements" },
    { id: 3, label: "Select Form" },
  ];

  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((step, idx) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                  isCompleted
                    ? "bg-[#4a9e9e] border-[#4a9e9e] text-white"
                    : isActive
                      ? "bg-[#2d3a4f] border-[#2d3a4f] text-white"
                      : "bg-white border-gray-200 text-gray-400"
                }`}
              >
                {isCompleted ? <CheckCircle2 size={18} /> : step.id}
              </div>
              <span
                className={`text-xs mt-1.5 font-medium ${
                  isActive || isCompleted ? "text-gray-700" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-3 mt-[-10px] transition-all ${
                  currentStep > step.id ? "bg-[#4a9e9e]" : "bg-gray-200"
                }`}
                style={{ minWidth: 100, maxWidth: 240 }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export const ProgressHeader = ({ step, saving, onSaveDraft,eventId }) => {
  const navigate = useNavigate();
  const progressPct = step === 1 ? 30 : step === 2 ? 65 : 95;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-8 py-3">
        <nav className="flex items-center gap-2 text-sm text-gray-400">
          <button
      onClick={() => navigate(`/organizer/recruitmentlist/${eventId}`)}
            className="hover:text-gray-700 transition"
          >
            Recruitments
          </button>
          <span>›</span>
          <span className="font-semibold text-gray-700">
            Create Recruitment Post
          </span>
        </nav>
        <div className="flex items-center gap-5">
          <button
            onClick={onSaveDraft}
            disabled={saving}
            className="text-sm font-medium text-gray-500 hover:text-gray-800 transition disabled:opacity-50"
          >
            Save as Draft
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
              Progress
            </span>
            <div className="w-36 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4a9e9e] rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
