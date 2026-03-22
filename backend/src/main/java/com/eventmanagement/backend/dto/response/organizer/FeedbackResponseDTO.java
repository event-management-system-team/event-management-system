package com.eventmanagement.backend.dto.response.organizer;

import java.time.LocalDateTime;

public interface FeedbackResponseDTO {
    String getFeedbackId();
    Integer getRating();
    String getComment();
    String getUserName();
    String getUserEmail();
    String getUserAvatar();
    String getTicketName();
    LocalDateTime getCreatedAt();
}