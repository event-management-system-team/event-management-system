package com.eventmanagement.backend.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReservationResponse {

    private UUID ticketTypeId;

    private Integer quantity;

    private LocalDateTime expiresAt;
}
