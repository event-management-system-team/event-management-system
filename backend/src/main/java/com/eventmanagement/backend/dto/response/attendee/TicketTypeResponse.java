package com.eventmanagement.backend.dto.response.attendee;

import com.eventmanagement.backend.model.Event;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketTypeResponse {

    private UUID ticketTypeId;
    private String ticketName;
    private BigDecimal price;
    private Integer quantity;
    private Integer soldCount;
    private Integer reservedCount;
    private Boolean isActive;
    private String description;
    private LocalDateTime saleStart;
    private LocalDateTime saleEnd;

}
