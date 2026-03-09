package com.eventmanagement.backend.dto.response.admin;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EventAnalyticsResponse {
    private UUID eventId;
    private String eventName;
    private UUID categoryId;
    private String categoryName;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private Integer totalCapacity;
    private Integer ticketsSold;
    private BigDecimal revenue;

    private Double attendanceRate;

    private String status;
}
