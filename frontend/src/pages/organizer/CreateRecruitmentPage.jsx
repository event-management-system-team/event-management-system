import { useParams } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Rocket, AlertCircle, CheckCircle } from "lucide-react";
import { Alert } from "../../components/common/Alert";
import {
  StepIndicator,
  ProgressHeader,
} from "../../components/domain/recruitmemt-post/RecruitmentShared";
import Step1RoleDetails from "../../components/domain/recruitmemt-post/Step1RoleDetails";
import Step2Requirements from "../../components/domain/recruitmemt-post/Step2Requirements";
import Step3SelectForm from "../../components/domain/recruitmemt-post/Step3SelectForm";
import RecruitmentSuccessScreen from "../../components/domain/recruitmemt-post/RecruitmentSuccessScreen";
import useCreateRecruitment from "../../hooks/useCreateRecruitment";

const STEP_HINTS = {
  1: "Step 1 of 3: Provide basic role information.",
  2: "Step 2 of 3: Define requirements and benefits for candidates.",
  3: "Step 3 of 3: Choose an application form for candidates to fill out.",
};

const CreateRecruitmentPage = () => {
  const { eventId: preselectedEventId } = useParams();
  const [positionAlert, setPositionAlert] = useState(null);

  const {
    step,
    form,
    saving,
    error,
    errors,
    draftSaved,
    updateForm,
    clearFieldError,
    persistDraft,
    handleSaveDraft,
    handleContinueStep1,
    handleContinueStep2,
    handleSubmit,
    eventStartDate,
    handleBack,
  } = useCreateRecruitment(preselectedEventId);

  const handleChange = (partial) => {
    updateForm(partial);
    Object.keys(partial).forEach(clearFieldError);
    // Clear position alert khi user thay đổi form
    if (positionAlert) setPositionAlert(null);
  };

  const handleContinueStep1WithAlert = () => {
    // Check if any position is empty
    const hasEmptyPositions = (form.positions || []).some(p => !p.name || p.name.trim() === "");
    
    if (hasEmptyPositions) {
      setPositionAlert("All positions must have a name. Please fill in or remove empty positions.");
      return;
    }
    
    setPositionAlert(null);
    handleContinueStep1();
  };

  return (
      <div className="flex flex-col min-h-screen">
        {step === 4 ? (
          <div className="flex-1 p-8">
            <RecruitmentSuccessScreen form={form} />
          </div>
        ) : (
          <>
            <ProgressHeader
              step={step}
              saving={saving}
              onSaveDraft={handleSaveDraft}
              eventId={preselectedEventId} 
            />

            <main className="flex-1 max-w-3xl w-full mx-auto py-10 px-4">

              <StepIndicator currentStep={step} />

              {step === 1 && positionAlert && (
                <Alert
                  type="error"
                  message={positionAlert}
                  onClose={() => setPositionAlert(null)}
                />
              )}

              {step === 1 && (
                <Step1RoleDetails
                  form={form}
                  onChange={handleChange}
                  errors={errors}
                />
              )}
              {step === 2 && (
                <Step2Requirements
                  form={form}
                  onChange={handleChange}
                  errors={errors}
                  eventStartDate={eventStartDate}
                />
              )}
              {step === 3 && (
                <Step3SelectForm
                  form={form}
                  onChange={handleChange}
                  errors={errors}
                  persistDraft={persistDraft}
                />
              )}

              {draftSaved && (
                <div className="mt-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
                  <CheckCircle size={16} className="shrink-0" />
                  Draft saved successfully!
                </div>
              )}

              {error && (
                <div className="mt-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  <AlertCircle size={16} className="shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between mt-6">
                {step > 1 ? (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                  >
                    <ArrowLeft size={16} />
                    Back
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSaveDraft}
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    Save as Draft
                  </button>

                  {step === 1 && (
                    <button
                      onClick={handleContinueStep1WithAlert}
                      className="flex items-center gap-2 bg-[#2d3a4f] hover:bg-[#1e293b] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm"
                    >
                      Continue to Requirements
                      <ArrowRight size={16} />
                    </button>
                  )}

                  {step === 2 && (
                    <button
                      onClick={handleContinueStep2}
                      className="flex items-center gap-2 bg-[#2d3a4f] hover:bg-[#1e293b] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm"
                    >
                      Continue to Select Form
                      <ArrowRight size={16} />
                    </button>
                  )}

                  {step === 3 && (
                    <button
                      onClick={handleSubmit}
                      disabled={saving}
                      className="flex items-center gap-2 bg-[#4a9e9e] hover:bg-[#3d8f8f] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm disabled:opacity-60"
                    >
                      {saving ? "Submitting…" : "Submit Recruitment Post"}
                      <Rocket size={16} />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-center text-xs text-gray-400 mt-6">
                {STEP_HINTS[step]}
              </p>
            </main>
          </>
        )}
      </div>
  );
};

export default CreateRecruitmentPage;
