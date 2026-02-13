import axiosClient from '@/config/axios';

// Lấy danh sách phản hồi theo ID
export const getEventFeedbacks = async (eventId) => {
    const response = await axiosClient.get(`/event/${eventId}/feedbacks`);
    return response.data;
}

// hàm ẩn, hiện phản hồi
export const toggleFeedbackVisibility = async (feedbackId) => {
    const response = await axiosClient.patch(`/feedback/${feedbackId}/toggle-visibility`);
    return response.data;
}