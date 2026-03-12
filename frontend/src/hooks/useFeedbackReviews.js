import { useQuery } from "@tanstack/react-query";
import feedbackService from "../services/feedback.service";

export const useFeedbackReviews = (eventId, page = 0, size = 10) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["feedbacks", eventId, "reviews", page],
    queryFn: async () => {
      const response = await feedbackService.getReviews(eventId, page, size);
      return response.data;
    },
    enabled: !!eventId,
    staleTime: 1000 * 60,
    placeholderData: (prev) => prev,
  });
  return {
    reviews: data?.content ?? [],
    totalPages: data?.totalPages ?? 0,
    totalElements: data?.totalElements ?? 0,
    isLoading,
    isError,
  };
};
