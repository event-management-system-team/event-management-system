package com.eventmanagement.backend.dto.response.organizer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendeeResponse {
    
    private UUID id;
    private String fullName;
    private String email;
    private String avatarUrl;
    private String ticketType;
    private String status;
    private LocalDateTime registrationDate;
    private LocalDateTime checkInTime;
}
