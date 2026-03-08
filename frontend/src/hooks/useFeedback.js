import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../config/axios"; 

const fetchFeedbacks = async (eventId) => {
  const response = await axiosInstance.get(`/events/${eventId}/feedback`);
  console.log("Fetched feedbacks:", response.data); 
  return response.data;
};


export const useFeedbacks = (eventId) => {
  return useQuery({ 
    queryKey: ["feedbacks", eventId],
    queryFn: () => fetchFeedbacks(eventId),
    enabled: !!eventId, 
  });
};