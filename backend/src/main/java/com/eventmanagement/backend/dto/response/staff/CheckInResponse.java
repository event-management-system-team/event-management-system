package com.eventmanagement.backend.dto.response.staff;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class CheckInResponse {
    private UUID ticketId;
    private String customerName;
    private String avatarUrl;
    private String email;
    private String ticketType;
    private String ticketCode;
    private String scannedBy;
    private LocalDateTime checkInTime;
    private String status;
    private String message;
    private LocalDateTime createdAt;
}
