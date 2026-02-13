package com.eventmanagement.backend.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FeedbackResponse {
    private UUID id;
    private LocalDateTime createdAt;
    
    // User Info
    private String userName;
    private String userEmail;
    private String userAvatar;
    
    // Feedback Info
    private Integer rating;
    private String comment;
    
    // Ticket Info
    private String ticketName; 
}