import axiosInstance from "../config/axios";

const recruitmentService = {
  getRecentRecruitment: async () => {
    const response = await axiosInstance.get("/recruitments/recent");
    return response.data;
  },

  searchRecruitment: async (filters) => {
    const params = new URLSearchParams();
    if (filters.keyword) params.append("keyword", filters.keyword);
    if (filters.location) params.append("location", filters.location);
    if (filters.deadline) params.append("deadline", filters.deadline);
    if (filters.page !== undefined && filters.page !== null)
      params.append("page", filters.page);
    if (filters.size !== undefined && filters.size !== null)
      params.append("size", filters.size);
    const response = await axiosInstance.get(
      `/recruitments/search?${params.toString()}`,
    );
    return response.data;
  },

  getRecruitmentDetail: async (eventSlug) => {
    const response = await axiosInstance.get(`/recruitments/${eventSlug}`);
    return response.data;
  },

  getApplicationForm: async (eventSlug) => {
    const response = await axiosInstance.get(
      `/recruitments/${eventSlug}/apply-staff`,
    );
    return response.data;
  },

  postApplicationForm: async (eventSlug, formData) => {
    const request = await axiosInstance.post(
      `/recruitments/${eventSlug}/apply-staff`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return request.data;
  },

  getDashboard: async (eventId) => {
    const response = await axiosInstance.get(
      `/recruitments/dashboards/${eventId}`,
    );
    return response.data;
  },

  getWorkspace: async (eventId) => {
    const response = await axiosInstance.get(
      `/recruitments/events/${eventId}/workspace`,
    );
    return response.data;
  },

  saveWorkspace: async (eventId, data) => {
    const response = await axiosInstance.post(
      `/recruitments/events/${eventId}/workspace`,
      data,
    );
    return response.data;
  },

  createRecruitment: async (eventId, data) => {
    const response = await axiosInstance.post(
      `/recruitments/events/${eventId}/create`,
      data,
    );
    return response.data;
  },

  updateRecruitment: async (recruitmentId, data) => {
    const response = await axiosInstance.put(
      `/recruitments/${recruitmentId}`,
      data,
    );
    return response.data;
  },

  deleteRecruitment: async (recruitmentId) => {
    const response = await axiosInstance.delete(
      `/recruitments/${recruitmentId}`,
    );
    return response.data;
  },

  getRecruitmentById: async (recruitmentId) => {
    const response = await axiosInstance.get(
      `/recruitments/${recruitmentId}/detail`,
    );
    return response.data;
  },

  getFormsByEvent: async (eventId, type = "RECRUITMENT") => {
    const response = await axiosInstance.get(
      `/recruitments/events/${eventId}/forms`,
      {
        params: { type },
      },
    );
    return response.data;
  },
};

export default recruitmentService;
