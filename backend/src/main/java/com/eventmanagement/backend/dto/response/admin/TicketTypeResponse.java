package com.eventmanagement.backend.dto.response.admin;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class TicketTypeResponse {
    private UUID ticketTypeId;
    private String ticketName;
    private BigDecimal price;
    private Integer quantity;
    private Integer available;
    private String description;
    private String saleStatus;
}
