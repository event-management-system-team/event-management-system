// service/PaymentService.java
package com.eventmanagement.backend.service;

import com.eventmanagement.backend.config.VNPayConfig;
import com.eventmanagement.backend.constants.PaymentMethod;
import com.eventmanagement.backend.constants.PaymentStatus;
import com.eventmanagement.backend.dto.response.PaymentResponse;
import com.eventmanagement.backend.exception.NotFoundException;
import com.eventmanagement.backend.model.Order;
import com.eventmanagement.backend.model.Payment;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.repository.OrderRepository;
import com.eventmanagement.backend.repository.PaymentRepository;
import com.eventmanagement.backend.util.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

        private final VNPayConfig vnPayConfig;
        private final VNPayUtil vnPayUtil;
        private final OrderRepository orderRepository;
        private final PaymentRepository paymentRepository;

        @Transactional
        public PaymentResponse createVNPayUrl(
                        String orderCode, HttpServletRequest request) {

                Order order = orderRepository.findByOrderCode(orderCode)
                                .orElseThrow(() -> new NotFoundException(
                                                "Order không tồn tại: " + orderCode));

                if (order.getStatus().name().equals("PAID")) {
                        throw new RuntimeException("Order đã được thanh toán.");
                }

                long amount = order.getTotalAmount()
                                .multiply(BigDecimal.valueOf(100))
                                .longValue();

                String createDate = LocalDateTime.now()
                                .format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
                String expireDate = LocalDateTime.now().plusMinutes(15)
                                .format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));

                Map<String, String> params = new TreeMap<>();
                params.put("vnp_Version", vnPayConfig.getVnpVersion());
                params.put("vnp_Command", vnPayConfig.getVnpCommand());
                params.put("vnp_TmnCode", vnPayConfig.getVnpTmnCode());
                params.put("vnp_Amount", String.valueOf(amount));
                params.put("vnp_CurrCode", "VND");
                params.put("vnp_TxnRef", order.getOrderCode());
                params.put("vnp_OrderInfo",
                                "Thanh toan ve su kien " + order.getOrderCode());
                params.put("vnp_OrderType", "other");
                params.put("vnp_Locale", "vn");
                params.put("vnp_ReturnUrl", vnPayConfig.getVnpReturnUrl());
                params.put("vnp_IpAddr", vnPayUtil.getIpAddress(request));
                params.put("vnp_CreateDate", createDate);
                params.put("vnp_ExpireDate", expireDate);

                String hashData = vnPayUtil.buildQueryString(params, false);
                String secureHash = vnPayUtil.hmacSHA512(
                                vnPayConfig.getVnpHashSecret(), hashData);

                String queryString = vnPayUtil.buildQueryString(params, true);
                String paymentUrl = vnPayConfig.getVnpUrl()
                                + "?" + queryString
                                + "&vnp_SecureHash=" + secureHash;

                Payment payment = Payment.builder()
                                .order(order)
                                .user(order.getUser())
                                .vnpayTxnRef(order.getOrderCode())
                                .amount(order.getTotalAmount())
                                .paymentMethod(PaymentMethod.VNPAY)
                                .status(PaymentStatus.PENDING)
                                .build();
                paymentRepository.save(payment);

                log.info("[Payment] Create VNPay URL for order {}", orderCode);

                return PaymentResponse.withUrl(payment, orderCode, paymentUrl);
        }

        public boolean verifyCallback(Map<String, String> params) {

                String vnpSecureHash = params.get("vnp_SecureHash");
                if (vnpSecureHash == null || vnpSecureHash.isEmpty()) {
                        log.warn("[Payment] Callback thiếu vnp_SecureHash");
                        return false;
                }

                Map<String, String> verifyParams = new TreeMap<>(params);
                verifyParams.remove("vnp_SecureHash");
                verifyParams.remove("vnp_SecureHashType");

                String hashData = vnPayUtil.buildQueryString(verifyParams, false);
                String calculatedHash = vnPayUtil.hmacSHA512(
                                vnPayConfig.getVnpHashSecret(), hashData);

                boolean isValid = calculatedHash.equalsIgnoreCase(vnpSecureHash);

                if (!isValid) {
                        log.warn("[Payment] VNPay callback verification failed — " +
                                        "expected: {}, received: {}", calculatedHash, vnpSecureHash);
                }

                return isValid;
        }

        @Transactional
        public PaymentResponse processCallback(Map<String, String> params) {

                String orderCode = params.get("vnp_TxnRef");
                String responseCode = params.get("vnp_ResponseCode");
                String transactionId = params.get("vnp_TransactionNo");
                String amountStr = params.get("vnp_Amount");

                Payment payment = paymentRepository
                                .findByVnpayTxnRef(orderCode)
                                .orElseThrow(() -> new NotFoundException(
                                                "Không tìm thấy payment cho order: " + orderCode));

                Map<String, Object> paymentDetails = new HashMap<>(params);

                if ("00".equals(responseCode)) {
                        payment.setStatus(PaymentStatus.SUCCESS);
                        payment.setTransactionId(transactionId);
                        payment.setVnpayResponseCode(responseCode);
                        payment.setPaymentDate(LocalDateTime.now());
                        payment.setPaymentDetails(paymentDetails);
                        paymentRepository.save(payment);

                        log.info("[Payment] Payment success — order: {}, " +
                                        "txnId: {}", orderCode, transactionId);

                } else {
                        payment.setStatus(PaymentStatus.FAILED);
                        payment.setVnpayResponseCode(responseCode);
                        payment.setPaymentDetails(paymentDetails);
                        paymentRepository.save(payment);

                        log.warn("[Payment] Payment failed — order: {}, " +
                                        "responseCode: {}", orderCode, responseCode);
                }

                return PaymentResponse.from(
                                payment,
                                orderCode);
        }

        public boolean isPaymentSuccess(Map<String, String> params) {
                return "00".equals(params.get("vnp_ResponseCode"));
        }
}
