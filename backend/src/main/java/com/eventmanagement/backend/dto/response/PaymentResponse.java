package com.eventmanagement.backend.dto.response;

import com.eventmanagement.backend.constants.PaymentStatus;
import com.eventmanagement.backend.model.Payment;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
public class PaymentResponse {

    private UUID paymentId;

    private String orderCode;

    private BigDecimal amount;

    private PaymentStatus status;

    private String transactionId;

    private String vnpayResponseCode;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime paymentDate;

    private String paymentUrl;

    public static PaymentResponse from(Payment payment, String orderCode) {
        return PaymentResponse.builder()
                .paymentId(payment.getPaymentId())
                .orderCode(orderCode)
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .transactionId(payment.getTransactionId())
                .vnpayResponseCode(payment.getVnpayResponseCode())
                .paymentDate(payment.getPaymentDate())
                .build();
    }

    public static PaymentResponse withUrl(
            Payment payment, String orderCode, String paymentUrl) {
        return PaymentResponse.builder()
                .paymentId(payment.getPaymentId())
                .orderCode(orderCode)
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .paymentUrl(paymentUrl)
                .build();
    }
}
