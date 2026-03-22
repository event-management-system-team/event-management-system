import { useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Rocket, AlertCircle } from "lucide-react";

import Sidebar from "../../components/layout/Sidebar";
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

  const {
    step,
    form,
    saving,
    error,
    errors,
    updateForm,
    clearFieldError,
    handleSaveDraft,
    handleContinueStep1,
    handleContinueStep2,
    handleSubmit,
    handleBack,
  } = useCreateRecruitment(preselectedEventId);

  const handleChange = (partial) => {
    updateForm(partial);
    Object.keys(partial).forEach(clearFieldError);
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
            />

            <main className="flex-1 max-w-3xl w-full mx-auto py-10 px-4">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  Create Recruitment Posting
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                  Set up your new job opening in just a few steps.
                </p>
              </div>

              <StepIndicator currentStep={step} />

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
                />
              )}
              {step === 3 && (
                <Step3SelectForm
                  form={form}
                  onChange={handleChange}
                  errors={errors}
                />
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
                      onClick={handleContinueStep1}
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
