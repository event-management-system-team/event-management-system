package com.eventmanagement.backend.dto.response.organizer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackItemResponse {
    private UUID feedbackId;
    private String attendeeName;
    private String avatarUrl;
    private Integer rating;
    private String comment;
    private LocalDateTime submittedAt;
}
