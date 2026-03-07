import { useQuery } from "@tanstack/react-query";
import api from "../services/api";

const fetchFeedbacks = async (eventId) => {
  const response = await api.get(`/events/${eventId}/feedback`);
  console.log("Fetched feedbacks:", response.data); 
  return response.data;
};


export const useFeedbacks = (eventId) => {
  return useQuery({ 
    queryKey: ["feedbacks", eventId],
    queryFn: () => fetchFeedbacks(eventId),
    enabled: !!eventId, 
  // Chỉ chạy query khi eventId tồn tại
  });
};