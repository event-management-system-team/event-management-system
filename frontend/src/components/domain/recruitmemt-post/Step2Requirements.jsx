import { useState } from "react";
import { Plus, Users, Gift, Calendar, Clock, Check } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FieldError, inputCls } from "./RecruitmentShared";

const PRESET_REQUIREMENTS = [
  "Minimum age 18+",
  "Owns a personal smartphone",
  "Prior Experience (1+ years)",
  "Fluent in English & Local Language",
  "Valid Driving License",
];

const PRESET_BENEFITS = [
  "Certificate",
  "Free Lunch",
  "Monthly Stipend",
  "Remote Work",
  "Health Cover",
];

const Step2Requirements = ({ form, onChange, errors = {}, eventStartDate }) => {
  const [customReq, setCustomReq] = useState("");
  const [customBenefit, setCustomBenefit] = useState("");

  // Deadline tối đa: trước ngày sự kiện bắt đầu 1 ngày
  const maxDeadline = eventStartDate
    ? (() => {
        const d = new Date(eventStartDate);
        d.setDate(d.getDate() - 1);
        return d;
      })()
    : null;

  const toggleReq = (req) => {
    const list = form.requirements || [];
    onChange({
      requirements: list.includes(req)
        ? list.filter((r) => r !== req)
        : [...list, req],
    });
  };

  const addCustomReq = () => {
    const val = customReq.trim();
    if (!val) return;
    const list = form.requirements || [];
    if (!list.includes(val)) onChange({ requirements: [...list, val] });
    setCustomReq("");
  };

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

  const removeTag = (list, item, key) =>
    onChange({ [key]: list.filter((x) => x !== item) });

  const customReqs = (form.requirements || []).filter(
    (r) => !PRESET_REQUIREMENTS.includes(r),
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {/* ── Requirements ── */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
          <h2 className="flex items-center gap-2 text-base font-bold text-gray-800 mb-5">
            <div className="w-6 h-6 rounded-full bg-[#4a9e9e]/15 flex items-center justify-center">
              <Users size={13} className="text-[#4a9e9e]" />
            </div>
            Candidate Requirements
          </h2>

          <div className="space-y-2 mb-4">
            {PRESET_REQUIREMENTS.map((req) => {
              const checked = (form.requirements || []).includes(req);
              return (
                <label
                  key={req}
                  onClick={() => toggleReq(req)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all select-none ${
                    checked
                      ? "border-[#4a9e9e]/40 bg-[#f0fafa]"
                      : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border-2 flex-shrink-0 transition-all ${
                      checked
                        ? "bg-[#4a9e9e] border-[#4a9e9e]"
                        : "border-gray-300"
                    }`}
                  >
                    {checked && <Check size={10} className="text-white" />}
                  </div>
                  <span className="text-sm text-gray-700">{req}</span>
                </label>
              );
            })}
          </div>

          {/* Custom req tags */}
          {customReqs.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {customReqs.map((r) => (
                <span
                  key={r}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-[#4a9e9e]/10 text-[#4a9e9e] text-xs rounded-full border border-[#4a9e9e]/20"
                >
                  {r}
                  <button
                    onClick={() =>
                      removeTag(form.requirements, r, "requirements")
                    }
                    className="ml-1 hover:text-red-400 transition"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-2 mt-3">
            <input
              type="text"
              placeholder="Add custom requirement..."
              value={customReq}
              onChange={(e) => setCustomReq(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustomReq()}
              className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a9e9e]/30 focus:border-[#4a9e9e] bg-white"
            />
            <button
              type="button"
              onClick={addCustomReq}
              className="px-3 py-2 bg-[#4a9e9e] text-white text-xs rounded-lg hover:bg-[#3d8f8f] transition"
            >
              <Plus size={13} />
            </button>
          </div>
        </section>

        {/* ── Benefits + Deadline ── */}
        <div className="space-y-6">
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
                      onClick={() => removeTag(form.benefits, b, "benefits")}
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

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
            <h2 className="flex items-center gap-2 text-base font-bold text-gray-800 mb-5">
              <div className="w-6 h-6 rounded-full bg-[#4a9e9e]/15 flex items-center justify-center">
                <Calendar size={13} className="text-[#4a9e9e]" />
              </div>
              Application Deadline
            </h2>
            <DatePicker
              selected={form.deadline}
              onChange={(date) => onChange({ deadline: date })}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/mm/yyyy"
              minDate={new Date()}
              maxDate={maxDeadline}
              className={inputCls(errors.deadline)}
              wrapperClassName="w-full"
            />
            <p className="mt-1.5 text-xs text-gray-400 flex items-center gap-1">
              <Clock size={11} />
              {maxDeadline
                ? `Deadline must be before event start date (${maxDeadline.toLocaleDateString("en-GB")})`
                : "Candidates cannot apply after this date"}
            </p>
            <FieldError msg={errors.deadline} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Step2Requirements;
