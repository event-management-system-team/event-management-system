import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Plus, Edit3, CheckCircle2 } from "lucide-react";
import { FieldError } from "./RecruitmentShared";
import recruitmentService from "../../../services/recruitment.service";

const Step3SelectForm = ({ form, onChange, errors = {}, persistDraft }) => {
  const navigate = useNavigate();
  const [existingForm, setExistingForm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load form trực tiếp từ DB mỗi khi vào Step 3
  useEffect(() => {
    if (!form.eventId) { setIsLoading(false); return; }
    setIsLoading(true);
    recruitmentService.getFormsByEvent(form.eventId, "RECRUITMENT")
      .then((res) => {
        if (res && res.formId) setExistingForm(res);
        else setExistingForm(null);
      })
      .catch(() => setExistingForm(null))
      .finally(() => setIsLoading(false));
  }, [form.eventId]);

  // Navigate đến Form Builder — lưu draft vào sessionStorage trước
  const goToFormBuilder = () => {
    if (persistDraft) persistDraft();
    navigate(`/organizer/recruitmentcreate/${form.eventId}`);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center text-sm text-gray-400">
        Loading form status…
      </div>
    );
  }

  const questionCount = (() => {
    if (!existingForm?.formSchema) return 0;
    if (typeof existingForm.formSchema === 'string') {
      try { return JSON.parse(existingForm.formSchema).length; } catch { return 0; }
    }
    return Array.isArray(existingForm.formSchema) ? existingForm.formSchema.length : 0;
  })();

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 ${existingForm ? 'bg-[#4a9e9e]/15' : 'bg-gray-50 border-2 border-dashed border-gray-300'}`}>
          {existingForm
            ? <CheckCircle2 size={32} className="text-[#4a9e9e]" />
            : <FileText size={32} className="text-gray-400" />}
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-2">Application Form</h2>

        {existingForm ? (
          <div className="mb-6">
            <p className="text-sm text-gray-600 font-medium mb-1">"{existingForm.formName}"</p>
            <p className="text-xs text-gray-400">{questionCount} question{questionCount !== 1 ? 's' : ''} · Saved as draft
              {existingForm.isActive || existingForm.active
                ? <span className="ml-2 text-green-500 font-medium">· Active</span>
                : <span className="ml-2 text-yellow-500 font-medium">· Will be activated on publish</span>}
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">
            Create a custom questionnaire to collect more information from candidates. This is entirely optional.
          </p>
        )}

        <button
          onClick={goToFormBuilder}
          className="inline-flex items-center gap-2 bg-[#4a9e9e] hover:bg-[#3d8f8f] text-white px-8 py-3 rounded-xl text-sm font-semibold transition shadow-sm hover:shadow-md mx-auto"
        >
          {existingForm ? <Edit3 size={18} /> : <Plus size={18} />}
          {existingForm ? "Edit Custom Form" : "Create Custom Form"}
        </button>

        <FieldError msg={errors.formId} />
      </section>

      {!existingForm && (
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
          <FileText size={15} className="text-blue-400 mt-0.5 shrink-0" />
          <p className="text-xs text-blue-500 leading-relaxed">
            <strong>Tip:</strong> If you skip this step, candidates will submit their application using their default profile information (Name, Email, Student ID, Phone, CV).
          </p>
        </div>
      )}

      {existingForm && (
        <div className="flex items-start gap-3 bg-[#f0fafa] border border-[#4a9e9e]/20 rounded-xl px-4 py-3">
          <CheckCircle2 size={15} className="text-[#4a9e9e] mt-0.5 shrink-0" />
          <p className="text-xs text-[#4a9e9e] leading-relaxed">
            This form is saved as a <strong>draft</strong> — it will be automatically <strong>activated</strong> when you publish the recruitment post, and <strong>deactivated</strong> if you save as draft.
          </p>
        </div>
      )}
    </div>
  );
};

export default Step3SelectForm;
