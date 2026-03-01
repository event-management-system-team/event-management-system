import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";

// Hook để lấy danh sách feedbacks cho một sự kiện
const fetchFeedbacks = async (eventId) => {
    // Trỏ tới endpoint trong Spring Boot Controller của bạn để lấy feedbacks theo eventId
  const response = await api.get(`/events/${eventId}/feedback`);
  return response.data;
};

// Custom hook sử dụng React Query để lấy feedbacks
export const useFeedbacks = (eventId) => {
  return useQuery({ //key: ["feedbacks", eventId] để cache theo eventId
    queryKey: ["feedbacks", eventId],
    queryFn: () => fetchFeedbacks(eventId),
    enabled: !!eventId, 
  // Chỉ chạy query khi eventId tồn tại
  });
};