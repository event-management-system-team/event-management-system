import axiosClient from '../config/axios';

const feedbackService = {
  // Lấy danh sách feedback theo Event ID
  getFeedbacksByEvent: (eventId) => {
    return axiosClient.get(`/events/${eventId}/feedbacks`);
  },
  
  // Lấy chi tiết feedback theo Feedback ID
  getFeedbackById: (feedbackId) => {
    return axiosClient.get(`/feedbacks/${feedbackId}`);
  }
};

export default feedbackService;