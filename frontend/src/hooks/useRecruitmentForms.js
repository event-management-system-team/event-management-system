import { useState, useEffect } from "react";
import recruitmentService from "../services/recruitment.service";

const useRecruitmentForms = (eventId) => {
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!eventId) return;
    let cancelled = false;
    setIsLoading(true);
    recruitmentService
      .getFormsByEvent(eventId, "RECRUITMENT")
      .then((res) => {
        if (!cancelled) {
          // Backend trả về một form object (hoặc null nếu chưa có form)
          // Chỉ hiển thị form đã active (published), không hiển thị draft
          if (res && res.formId && (res.active === true || res.isActive === true)) {
            setForms([res]);
          } else {
            setForms([]);
          }
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || "Failed to load forms");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [eventId]);

  return { forms, isLoading, error };
};

export default useRecruitmentForms;
