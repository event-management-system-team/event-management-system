import axiosClient from '../config/axios';

const feedbackService = {
  // Lấy danh sách feedback theo Event ID
  getFeedbacksByEvent: (eventId) => {
    return axiosClient.get(`/events/${eventId}/feedbacks`);
  },
  
  // Các hàm khác nếu cần (Xóa, chi tiết...)
};

export default feedbackService;