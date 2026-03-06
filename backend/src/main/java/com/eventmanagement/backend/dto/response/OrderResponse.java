package com.eventmanagement.backend.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.eventmanagement.backend.model.Order;
import com.eventmanagement.backend.model.OrderStatus;

import lombok.Data;

@Data
public class OrderResponse {

    private UUID orderId;
    private String orderCode;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private LocalDateTime expiresAt;

    public static OrderResponse from(Order order) {
        OrderResponse response = new OrderResponse();
        response.setOrderId(order.getOrderId());
        response.setOrderCode(order.getOrderCode());
        response.setTotalAmount(order.getTotalAmount());
        response.setStatus(order.getStatus());
        response.setExpiresAt(order.getExpiresAt());
        return response;
    }
}
