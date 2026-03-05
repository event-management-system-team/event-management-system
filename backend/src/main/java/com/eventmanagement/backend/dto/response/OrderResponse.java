package com.eventmanagement.backend.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.eventmanagement.backend.model.OrderStatus;

import lombok.Data;

@Data
public class OrderResponse {

    private UUID orderId;
    private String orderCode;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private LocalDateTime expiresAt;
}
