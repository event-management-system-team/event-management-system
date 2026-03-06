package com.eventmanagement.backend.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.eventmanagement.backend.constants.OrderStatus;
import com.eventmanagement.backend.model.Order;
import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class OrderResponse {

    private UUID orderId;

    private String orderCode;

    private BigDecimal totalAmount;

    private OrderStatus status;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime expiresAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    public static OrderResponse from(Order order) {
        OrderResponse response = new OrderResponse();
        response.setOrderId(order.getOrderId());
        response.setOrderCode(order.getOrderCode());
        response.setTotalAmount(order.getTotalAmount());
        response.setStatus(order.getStatus());
        response.setExpiresAt(order.getExpiresAt());
        response.setCreatedAt(order.getCreatedAt());
        return response;
    }
}
