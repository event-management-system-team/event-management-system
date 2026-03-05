package com.eventmanagement.backend.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Data;

@Data
public class ReservationResponse {

    private UUID ticketTypeId;

    private Integer quantity;

    private LocalDateTime expiresAt;
}
