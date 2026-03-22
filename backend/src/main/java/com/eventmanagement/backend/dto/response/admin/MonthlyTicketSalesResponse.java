package com.eventmanagement.backend.dto.response.admin;

import lombok.*;

import java.math.BigDecimal;

@Data
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MonthlyTicketSalesResponse {
    private String month;
    private Long ticketsSold;
    private BigDecimal revenue;
}
