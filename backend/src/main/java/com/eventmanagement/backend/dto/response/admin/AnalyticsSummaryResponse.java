package com.eventmanagement.backend.dto.response.admin;

import lombok.*;

import java.math.BigDecimal;

@Data
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AnalyticsSummaryResponse {
    private Integer totalEvents;
    private Integer activeEvents;
    private Long totalTicketsSold;
    private BigDecimal totalRevenue;
    private Double averageAttendanceRate;
}
