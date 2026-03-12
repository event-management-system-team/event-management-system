package com.eventmanagement.backend.dto.response.organizer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackAnalyticsResponse {
    private Double averageRating;
    private Long totalResponses;
    private Double positiveFeedbackPct;
    private List<RatingDistribution> ratingDistribution;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RatingDistribution {
        private Integer score;
        private Long count;
    }
}
