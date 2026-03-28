import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Plus, Search, Info } from "lucide-react";
import { FieldError } from "./RecruitmentShared";
import useRecruitmentForms from "../../../hooks/useRecruitmentForms";

const Step3SelectForm = ({ form, onChange, errors = {}, persistDraft }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // Load forms thực từ API theo eventId
  const { forms, isLoading } = useRecruitmentForms(form.eventId);

  const filtered = forms.filter((f) =>
    f.formName?.toLowerCase().includes(search.toLowerCase()),
  );

  // Lưu form state vào sessionStorage TRƯỚC khi navigate sang FormBuilder
  const goToFormBuilder = () => {
    if (persistDraft) persistDraft();
    navigate(`/organizer/recruitmentcreate/${form.eventId}`);
  };

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
        <div className="flex items-center justify-between mb-1">
          <h2 className="flex items-center gap-2 text-base font-bold text-gray-800">
            <div className="w-6 h-6 rounded-full bg-[#4a9e9e]/15 flex items-center justify-center">
              <FileText size={13} className="text-[#4a9e9e]" />
            </div>
            Select Application Form
          </h2>
          <button
            type="button"
            onClick={goToFormBuilder}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#4a9e9e] hover:text-[#3d8f8f] transition"
          >
            <Plus size={13} />
            Create New Form
          </button>
        </div>
        <p className="text-sm text-gray-400 mb-5">
          Choose a template for candidates to fill out for this position
        </p>

        {/* Search
        <div className="relative mb-4">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search existing forms by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4a9e9e]/30 focus:border-[#4a9e9e] bg-white transition"
          />
        </div> */}

        {/* Form list */}
        {isLoading ? (
          <div className="text-center py-8 text-gray-300 text-sm">
            Loading forms...
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((f) => {
              const isSelected = form.formId === f.formId;
              const isDraftForm = !f.isActive;
              return (
                <div
                  key={f.formId}
                  onClick={() => {
                    if (!isDraftForm) onChange({ formId: f.formId });
                  }}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    isDraftForm
                      ? "border-yellow-200 bg-yellow-50/50 cursor-default"
                      : isSelected
                        ? "border-[#4a9e9e]/50 bg-[#f0fafa] cursor-pointer"
                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50 cursor-pointer"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isDraftForm
                        ? "bg-yellow-100"
                        : isSelected ? "bg-[#4a9e9e]/20" : "bg-gray-100"
                    }`}
                  >
                    <FileText
                      size={18}
                      className={
                        isDraftForm
                          ? "text-yellow-500"
                          : isSelected ? "text-[#4a9e9e]" : "text-gray-400"
                      }
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-800">
                        {f.formName}
                      </p>
                      {isDraftForm && (
                        <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {f.formSchema?.length ?? 0} questions
                      {isDraftForm && " · Publish this form before it can be used"}
                    </p>
                  </div>
                  {isDraftForm ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        goToFormBuilder();
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-yellow-700 bg-yellow-100 hover:bg-yellow-200 border border-yellow-200 rounded-lg transition flex-shrink-0"
                    >
                      Edit Form
                    </button>
                  ) : (
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        isSelected
                          ? "border-[#4a9e9e] bg-[#4a9e9e]"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {filtered.length === 0 && !isLoading && (
              <div className="text-center py-8 text-gray-300">
                <FileText size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">
                  {forms.length === 0
                    ? "No forms created yet for this event"
                    : "No forms match your search"}
                </p>
              </div>
            )}
          </div>
        )}
        <FieldError msg={errors.formId} />
      </section>

      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
        <Info size={15} className="text-blue-400 mt-0.5 shrink-0" />
        <p className="text-xs text-blue-500 leading-relaxed">
          <strong>Tip:</strong> Selecting a form is optional. If no form is
          selected, candidates will only submit their basic profile information.
        </p>
      </div>
    </div>
  );
};

export default Step3SelectForm;
