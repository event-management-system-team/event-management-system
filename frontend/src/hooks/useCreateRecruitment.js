import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import recruitmentService from "../services/recruitment.service";
import organizerService from "../services/organizer.service";
import { validateStep1, validateStep2 } from "../schemas/recruitment.schema";

const initialForm = {
  positionName: "",
  vacancy: "1",
  eventId: "",
  description: "",
  eventOptions: [],

  requirements: [],
  benefits: [],
  deadline: null,

  formId: null,
};

const useCreateRecruitment = (preselectedEventId = "") => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth?.user);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    ...initialForm,
    eventId: preselectedEventId,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  // Load danh sách events của organizer vào dropdown
  useEffect(() => {
    const organizerId = user?.user_id || user?.userId || user?.id;
    if (!organizerId) return;
    organizerService.getMyEvents(organizerId, 0, 100)
      .then((data) => {
        const list = data?.content || data?.events || data || [];
        setForm((prev) => ({ ...prev, eventOptions: list }));
      })
      .catch(() => {});
  }, [user]);

  const updateForm = (partial) => setForm((prev) => ({ ...prev, ...partial }));

  const buildPayload = (status = "OPEN") => ({
    positionName: form.positionName,
    description: form.description || null,
    vacancy: parseInt(form.vacancy) || 1,
    requirements:
      form.requirements.length > 0 ? JSON.stringify(form.requirements) : null,
    benefits: form.benefits.length > 0 ? form.benefits : null,
    deadline: form.deadline ? dayjs(form.deadline).toISOString() : null,
    formId: form.formId || null,
    status,
  });

  const handleSaveDraft = async () => {
    if (!form.eventId) {
      setError("Please select an event first.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await recruitmentService.createRecruitment(
        form.eventId,
        buildPayload("DRAFT"),
      );
<<<<<<< HEAD
      // Navigate về recruitment list của event vừa tạo
      navigate(`/organizer/recruitmentlist/${form.eventId}`);
    } catch (err) {
=======
    navigate(`/organizer/recruitmentlist/${form.eventId}`);    
  } catch (err) {
>>>>>>> develop
      setError(err?.response?.data?.message || "Failed to save draft.");
    } finally {
      setSaving(false);
    }
  };

  const handleContinueStep1 = () => {
    const e = validateStep1(form);
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setErrors({});
    setError(null);
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleContinueStep2 = () => {
    const e = validateStep2(form);
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setErrors({});
    setError(null);
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!form.eventId) {
      setError("Event is required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await recruitmentService.createRecruitment(
        form.eventId,
        buildPayload("OPEN"),
      );
      setStep(4);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to submit recruitment.");
    } finally {
      setSaving(false);
    }
  };

const handleBack = () => {
  setError(null);
  setErrors({});
  
  if (step === 1) {
navigate(`/organizer/recruitmentlist/${form.eventId}`);
    return;
  } else {
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

  const clearFieldError = (key) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  return {
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
  };
};

export default useCreateRecruitment;
