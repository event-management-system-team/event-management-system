import { useState } from "react";
import { Plus, Gift, Calendar, Clock } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FieldError, inputCls } from "./RecruitmentShared";

const PRESET_BENEFITS = [
  "Certificate",
  "Free Lunch",
  "Monthly Stipend",
  "Remote Work",
  "Health Cover",
];

const Step2Requirements = ({ form, onChange, errors = {}, eventStartDate }) => {
  const [customBenefit, setCustomBenefit] = useState("");

  // Deadline tối đa: trước ngày sự kiện bắt đầu 1 ngày
  const maxDeadline = eventStartDate
    ? (() => {
        const d = new Date(eventStartDate);
        d.setDate(d.getDate() - 1);
        return d;
      })()
    : null;

  const toggleBenefit = (b) => {
    const list = form.benefits || [];
    onChange({
      benefits: list.includes(b) ? list.filter((x) => x !== b) : [...list, b],
    });
  };

  const addCustomBenefit = () => {
    const val = customBenefit.trim();
    if (!val) return;
    const list = form.benefits || [];
    if (!list.includes(val)) onChange({ benefits: [...list, val] });
    setCustomBenefit("");
  };

  const removeBenefitTag = (item) =>
    onChange({ benefits: (form.benefits || []).filter((x) => x !== item) });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ── Benefits ── */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
          <h2 className="flex items-center gap-2 text-base font-bold text-gray-800 mb-5">
            <div className="w-6 h-6 rounded-full bg-[#4a9e9e]/15 flex items-center justify-center">
              <Gift size={13} className="text-[#4a9e9e]" />
            </div>
            Benefits &amp; Perks
          </h2>

          {/* Selected tags */}
          <div className="flex flex-wrap gap-2 mb-4 min-h-[32px]">
            {(form.benefits || []).length === 0 ? (
              <span className="text-xs text-gray-400">
                No perks selected yet
              </span>
            ) : (
              (form.benefits || []).map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-[#2d3a4f] text-white text-xs rounded-full"
                >
                  {b}
                  <button
                    type="button"
                    onClick={() => removeBenefitTag(b)}
                    className="ml-1 hover:text-red-300 transition"
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Preset pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {PRESET_BENEFITS.map((b) => {
              const selected = (form.benefits || []).includes(b);
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => toggleBenefit(b)}
                  className={`px-3 py-1 text-xs rounded-full border transition-all ${
                    selected
                      ? "bg-[#4a9e9e] border-[#4a9e9e] text-white"
                      : "border-gray-200 text-gray-600 hover:border-[#4a9e9e]/50 hover:text-[#4a9e9e]"
                  }`}
                >
                  {b}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add custom perk..."
              value={customBenefit}
              onChange={(e) => setCustomBenefit(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustomBenefit()}
              className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a9e9e]/30 focus:border-[#4a9e9e] bg-white"
            />
            <button
              type="button"
              onClick={addCustomBenefit}
              className="px-3 py-2 bg-[#4a9e9e] text-white text-xs rounded-lg hover:bg-[#3d8f8f] transition"
            >
              <Plus size={13} />
            </button>
          </div>
        </section>

        {/* ── Deadline ── */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
          <h2 className="flex items-center justify-between gap-2 text-base font-bold text-gray-800 mb-5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#4a9e9e]/15 flex items-center justify-center">
                <Calendar size={13} className="text-[#4a9e9e]" />
              </div>
              Application Deadline
            </div>
            <span className="text-xs font-medium text-red-400">Required</span>
          </h2>
          <DatePicker
            selected={form.deadline}
            onChange={(date) => onChange({ deadline: date })}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select application deadline..."
            minDate={new Date()}
            maxDate={maxDeadline}
            className={inputCls(errors.deadline)}
            wrapperClassName="w-full"
          />
          <p className="mt-1.5 text-xs text-gray-400 flex items-start gap-1.5">
            <Clock size={11} className="mt-0.5 shrink-0" />
            {maxDeadline
              ? `Must be before event start (${maxDeadline.toLocaleDateString("en-GB")}).`
              : "Choose when applications will stop being accepted."}
          </p>
          <FieldError msg={errors.deadline} />
        </section>
      </div>
      '<div>
        Staff:
              
        </div>
    </div>

  );
};

export default Step2Requirements;
