import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import recruitmentService from "../services/recruitment.service";
import organizerService from "../services/organizer.service";
import { validateStep1, validateStep2 } from "../schemas/recruitment.schema";

const initialForm = {
  positions: [{ name: "", vacancy: "1", requirements: [] }],
  eventId: "",
  description: "",
  eventOptions: [],

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
    let deadlineISO = null;
    if (form.deadline) {
      if (typeof form.deadline === 'string') {
        deadlineISO = form.deadline;
      } else if (typeof form.deadline.toISOString === 'function') {
        deadlineISO = form.deadline.toISOString();
      } else if (form.deadline.$d instanceof Date) {
        // dayjs object — use $d which is the internal Date
        deadlineISO = form.deadline.$d.toISOString();
      } else {
        // Fallback: try converting to Date
        deadlineISO = new Date(form.deadline).toISOString();
      }
    }
    return JSON.stringify({
      ...form,
      eventOptions: [], // không cần persist list option
      deadline: deadlineISO,
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

  // Nếu navigate từ Form Builder, luôn quay lại Step 3
  const fromFormBuilder = location.state?.fromFormBuilder || false;

  // Khởi tạo state từ sessionStorage nếu đang quay lại từ Form Builder
  const [step, setStep] = useState(() => {
    if (fromFormBuilder) return 3;
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
  const [draftSaved, setDraftSaved] = useState(false);

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
        // Parse requirements: backend trả về string ngăn cách bởi \n
        const parseToArray = (val) => {
          if (!val) return [];
          if (Array.isArray(val)) return val;
          try {
            const parsed = JSON.parse(val);
            if (Array.isArray(parsed)) return parsed;
          } catch {
            // not JSON, split by newline
          }
          return val.split('\n').map(s => s.trim()).filter(Boolean);
        };

        const parsedReqs = parseToArray(data.requirements);
        const parsedBenefits = parseToArray(data.benefits);

        setForm((prev) => ({
          ...prev,
          positions: [
            {
              name: data.positionName || "",
              vacancy: String(data.vacancy || 1),
              requirements: parsedReqs,
            },
          ],
          description: data.description || "",
          benefits: parsedBenefits,
          deadline: data.deadline ? new Date(data.deadline) : null,
          formId: data.formId || null,
          eventId: data.eventId || prev.eventId,
        }));

        // Tự động chuyển đến step phù hợp dựa trên dữ liệu đã điền
        // Nếu đã có deadline hoặc benefits → step 2 đã xong → vào step 3
        // Nếu chỉ có position name → step 1 đã xong → vào step 2
        if (data.deadline || parsedBenefits.length > 0) {
          setStep(3);
        } else if (data.positionName) {
          setStep(2);
        }
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

  // Lưu form state vào sessionStorage ĐỒNG BỘ (gọi trước khi navigate ra ngoài)
  const persistDraft = () => {
    if (isEditMode) return;
    const serialized = serializeForm(form, step);
    if (serialized) {
      sessionStorage.setItem(SESSION_KEY, serialized);
    }
  };

  const updateForm = (partial) => setForm((prev) => ({ ...prev, ...partial }));

  // Lấy ngày bắt đầu sự kiện để giới hạn deadline
  const selectedEvent = (form.eventOptions || []).find(
    (ev) => ev.eventId === form.eventId,
  );
  const eventStartDate = selectedEvent?.startDate
    ? new Date(selectedEvent.startDate)
    : null;

  const buildPayload = (status = "OPEN") => {
    return {
      positions: form.positions.map((p) => ({
        positionName: p.name,
        vacancy: parseInt(p.vacancy) || 1,
        requirements: p.requirements && p.requirements.length > 0 ? p.requirements : null,
      })),
      description: form.description || null,
      benefits: form.benefits.length > 0 ? form.benefits : null,
      deadline: form.deadline ? dayjs(form.deadline).toISOString() : null,
      formId: form.formId || null,
      status,
    };
  };

  const handleSaveDraft = async () => {
    if (!form.eventId) {
      setError("Please select an event first.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = buildPayload("DRAFT");
      if (isEditMode) {
        // Edit mode: chỉ update recruitment hiện tại (single position)
        await recruitmentService.updateRecruitment(
          editRecruitmentId,
          {
            positionName: payload.positions[0]?.positionName,
            vacancy: payload.positions[0]?.vacancy,
            description: payload.description,
            requirements: payload.requirements,
            benefits: payload.benefits,
            deadline: payload.deadline,
            formId: payload.formId,
            status: "DRAFT",
          },
        );
      } else {
        // Kiểm tra nếu event đã có recruitment → update thay vì create
        let existingId = null;
        try {
          const dashboard = await recruitmentService.getDashboard(form.eventId);
          const existing = dashboard?.recentRecruitments || [];
          if (existing.length > 0) {
            existingId = existing[0].recruitmentId;
          }
        } catch {
          // Nếu không lấy được dashboard, thử create bình thường
        }

        if (existingId) {
          await recruitmentService.updateRecruitment(existingId, {
            positionName: payload.positions[0]?.positionName,
            vacancy: payload.positions[0]?.vacancy,
            description: payload.description,
            requirements: payload.requirements,
            benefits: payload.benefits,
            deadline: payload.deadline,
            formId: payload.formId,
            status: "DRAFT",
          });
        } else {
          await recruitmentService.createRecruitment(
            form.eventId,
            payload,
          );
        }
      }
      // Stay on current step, show success feedback
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 3000);
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
    // Kiểm tra deadline phải trước ngày bắt đầu sự kiện
    if (form.deadline && eventStartDate && form.deadline >= eventStartDate) {
      e.deadline = "Deadline must be before the event start date";
    }
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
      const payload = buildPayload("OPEN");
      if (isEditMode) {
        await recruitmentService.updateRecruitment(
          editRecruitmentId,
          {
            positionName: payload.positions[0]?.positionName,
            vacancy: payload.positions[0]?.vacancy,
            description: payload.description,
            requirements: payload.requirements,
            benefits: payload.benefits,
            deadline: payload.deadline,
            formId: payload.formId,
            status: "OPEN",
          },
        );
      } else {
        // Kiểm tra nếu event đã có recruitment → update thay vì create
        let existingId = null;
        try {
          const dashboard = await recruitmentService.getDashboard(form.eventId);
          const existing = dashboard?.recentRecruitments || [];
          if (existing.length > 0) {
            existingId = existing[0].recruitmentId;
          }
        } catch {
          // Nếu không lấy được dashboard, thử create bình thường
        }

        if (existingId) {
          await recruitmentService.updateRecruitment(existingId, {
            positionName: payload.positions[0]?.positionName,
            vacancy: payload.positions[0]?.vacancy,
            description: payload.description,
            requirements: payload.requirements,
            benefits: payload.benefits,
            deadline: payload.deadline,
            formId: payload.formId,
            status: "OPEN",
          });
        } else {
          await recruitmentService.createRecruitment(
            form.eventId,
            payload,
          );
        }
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
    eventStartDate,
    draftSaved,
    updateForm,
    clearFieldError,
    persistDraft,
    handleSaveDraft,
    handleContinueStep1,
    handleContinueStep2,
    handleSubmit,
    handleBack,
  };
};

export default useCreateRecruitment;
