import { Briefcase, Hash, Plus, Trash2, ChevronDown, ChevronUp, Check, CalendarDays } from "lucide-react";
import { useState } from "react";
import { FieldError, inputCls } from "./RecruitmentShared";

const PRESET_REQUIREMENTS = [
  "Minimum age 18+",
  "Owns a personal smartphone",
  "Prior Experience (1+ years)",
  "Fluent in English & Local Language",
  "Valid Driving License",
];

const Step1RoleDetails = ({ form, onChange, errors = {} }) => {
  const positions = form.positions || [{ name: "", vacancy: "1", description: "", requirements: [] }];
  const [expandedIdx, setExpandedIdx] = useState(0);
  const [customReqText, setCustomReqText] = useState({});

  const updatePosition = (index, field, value) => {
    const updated = positions.map((p, i) =>
      i === index ? { ...p, [field]: value } : p
    );
    onChange({ positions: updated });
  };

  const addPosition = () => {
    const newPositions = [...positions, { name: "", vacancy: "1", description: "", requirements: [] }];
    onChange({ positions: newPositions });
    setExpandedIdx(newPositions.length - 1);
  };

  const removePosition = (index) => {
    if (positions.length <= 1) return;
    const newPositions = positions.filter((_, i) => i !== index);
    onChange({ positions: newPositions });
    if (expandedIdx >= newPositions.length) {
      setExpandedIdx(newPositions.length - 1);
    }
  };

  const handleCustomReqChange = (idx, val) => {
    setCustomReqText((prev) => ({ ...prev, [idx]: val }));
  };

  const addCustomReq = (idx) => {
    const val = (customReqText[idx] || "").trim();
    if (!val) return;
    const posReqs = positions[idx].requirements || [];
    if (!posReqs.includes(val)) {
      updatePosition(idx, "requirements", [...posReqs, val]);
    }
    setCustomReqText((prev) => ({ ...prev, [idx]: "" }));
  };

  return (
    <div className="space-y-6">
      {/* --- Event selector --- */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
        <h2 className="flex items-center gap-2 text-base font-bold text-gray-800 mb-5">
          <div className="w-6 h-6 rounded-full bg-[#4a9e9e]/15 flex items-center justify-center">
            <CalendarDays size={13} className="text-[#4a9e9e]" />
          </div>
          Event
        </h2>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            Event <span className="text-red-400">*</span>
          </label>
          {form.eventId && (form.eventOptions || []).length === 0 ? (
            <div className="w-full px-4 py-2.5 text-sm border border-[#4a9e9e] rounded-xl bg-[#f0fafa] text-[#4a9e9e] font-medium">
              Event ID: {form.eventId.slice(0, 8)}...
            </div>
          ) : (
            <select
              value={form.eventId}
              onChange={(e) => onChange({ eventId: e.target.value })}
              disabled={!!form.eventId}
              className={`w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 bg-white transition appearance-none ${errors.eventId
                  ? "border-red-400 focus:ring-red-200"
                  : "border-gray-200 focus:ring-[#4a9e9e]/30 focus:border-[#4a9e9e]"
                }`}
            >
              <option value="">— Select event —</option>
              {(form.eventOptions || []).map((ev) => (
                <option key={ev.eventId} value={ev.eventId}>
                  {ev.eventName}
                </option>
              ))}
            </select>
          )}
          <FieldError msg={errors.eventId} />
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
        <h2 className="flex items-center gap-2 text-base font-bold text-gray-800 mb-5">
          <div className="w-6 h-6 rounded-full bg-[#4a9e9e]/15 flex items-center justify-center">
            <Briefcase size={13} className="text-[#4a9e9e]" />
          </div>
          Positions
        </h2>

        {/* --- Danh sách positions --- */}
        <div className="space-y-3 mb-4">
          {positions.map((pos, idx) => {
            const explicitNameErr = errors[`positions.${idx}.name`];
            const fallbackNameErr = (!pos.name.trim() && errors.positions) ? "Position name is required" : null;
            const nameErr = explicitNameErr || fallbackNameErr;
            
            const vacErr = errors[`positions.${idx}.vacancy`];
            const isExpanded = expandedIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-gray-100 bg-gray-50/60 transition hover:border-gray-200 overflow-hidden"
              >
                {/* Header row */}
                <div className="flex flex-wrap sm:flex-nowrap items-start gap-3 p-4">
                  {/* Position Name */}
                  <div className="flex-1 min-w-[150px]">
                    {idx === 0 && (
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                        Position Name <span className="text-red-400">*</span>
                      </label>
                    )}
                    <input
                      type="text"
                      required
                      placeholder="e.g. Volunteer, Stage Manager…"
                      value={pos.name}
                      onChange={(e) => updatePosition(idx, "name", e.target.value)}
                      className={inputCls(nameErr)}
                    />
                    <FieldError msg={nameErr} />
                  </div>

                  {/* Vacancy */}
                  <div className="w-24 sm:w-28 shrink-0">
                    {idx === 0 && (
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                        Vacancies <span className="text-red-400">*</span>
                      </label>
                    )}
                    <div className="relative">
                      <Hash
                        size={13}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="number"
                        min="1"
                        placeholder="1"
                        value={pos.vacancy}
                        onChange={(e) =>
                          updatePosition(idx, "vacancy", e.target.value)
                        }
                        className={`w-full pl-8 pr-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition bg-white ${vacErr
                            ? "border-red-400 focus:ring-red-200"
                            : "border-gray-200 focus:ring-[#4a9e9e]/30 focus:border-[#4a9e9e]"
                          }`}
                      />
                    </div>
                    <FieldError msg={vacErr} />
                  </div>

                  {/* Actions */}
                  <div className={`flex items-center gap-1 shrink-0 ${idx === 0 ? "mt-7" : "mt-1"}`}>
                    {/* Expand/Collapse button */}
                    <button
                      type="button"
                      onClick={() => setExpandedIdx(isExpanded ? -1 : idx)}
                      className={`p-2 rounded-lg transition text-gray-500 hover:bg-gray-100`}
                      title={isExpanded ? "Collapse" : "Expand description"}
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removePosition(idx)}
                      disabled={positions.length <= 1}
                      className={`p-2 rounded-lg transition ${positions.length <= 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-red-400 hover:bg-red-50 hover:text-red-600"
                        }`}
                      title="Remove position"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Expandable description & requirements */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-100 pt-4 space-y-5">
                    {/* Description */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex justify-between">
                        <span>Description</span>
                        <span className="text-gray-400 font-normal">Optional</span>
                      </label>
                      <textarea
                        placeholder="Describe the responsibilities and daily tasks for this position…"
                        value={pos.description || ""}
                        onChange={(e) => updatePosition(idx, "description", e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4a9e9e]/30 focus:border-[#4a9e9e] resize-y transition bg-white"
                      />
                    </div>

                    {/* Requirements */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2">
                        Requirements
                      </label>

                      {/* Preset checkboxes */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-3">
                        {PRESET_REQUIREMENTS.map((req) => {
                          const checked = (pos.requirements || []).includes(req);
                          return (
                            <label
                              key={req}
                              onClick={() => {
                                const posReqs = pos.requirements || [];
                                const newReqs = checked ? posReqs.filter((r) => r !== req) : [...posReqs, req];
                                updatePosition(idx, "requirements", newReqs);
                              }}
                              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border cursor-pointer transition-all select-none ${checked
                                  ? "border-[#4a9e9e]/40 bg-[#f0fafa]"
                                  : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                                }`}
                            >
                              <div
                                className={`w-3.5 h-3.5 rounded flex items-center justify-center border-2 flex-shrink-0 transition-all ${checked
                                    ? "bg-[#4a9e9e] border-[#4a9e9e]"
                                    : "border-gray-300"
                                  }`}
                              >
                                {checked && <Check size={10} className="text-white" />}
                              </div>
                              <span className="text-xs text-gray-700 truncate">{req}</span>
                            </label>
                          );
                        })}
                      </div>

                      {/* Custom Tags */}
                      {(() => {
                        const customTags = (pos.requirements || []).filter((r) => !PRESET_REQUIREMENTS.includes(r));
                        if (customTags.length === 0) return null;
                        return (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {customTags.map((r) => (
                              <span
                                key={r}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#4a9e9e]/10 text-[#4a9e9e] text-[11px] font-medium rounded-full border border-[#4a9e9e]/20"
                              >
                                {r}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const posReqs = pos.requirements || [];
                                    updatePosition(idx, "requirements", posReqs.filter((x) => x !== r));
                                  }}
                                  className="ml-0.5 hover:text-red-400 transition"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        );
                      })()}

                      {/* Add custom requirement */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add custom requirement..."
                          value={customReqText[idx] || ""}
                          onChange={(e) => handleCustomReqChange(idx, e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && addCustomReq(idx)}
                          className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a9e9e]/30 focus:border-[#4a9e9e] bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => addCustomReq(idx)}
                          className="px-3 py-2 bg-[#4a9e9e] text-white text-xs rounded-lg hover:bg-[#3d8f8f] transition"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Nút thêm vị trí */}
        <button
          type="button"
          onClick={addPosition}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-sm font-semibold text-gray-500 hover:border-[#4a9e9e] hover:text-[#4a9e9e] transition"
        >
          <Plus size={16} />
          Add Position
        </button>

        {errors.positions && (
          <FieldError msg={errors.positions} />
        )}
      </section>
    </div>
  );
};

export default Step1RoleDetails;
