import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import recruitmentService from "../services/recruitment.service";
import organizerService from "../services/organizer.service";
import { validateStep1, validateStep2 } from "../schemas/recruitment.schema";

const initialForm = {
<<<<<<< HEAD
  positions: [{ name: "", vacancy: "1", requirements: [] }],
=======
  positions: [{ name: "", vacancy: "1", description: "", requirements: [] }],
>>>>>>> 61001302a156f8c89809a6f70848c8abd078eae8
  eventId: "",
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

  // Edit mode: load ALL positions cho event vào form
  useEffect(() => {
    if (!editRecruitmentId || !preselectedEventId) return;

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

    const loadAllPositions = async () => {
      try {
        // 1. Get dashboard to find ALL recruitmentIds for this event
        const dashboard = await recruitmentService.getDashboard(preselectedEventId);
        const allItems = dashboard?.recentRecruitments || [];

        if (allItems.length === 0) return;

        // 2. Fetch detail for each position
        const detailPromises = allItems.map(item =>
          recruitmentService.getRecruitmentById(item.recruitmentId)
        );
        const details = await Promise.all(detailPromises);

        // 3. Build positions array from all details
        const positions = details.map(data => ({
          recruitmentId: data.recruitmentId,
          name: data.positionName || "",
          vacancy: String(data.vacancy || 1),
          description: data.description || "",
          requirements: parseToArray(data.requirements),
        }));

        // Use first position's data for shared fields (benefits, deadline, formId)
        const firstData = details[0];
        const parsedBenefits = parseToArray(firstData.benefits);

        setForm((prev) => ({
          ...prev,
<<<<<<< HEAD
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
=======
          positions,
          benefits: parsedBenefits,
          deadline: firstData.deadline ? new Date(firstData.deadline) : null,
          formId: firstData.formId || null,
        }));

        // Auto-navigate to appropriate step
        const hasReqsOrBenefits = positions.some(p => p.requirements.length > 0) || parsedBenefits.length > 0;
        if (firstData.deadline || hasReqsOrBenefits) {
>>>>>>> 61001302a156f8c89809a6f70848c8abd078eae8
          setStep(3);
        } else if (positions.some(p => p.name)) {
          setStep(2);
        }
      } catch {
        // Fallback: load single recruitment
        try {
          const data = await recruitmentService.getRecruitmentById(editRecruitmentId);
          const parsedReqs = parseToArray(data.requirements);
          const parsedBenefits = parseToArray(data.benefits);

          setForm((prev) => ({
            ...prev,
            positions: [{
              name: data.positionName || "",
              vacancy: String(data.vacancy || 1),
              description: data.description || "",
              requirements: parsedReqs,
            }],
            benefits: parsedBenefits,
            deadline: data.deadline ? new Date(data.deadline) : null,
            formId: data.formId || null,
          }));

          if (data.deadline || parsedReqs.length > 0 || parsedBenefits.length > 0) {
            setStep(3);
          } else if (data.positionName) {
            setStep(2);
          }
        } catch {}
      }
    };

    loadAllPositions();
  }, [editRecruitmentId, preselectedEventId]);

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

<<<<<<< HEAD
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
=======
  const buildPayload = (status = "OPEN") => ({
    positions: form.positions.map((p) => ({
      positionName: p.name,
      vacancy: parseInt(p.vacancy) || 1,
      description: p.description || null,
      requirements: (p.requirements || []).length > 0 ? p.requirements : null,
    })),
    benefits: form.benefits.length > 0 ? form.benefits : null,
    deadline: form.deadline ? dayjs(form.deadline).toISOString() : null,
    formId: form.formId || null,
    status,
  });
>>>>>>> 61001302a156f8c89809a6f70848c8abd078eae8

  // Helper: update tất cả positions đã tồn tại trên server
  const updateAllPositions = async (status) => {
    const payload = buildPayload(status);

    if (isEditMode) {
      // Edit mode: update từng position dựa trên recruitmentId đã load
      const updatePromises = form.positions.map((pos, idx) => {
        const posPayload = payload.positions[idx];
        if (pos.recruitmentId) {
          return recruitmentService.updateRecruitment(pos.recruitmentId, {
            positionName: posPayload?.positionName,
            vacancy: posPayload?.vacancy,
            description: posPayload?.description,
            requirements: posPayload?.requirements,
            benefits: payload.benefits,
            deadline: payload.deadline,
            formId: payload.formId,
            status,
          });
        }
        return Promise.resolve();
      });
      await Promise.all(updatePromises);
    } else {
      // Non-edit mode: kiểm tra nếu event đã có recruitment → update all
      let existingItems = [];
      try {
        const dashboard = await recruitmentService.getDashboard(form.eventId);
        existingItems = dashboard?.recentRecruitments || [];
      } catch {
        // Nếu không lấy được dashboard, thử create
      }

      if (existingItems.length > 0) {
        // Update từng existing position
        const updatePromises = existingItems.map((item, idx) => {
          const posPayload = payload.positions[idx];
          if (posPayload) {
            return recruitmentService.updateRecruitment(item.recruitmentId, {
              positionName: posPayload.positionName,
              vacancy: posPayload.vacancy,
              description: posPayload.description,
              requirements: posPayload.requirements,
              benefits: payload.benefits,
              deadline: payload.deadline,
              formId: payload.formId,
              status,
            });
          }
          return Promise.resolve();
        });
        await Promise.all(updatePromises);
      } else {
        // Chưa có → create mới
        await recruitmentService.createRecruitment(form.eventId, payload);
      }
    }
  };

  const handleSaveDraft = async () => {
    const errs = {};
    if (!form.eventId) {
      errs.eventId = "Please select an event first.";
    }
    // Kiểm tra ít nhất 1 position có tên
    const hasEmptyName = form.positions.some(p => !p.name || !p.name.trim());
    if (hasEmptyName) {
      form.positions.forEach((p, idx) => {
        if (!p.name || !p.name.trim()) {
          errs[`positions.${idx}.name`] = "Position name is required";
        }
      });
    }
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      if (errs.eventId || hasEmptyName) {
        setStep(1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }
    setSaving(true);
    setError(null);
    setErrors({});
    try {
      await updateAllPositions("DRAFT");
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
    // --- Full validation trước khi submit ---
    const errs = {};

    // Step 1 validation
    if (!form.eventId) {
      errs.eventId = "Please select an event.";
    }
    form.positions.forEach((p, idx) => {
      if (!p.name || !p.name.trim()) {
        errs[`positions.${idx}.name`] = "Position name is required";
      }
      const vac = parseInt(p.vacancy);
      if (!vac || vac < 1) {
        errs[`positions.${idx}.vacancy`] = "At least 1 vacancy required";
      }
    });

    // Step 2 validation
    if (!form.deadline) {
      errs.deadline = "Application deadline is required";
    } else if (eventStartDate && form.deadline >= eventStartDate) {
      errs.deadline = "Deadline must be before the event start date";
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      // Navigate to the first step that has errors
      if (errs.eventId || Object.keys(errs).some(k => k.startsWith('positions.'))) {
        setStep(1);
      } else if (errs.deadline) {
        setStep(2);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSaving(true);
    setError(null);
    setErrors({});
    try {
      await updateAllPositions("OPEN");
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
