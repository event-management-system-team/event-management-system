// controller/PaymentController.java
package com.eventmanagement.backend.controller.booking;

import com.eventmanagement.backend.dto.response.PaymentResponse;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.service.BookingService;
import com.eventmanagement.backend.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final BookingService bookingService;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @PostMapping("/vnpay/create")
    @PreAuthorize("hasAnyRole('ATTENDEE')")
    public ResponseEntity<PaymentResponse> createPayment(
            @RequestParam String orderCode,
            @AuthenticationPrincipal User user,
            HttpServletRequest request) {

        PaymentResponse response = paymentService
                .createVNPayUrl(orderCode, request);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/vnpay/callback")
    public ResponseEntity<Void> vnpayCallback(
            @RequestParam Map<String, String> params) {

        String orderCode = params.get("vnp_TxnRef");

        try {
            boolean isValid = paymentService.verifyCallback(params);
            if (!isValid) {
                return redirectTo(frontendUrl
                        + "/payment/failed?orderCode=" + orderCode
                        + "&reason=invalid_signature");
            }

            PaymentResponse result = paymentService
                    .processCallback(params);

            if (paymentService.isPaymentSuccess(params)) {
                bookingService.confirmOrder(orderCode);

                return redirectTo(frontendUrl
                        + "/payment/success?orderCode=" + orderCode);

            } else {
                String responseCode = params.get("vnp_ResponseCode");

                return redirectTo(frontendUrl
                        + "/payment/failed?orderCode=" + orderCode
                        + "&code=" + responseCode);
            }

        } catch (Exception e) {
            return redirectTo(frontendUrl
                    + "/payment/failed?orderCode=" + orderCode
                    + "&reason=server_error");
        }
    }

    private ResponseEntity<Void> redirectTo(String url) {
        return ResponseEntity.status(HttpStatus.FOUND)
                .header(HttpHeaders.LOCATION, url)
                .build();
    }
}