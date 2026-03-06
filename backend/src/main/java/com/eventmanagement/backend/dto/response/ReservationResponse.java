package com.eventmanagement.backend.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReservationResponse {

    private UUID ticketTypeId;

    private Integer quantity;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime expiresAt;

    public long getSecondsRemaining() {
        if (expiresAt == null) {
            return 0;
        }
        long seconds = java.time.Duration.between(LocalDateTime.now(), expiresAt).getSeconds();
        return Math.max(seconds, 0);
    }
}
