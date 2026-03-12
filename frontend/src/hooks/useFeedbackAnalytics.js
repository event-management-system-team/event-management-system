import { useQuery } from "@tanstack/react-query";
import feedbackService from "../services/feedback.service";

export const useFeedbackAnalytics = (eventId) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["feedbacks", eventId, "analytics"],
    queryFn: async () => {
      const response = await feedbackService.getAnalytics(eventId);
      return response.data;
    },
    enabled: !!eventId,
    staleTime: 1000 * 60,
  });
  return { analytics: data, isLoading, isError };
};
