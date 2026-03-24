import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

/**
 * Key dùng để lưu form state vào sessionStorage khi navigate ra ngoài
 * (vd: sang RecruitmentBuilder ở Step 3).
 */
const SESSION_KEY = "recruitment_draft_form";

const serializeForm = (form, step) => {
  try {
    return JSON.stringify({
      ...form,
      eventOptions: [], // không cần persist list option
      deadline: form.deadline ? form.deadline.toISOString() : null,
      _step: step,
    });
  } catch {
    return null;
  }
};

const deserializeForm = (raw) => {
  try {
    const parsed = JSON.parse(raw);
    return {
      form: {
        ...parsed,
        deadline: parsed.deadline ? new Date(parsed.deadline) : null,
      },
      step: parsed._step || 1,
    };
  } catch {
    return null;
  }
};

const useCreateRecruitment = (preselectedEventId = "") => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth?.user);

  // Nếu navigate từ Edit Post, location.state sẽ có recruitmentId
  const editRecruitmentId = location.state?.recruitmentId || null;
  const isEditMode = !!editRecruitmentId;

  // Khởi tạo state từ sessionStorage nếu đang quay lại từ Form Builder
  const [step, setStep] = useState(() => {
    if (isEditMode) return 1;
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      const parsed = deserializeForm(saved);
      // Chỉ restore nếu cùng eventId
      if (parsed && parsed.form.eventId === preselectedEventId) {
        return parsed.step;
      }
    }
    return 1;
  });

  const [form, setForm] = useState(() => {
    if (isEditMode) return { ...initialForm, eventId: preselectedEventId };
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      const parsed = deserializeForm(saved);
      if (parsed && parsed.form.eventId === preselectedEventId) {
        return { ...parsed.form, eventOptions: [] };
      }
    }
    return { ...initialForm, eventId: preselectedEventId };
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  // Load danh sách events của organizer vào dropdown
  useEffect(() => {
    organizerService.getMyEvents(0, 100)
      .then((data) => {
        const list = data?.content || data?.events || data || [];
        setForm((prev) => ({ ...prev, eventOptions: list }));
      })
      .catch(() => {});
  }, []);

  // Edit mode: load dữ liệu recruitment hiện tại vào form
  useEffect(() => {
    if (!editRecruitmentId) return;
    recruitmentService.getRecruitmentById(editRecruitmentId)
      .then((data) => {
        setForm((prev) => ({
          ...prev,
          positionName: data.positionName || "",
          vacancy: String(data.vacancy || 1),
          description: data.description || "",
          requirements: (() => {
            if (!data.requirements) return [];
            if (Array.isArray(data.requirements)) return data.requirements;
            try {
              return JSON.parse(data.requirements);
            } catch {
              return [data.requirements];
            }
          })(),
          benefits: data.benefits || [],
          deadline: data.deadline ? new Date(data.deadline) : null,
          formId: data.formId || null,
        }));
      })
      .catch(() => {});
  }, [editRecruitmentId]);

  // Tự động lưu form vào sessionStorage mỗi khi thay đổi (chỉ khi không phải edit mode)
  useEffect(() => {
    if (isEditMode) return;
    const serialized = serializeForm(form, step);
    if (serialized) {
      sessionStorage.setItem(SESSION_KEY, serialized);
    }
  }, [form, step, isEditMode]);

  const clearDraft = () => sessionStorage.removeItem(SESSION_KEY);

  const updateForm = (partial) => setForm((prev) => ({ ...prev, ...partial }));

  const buildPayload = (status = "OPEN") => ({
    positionName: form.positionName,
    description: form.description || null,
    vacancy: parseInt(form.vacancy) || 1,
    requirements: form.requirements.length > 0 ? form.requirements : null,
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
      if (isEditMode) {
        await recruitmentService.updateRecruitment(
          editRecruitmentId,
          buildPayload("DRAFT"),
        );
      } else {
        await recruitmentService.createRecruitment(
          form.eventId,
          buildPayload("DRAFT"),
        );
      }
      clearDraft();
      navigate(`/organizer/recruitmentlist/${form.eventId}`);
    } catch (err) {
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
      if (isEditMode) {
        await recruitmentService.updateRecruitment(
          editRecruitmentId,
          buildPayload("OPEN"),
        );
      } else {
        await recruitmentService.createRecruitment(
          form.eventId,
          buildPayload("OPEN"),
        );
      }
      clearDraft();
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
      clearDraft();
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
    isEditMode,
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
