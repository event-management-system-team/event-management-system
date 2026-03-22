package com.eventmanagement.backend.dto.response.admin;

import lombok.*;

import java.math.BigDecimal;

@Data
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TopEventRevenueResponse {
    private String eventName;
    private BigDecimal revenue;
}
