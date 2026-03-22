import axiosClient from "../config/axios";

const feedbackService = {
  getFeedbacksByEvent: (eventId) => {
    return axiosClient.get(`/events/${eventId}/feedback`);
  },

  getFeedbackById: (feedbackId) => {
    return axiosClient.get(`/feedbacks/${feedbackId}`);
  },

  getAnalytics: (eventId) => {
    return axiosClient.get(`/events/${eventId}/analytics`);
  },

  getReviews: (eventId, page = 0, size = 10) => {
    return axiosClient.get(`/events/${eventId}/reviews`, {
      params: { page, size }
    });
  },
};

export default feedbackService;
