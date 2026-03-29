package com.eventmanagement.backend.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eventmanagement.backend.constants.OrderStatus;
import com.eventmanagement.backend.constants.PaymentMethod;
import com.eventmanagement.backend.constants.TicketStatus;
import com.eventmanagement.backend.dto.request.CreateOrderRequest;
import com.eventmanagement.backend.dto.request.ReservationRequest;
import com.eventmanagement.backend.dto.response.OrderResponse;
import com.eventmanagement.backend.dto.response.ReservationResponse;
import com.eventmanagement.backend.exception.NotFoundException;
import com.eventmanagement.backend.model.Order;
import com.eventmanagement.backend.model.Ticket;
import com.eventmanagement.backend.model.TicketType;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.repository.EventRepository;
import com.eventmanagement.backend.repository.OrderRepository;
import com.eventmanagement.backend.repository.TicketRepository;
import com.eventmanagement.backend.repository.TicketTypeRepository;
import com.eventmanagement.backend.repository.UserRepository;
import com.eventmanagement.backend.util.GenerateCode;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingService {

        private final RedisTemplate<String, Object> redisTemplate;
        private final RedissonClient redissonClient;
        private final TicketTypeRepository ticketTypeRepository;
        private final EventRepository eventRepository;
        private final OrderRepository orderRepository;
        private final TicketRepository ticketRepository;
        private final UserRepository userRepository;
        private final GenerateCode generateCode;
        private final EmailService emailService;

        @Value("${booking.reservation-ttl-seconds}")
        private long reservationTtl;

        @Transactional
        public ReservationResponse reserveTickets(ReservationRequest request, UUID userId) {
                String lockKey = "lock:booking:" + request.getTicketTypeId();
                RLock lock = redissonClient.getLock(lockKey);
                try {
                        if (!lock.tryLock(3, 5, TimeUnit.SECONDS))
                                throw new RuntimeException("System is busy, please try again later.");

                        TicketType ticketType = ticketTypeRepository.findById(request.getTicketTypeId())
                                        .orElseThrow(() -> new NotFoundException("Ticket type not found"));

                        if (ticketType.getEvent().getEndDate().isBefore(LocalDateTime.now())) {
                                throw new RuntimeException("Sự kiện đã kết thúc, không thể đặt vé.");
                        }

                        if (ticketType.getSaleStart() != null
                                        && ticketType.getSaleStart().isAfter(LocalDateTime.now())) {
                                throw new RuntimeException("Vé chưa được mở bán.");
                        }

                        if (ticketType.getSaleEnd() != null && ticketType.getSaleEnd().isBefore(LocalDateTime.now())) {
                                throw new RuntimeException("Đã hết thời gian bán vé.");
                        }

                        int updated = ticketTypeRepository.reserveTickets(request.getTicketTypeId(),
                                        request.getQuantity());
                        if (updated == 0)
                                throw new RuntimeException("Ticket is not enough for reservation");

                        String reservationKey = buildReservationKey(request.getTicketTypeId(), userId);
                        redisTemplate.opsForValue().set(reservationKey, request.getQuantity(), reservationTtl,
                                        TimeUnit.SECONDS);

                        return ReservationResponse.builder()
                                        .ticketTypeId(request.getTicketTypeId())
                                        .quantity(request.getQuantity())
                                        .expiresAt(LocalDateTime.now().plusSeconds(reservationTtl))
                                        .build();
                } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                        throw new RuntimeException("System error during reservation", e);
                } finally {
                        if (lock.isHeldByCurrentThread())
                                lock.unlock();
                }
        }

        @Transactional
        public OrderResponse createOrder(CreateOrderRequest request, UUID userId) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new NotFoundException("User not found"));

                boolean isFreeEventOnly = request.getTickets().stream()
                                .allMatch(t -> t.getTicketTypeId() == null);

                if (isFreeEventOnly) {
                        return createFreeOrderWithoutTicketType(request, user);
                }

                return createOrderWithTickets(request, user, userId);
        }

        private OrderResponse createFreeOrderWithoutTicketType(CreateOrderRequest request, User user) {
                if (request.getEventId() == null)
                        throw new RuntimeException("eventId is required for free events.");

                com.eventmanagement.backend.model.Event event = eventRepository
                                .findById(request.getEventId())
                                .orElseThrow(() -> new NotFoundException("Event not found"));

                if (event.getEndDate().isBefore(LocalDateTime.now())) {
                        throw new RuntimeException("Sự kiện đã kết thúc, không thể tạo đơn hàng.");
                }

                // Tìm TicketType "Free Admission" đã tạo sẵn cho event
                List<TicketType> freeTicketTypes = ticketTypeRepository
                                .findByEvent_EventIdAndIsActiveTrue(event.getEventId());
                TicketType freeTicketType = freeTicketTypes.isEmpty() ? null : freeTicketTypes.get(0);

                Order order = Order.builder()
                                .user(user).event(event)
                                .orderCode(generateCode.generateOrderCode())
                                .status(OrderStatus.PENDING)
                                .paymentMethod(PaymentMethod.FREE)
                                .totalAmount(BigDecimal.ZERO)
                                .build();
                orderRepository.save(order);

                Map<String, Object> attendeeInfo = new HashMap<>();
                attendeeInfo.put("name", request.getFullName());
                attendeeInfo.put("email", request.getEmail());

                int totalQty = request.getTickets().stream().mapToInt(CreateOrderRequest.TicketOrder::getQuantity).sum();
                List<Ticket> tickets = new ArrayList<>();
                for (int i = 0; i < totalQty; i++) {
                        tickets.add(Ticket.builder()
                                        .order(order).event(event).user(user)
                                        .ticketType(freeTicketType)
                                        .ticketCode(generateCode.generateTicketCode())
                                        .status(TicketStatus.PENDING)
                                        .price(BigDecimal.ZERO)
                                        .attendeeInfo(attendeeInfo)
                                        .build());
                }
                ticketRepository.saveAll(tickets);
                confirmOrderInternal(order, tickets, TicketStatus.CONFIRMED); // free → CONFIRMED

                log.info("[Booking] Free order confirmed: {}", order.getOrderCode());
                return OrderResponse.from(order);
        }

        private OrderResponse createOrderWithTickets(CreateOrderRequest request, User user, UUID userId) {
                BigDecimal total = BigDecimal.ZERO;
                com.eventmanagement.backend.model.Event firstEvent = null;
                List<Ticket> allTickets = new ArrayList<>();
                List<String> reservationKeysToDelete = new ArrayList<>();

                Map<String, Object> attendeeInfo = new HashMap<>();
                attendeeInfo.put("name", request.getFullName());
                attendeeInfo.put("email", request.getEmail());

                for (CreateOrderRequest.TicketOrder ticketRequest : request.getTickets()) {
                        if (ticketRequest.getTicketTypeId() == null) continue;

                        String reservationKey = buildReservationKey(ticketRequest.getTicketTypeId(), userId);
                        Object cached = redisTemplate.opsForValue().get(reservationKey);
                        if (cached == null)
                                throw new RuntimeException("Reservation has expired. Please select tickets again.");

                        int reservedQty = ((Number) cached).intValue();
                        if (reservedQty < ticketRequest.getQuantity())
                                throw new RuntimeException("Ticket quantity is invalid. Please select tickets again.");

                        TicketType ticketType = ticketTypeRepository.findById(ticketRequest.getTicketTypeId())
                                        .orElseThrow(() -> new NotFoundException("Ticket type not found"));

                        if (firstEvent == null) {
                                firstEvent = ticketType.getEvent();
                        }

                        BigDecimal ticketTotal = ticketType.getPrice().multiply(BigDecimal.valueOf(ticketRequest.getQuantity()));
                        total = total.add(ticketTotal);
                        reservationKeysToDelete.add(reservationKey);

                        for (int i = 0; i < ticketRequest.getQuantity(); i++) {
                                allTickets.add(Ticket.builder()
                                                .event(ticketType.getEvent()).user(user)
                                                .ticketType(ticketType)
                                                .ticketCode(generateCode.generateTicketCode())
                                                .status(TicketStatus.PENDING)
                                                .price(ticketType.getPrice())
                                                .attendeeInfo(attendeeInfo)
                                                .build());
                        }
                }

                if (firstEvent == null && request.getEventId() != null) {
                        firstEvent = eventRepository.findById(request.getEventId())
                                .orElseThrow(() -> new NotFoundException("Event not found"));
                }

                Order order = Order.builder()
                                .user(user).event(firstEvent)
                                .orderCode(generateCode.generateOrderCode())
                                .status(OrderStatus.PENDING)
                                .totalAmount(total)
                                .expiresAt(LocalDateTime.now().plusSeconds(reservationTtl))
                                .build();

                if (total.compareTo(BigDecimal.ZERO) == 0) {
                        order.setPaymentMethod(PaymentMethod.FREE);
                }

                orderRepository.save(order);

                for (Ticket t : allTickets) {
                        t.setOrder(order);
                }
                ticketRepository.saveAll(allTickets);

                if (total.compareTo(BigDecimal.ZERO) == 0) {
                        confirmOrderInternal(order, allTickets, TicketStatus.CONFIRMED);
                } else {
                        reservationKeysToDelete.forEach(redisTemplate::delete);
                }

                return OrderResponse.from(order);
        }

        @Transactional
        public void confirmOrder(String orderCode) {
                Order order = orderRepository.findByOrderCode(orderCode)
                                .orElseThrow(() -> new NotFoundException("Order not found: " + orderCode));

                if (order.getStatus() == OrderStatus.PAID) {
                        log.info("[Booking] Order {} already paid, skip", orderCode);
                        return;
                }
                if (order.getStatus() == OrderStatus.CANCELLED || order.getStatus() == OrderStatus.EXPIRED)
                        throw new RuntimeException("Order đã bị hủy hoặc hết hạn: " + orderCode);

                List<Ticket> tickets = ticketRepository.findByOrderOrderId(order.getOrderId());
                if (tickets.isEmpty())
                        throw new RuntimeException("Tickets not found for order: " + orderCode);

                confirmOrderInternal(order, tickets, TicketStatus.PAID); // vnpay success → PAID
        }

        @Transactional
        public void cancelOrderOnPaymentFail(String orderCode) {
                Order order = orderRepository.findByOrderCode(orderCode)
                                .orElseThrow(() -> new NotFoundException("Order not found: " + orderCode));

                // Idempotent: nếu đã cancel/expired/paid thì bỏ qua
                if (order.getStatus() == OrderStatus.CANCELLED
                                || order.getStatus() == OrderStatus.EXPIRED
                                || order.getStatus() == OrderStatus.PAID) {
                        log.info("[Booking] Order {} already in terminal state {}, skip cancel",
                                        orderCode, order.getStatus());
                        return;
                }

                order.setStatus(OrderStatus.CANCELLED);
                order.setCancelledAt(LocalDateTime.now());
                orderRepository.save(order);

                List<Ticket> tickets = ticketRepository.findByOrderOrderId(order.getOrderId());
                tickets.forEach(t -> t.setStatus(TicketStatus.CANCELLED));
                ticketRepository.saveAll(tickets);

                if (!tickets.isEmpty() && tickets.get(0).getTicketType() != null) {
                        UUID ticketTypeId = tickets.get(0).getTicketType().getTicketTypeId();
                        ticketTypeRepository.releaseReservedTickets(ticketTypeId, tickets.size());
                }

                log.info("[Booking] Order {} cancelled due to payment failure — {} tickets released",
                                orderCode, tickets.size());
        }

        /**
         * Xác nhận order thành công.
         * - ticketFinalStatus = CONFIRMED : vé miễn phí (không qua thanh toán)
         * - ticketFinalStatus = PAID : vé có phí (sau khi VNPay callback thành công)
         */
        private void confirmOrderInternal(Order order, List<Ticket> tickets, TicketStatus ticketFinalStatus) {
                order.setStatus(OrderStatus.PAID);
                order.setPaidAt(LocalDateTime.now());
                orderRepository.save(order);

                tickets.forEach(t -> {
                        t.setStatus(ticketFinalStatus);
                        t.setQrCodeUrl(buildQrCode(t.getTicketCode()));
                });
                ticketRepository.saveAll(tickets);

                if (!tickets.isEmpty() && tickets.get(0).getTicketType() != null) {
                        UUID ticketTypeId = tickets.get(0).getTicketType().getTicketTypeId();
                        int updated = ticketTypeRepository.confirmTickets(ticketTypeId, tickets.size());
                        if (updated == 0)
                                throw new RuntimeException("Failed to update ticket counts.");
                        redisTemplate.delete(buildReservationKey(ticketTypeId, order.getUser().getUserId()));
                }

                // Cập nhật số lượng người đã đăng ký (registeredCount) cho event
                if (order.getEvent() != null) {
                        eventRepository.incrementRegisteredCount(order.getEvent().getEventId(), tickets.size());
                }

                emailService.sendTicketEmail(order.getUser(), order, tickets);
                log.info("[Booking] Order {} confirmed — tickets set to {}", order.getOrderCode(), ticketFinalStatus);
        }

        @Scheduled(fixedRate = 60_000)
        @Transactional
        public void cancelExpiredOrders() {
                List<Order> expiredOrders = orderRepository
                                .findExpiredPendingOrders(LocalDateTime.now(), OrderStatus.PENDING);
                if (expiredOrders.isEmpty())
                        return;

                expiredOrders.forEach(order -> {
                        order.setStatus(OrderStatus.EXPIRED); // EXPIRED = hết giờ thanh toán (phân biệt CANCELLED thủ
                                                              // công)
                        order.setCancelledAt(LocalDateTime.now());
                        orderRepository.save(order);

                        List<Ticket> tickets = ticketRepository.findByOrderOrderId(order.getOrderId());
                        tickets.forEach(t -> t.setStatus(TicketStatus.CANCELLED));
                        ticketRepository.saveAll(tickets);

                        if (!tickets.isEmpty() && tickets.get(0).getTicketType() != null) {
                                UUID ticketTypeId = tickets.get(0).getTicketType().getTicketTypeId();
                                ticketTypeRepository.releaseReservedTickets(ticketTypeId, tickets.size());
                        }
                });

                log.info("[Scheduler] Cancelled {} expired orders at {}", expiredOrders.size(), LocalDateTime.now());
        }

        private String buildReservationKey(UUID ticketTypeId, UUID userId) {
                return "reservation:" + ticketTypeId + ":" + userId;
        }

        private String buildQrCode(String ticketCode) {
                return "/check-in/" + ticketCode;
        }
}