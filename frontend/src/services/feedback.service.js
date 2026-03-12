import axiosClient from "../config/axios";

const feedbackService = {
  getFeedbacksByEvent: (eventId) => {
    return axiosClient.get(`/events/${eventId}/feedbacks`);
  },

  getFeedbackById: (feedbackId) => {
    return axiosClient.get(`/feedbacks/${feedbackId}`);
  },

  getAnalytics: (eventId) => {
    return axiosClient.get(`/events/${eventId}/feedbacks/analytics`);
  },
};

export default feedbackService;
