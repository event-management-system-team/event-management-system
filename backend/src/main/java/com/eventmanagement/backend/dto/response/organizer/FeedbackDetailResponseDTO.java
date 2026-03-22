package com.eventmanagement.backend.dto.response.organizer;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;


@Data
@Builder
@AllArgsConstructor
public class FeedbackDetailResponseDTO {
    private String eventName;
    private LocalDateTime submittedAt;
    private AttendeeInfor attendeeInfor;
    private FeedbackResponse feedbackResponse;
    @Data
    public static class AttendeeInfor {
        private String fullName;
        private String email;
        private String avatar;
        private String phoneNumber;
    }
    @Data
    public static class FeedbackResponse {
        private Integer overallRating;
        private String comment;
        private List<Map<String, Object>> detail;
    }
}
