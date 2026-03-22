import { Briefcase, Hash } from "lucide-react";
import { FieldError, inputCls } from "./RecruitmentShared";

const Step1RoleDetails = ({ form, onChange, errors = {} }) => (
  <div className="space-y-6">
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
      <h2 className="flex items-center gap-2 text-base font-bold text-gray-800 mb-5">
        <div className="w-6 h-6 rounded-full bg-[#4a9e9e]/15 flex items-center justify-center">
          <Briefcase size={13} className="text-[#4a9e9e]" />
        </div>
        Role Details
      </h2>

      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
          Position Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Senior Product Designer"
          value={form.positionName}
          onChange={(e) => onChange({ positionName: e.target.value })}
          className={inputCls(errors.positionName)}
        />
        <FieldError msg={errors.positionName} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            Number of Vacancies <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Hash
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="number"
              min="1"
              placeholder="1"
              value={form.vacancy}
              onChange={(e) => onChange({ vacancy: e.target.value })}
              className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition bg-white ${
                errors.vacancy
                  ? "border-red-400 focus:ring-red-200"
                  : "border-gray-200 focus:ring-[#4a9e9e]/30 focus:border-[#4a9e9e]"
              }`}
            />
          </div>
          <FieldError msg={errors.vacancy} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            Event <span className="text-red-400">*</span>
          </label>
          <select
            value={form.eventId}
            onChange={(e) => onChange({ eventId: e.target.value })}
            className={`w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 bg-white transition appearance-none ${
              errors.eventId
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
          <FieldError msg={errors.eventId} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
          Job Description
        </label>
        <textarea
          placeholder="Describe the responsibilities and daily tasks of this role..."
          value={form.description}
          onChange={(e) => onChange({ description: e.target.value })}
          rows={5}
          className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4a9e9e]/30 focus:border-[#4a9e9e] resize-y transition bg-white"
        />
      </div>
    </section>
  </div>
);

export default Step1RoleDetails;
