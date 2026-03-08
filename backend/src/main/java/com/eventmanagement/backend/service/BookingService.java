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

        @Value("${booking.reservation-ttl-seconds}")
        private long reservationTtl;

        @Transactional
        public ReservationResponse reserveTickets(
                        ReservationRequest request, UUID userId) {

                String lockKey = "lock:booking:" + request.getTicketTypeId();
                RLock lock = redissonClient.getLock(lockKey);

                try {
                        if (!lock.tryLock(3, 5, TimeUnit.SECONDS)) {
                                throw new RuntimeException(
                                                "System is busy, please try again later.");
                        }

                        ticketTypeRepository.findById(request.getTicketTypeId())
                                        .orElseThrow(() -> new NotFoundException(
                                                        "Ticket type not found"));

                        int updated = ticketTypeRepository.reserveTickets(
                                        request.getTicketTypeId(),
                                        request.getQuantity());

                        if (updated == 0) {
                                throw new RuntimeException(
                                                "Ticket is not enough for reservation");
                        }

                        String reservationKey = buildReservationKey(
                                        request.getTicketTypeId(), userId);
                        redisTemplate.opsForValue().set(
                                        reservationKey,
                                        request.getQuantity(),
                                        reservationTtl,
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
        public OrderResponse createOrder(
                        CreateOrderRequest request, UUID userId) {

                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new NotFoundException("User not found"));

                // ── FREE EVENT (no TicketType) ─────────────────────────────────────────
                if (request.getTicketTypeId() == null) {
                        if (request.getEventId() == null) {
                                throw new RuntimeException("eventId is required for free events.");
                        }

                        com.eventmanagement.backend.model.Event event = eventRepository
                                        .findById(request.getEventId())
                                        .orElseThrow(() -> new NotFoundException("Event not found"));

                        Order order = Order.builder()
                                        .user(user)
                                        .event(event)
                                        .orderCode(generateCode.generateOrderCode())
                                        .status(OrderStatus.PENDING)
                                        .paymentMethod(PaymentMethod.FREE)
                                        .totalAmount(BigDecimal.ZERO)
                                        .build();
                        orderRepository.save(order);

                        Map<String, Object> attendeeInfo = new HashMap<>();
                        attendeeInfo.put("name", request.getFullName());
                        attendeeInfo.put("email", request.getEmail());

                        List<Ticket> tickets = new ArrayList<>();
                        for (int i = 0; i < request.getQuantity(); i++) {
                                Ticket ticket = Ticket.builder()
                                                .order(order)
                                                .event(event)
                                                .user(user)
                                                .ticketCode(generateCode.generateTicketCode())
                                                .status(TicketStatus.PENDING)
                                                .price(BigDecimal.ZERO)
                                                .attendeeInfo(attendeeInfo)
                                                .build();
                                tickets.add(ticket);
                        }
                        ticketRepository.saveAll(tickets);

                        // Auto-confirm immediately — no payment needed
                        confirmOrderInternal(order, tickets);

                        return OrderResponse.from(order);
                }

                // ── PAID EVENT (has TicketType) ────────────────────────────────────────
                String reservationKey = buildReservationKey(
                                request.getTicketTypeId(), userId);
                Object cached = redisTemplate.opsForValue().get(reservationKey);

                if (cached == null) {
                        throw new RuntimeException(
                                        "Reservation has expired. Please select tickets again.");
                }

                int reservedQty = ((Number) cached).intValue();
                if (reservedQty < request.getQuantity()) {
                        throw new RuntimeException(
                                        "Ticket quantity is invalid. Please select tickets again.");
                }

                TicketType ticketType = ticketTypeRepository
                                .findById(request.getTicketTypeId())
                                .orElseThrow(() -> new NotFoundException(
                                                "Ticket type not found"));

                BigDecimal total = ticketType.getPrice()
                                .multiply(BigDecimal.valueOf(request.getQuantity()));

                Order order = Order.builder()
                                .user(user)
                                .event(ticketType.getEvent())
                                .orderCode(generateCode.generateOrderCode())
                                .status(OrderStatus.PENDING)
                                .totalAmount(total)
                                .expiresAt(LocalDateTime.now().plusSeconds(reservationTtl))
                                .build();
                orderRepository.save(order);

                Map<String, Object> attendeeInfo = new HashMap<>();
                attendeeInfo.put("name", user.getFullName());
                attendeeInfo.put("email", user.getEmail());

                List<Ticket> tickets = new ArrayList<>();
                for (int i = 0; i < request.getQuantity(); i++) {
                        Ticket ticket = Ticket.builder()
                                        .order(order)
                                        .event(ticketType.getEvent())
                                        .user(user)
                                        .ticketType(ticketType)
                                        .ticketCode(generateCode.generateTicketCode())
                                        .status(TicketStatus.PENDING)
                                        .price(ticketType.getPrice())
                                        .attendeeInfo(attendeeInfo)
                                        .build();
                        tickets.add(ticket);
                }
                ticketRepository.saveAll(tickets);

                redisTemplate.delete(reservationKey);

                return OrderResponse.from(order);
        }

        @Transactional
        public void confirmOrder(String orderCode) {

                Order order = orderRepository.findByOrderCode(orderCode)
                                .orElseThrow(() -> new NotFoundException(
                                                "Order is not found: " + orderCode));

                if (order.getStatus() != OrderStatus.PENDING) {
                        throw new RuntimeException("Order is already processed.");
                }

                List<Ticket> tickets = ticketRepository
                                .findByOrderOrderId(order.getOrderId());

                if (tickets.isEmpty()) {
                        throw new RuntimeException(
                                        "Not found: " + orderCode);
                }

                confirmOrderInternal(order, tickets);
        }

        /**
         * Shared confirm logic — used by VNPay callback and free-ticket auto-confirm.
         */
        private void confirmOrderInternal(Order order, List<Ticket> tickets) {

                order.setStatus(OrderStatus.PAID);
                order.setPaidAt(LocalDateTime.now());
                orderRepository.save(order);

                tickets.forEach(t -> {
                        t.setStatus(TicketStatus.CONFIRMED);
                        t.setQrCodeUrl(buildQrCode(t.getTicketCode()));
                });
                ticketRepository.saveAll(tickets);

                // Only update sold/reserved counts for paid tickets (free tickets have no
                // TicketType)
                if (!tickets.isEmpty() && tickets.get(0).getTicketType() != null) {
                        UUID ticketTypeId = tickets.get(0).getTicketType().getTicketTypeId();
                        int updated = ticketTypeRepository.confirmTickets(
                                        ticketTypeId, tickets.size());

                        if (updated == 0) {
                                throw new RuntimeException(
                                                "Failed to update ticket counts.");
                        }

                        String reservationKey = buildReservationKey(
                                        ticketTypeId,
                                        order.getUser().getUserId());
                        redisTemplate.delete(reservationKey);
                }
        }

        @Scheduled(fixedRate = 60_000)
        @Transactional
        public void cancelExpiredOrders() {

                List<Order> expiredOrders = orderRepository
                                .findExpiredPendingOrders(LocalDateTime.now(), OrderStatus.PENDING);

                if (expiredOrders.isEmpty())
                        return;

                expiredOrders.forEach(order -> {
                        order.setStatus(OrderStatus.CANCELLED);
                        order.setCancelledAt(LocalDateTime.now());
                        orderRepository.save(order);

                        List<Ticket> tickets = ticketRepository
                                        .findByOrderOrderId(order.getOrderId());

                        if (!tickets.isEmpty()) {
                                UUID ticketTypeId = tickets.get(0)
                                                .getTicketType().getTicketTypeId();

                                ticketTypeRepository.releaseReservedTickets(
                                                ticketTypeId, tickets.size());

                                tickets.forEach(t -> t.setStatus(TicketStatus.CANCELLED));
                                ticketRepository.saveAll(tickets);
                        }
                });

                System.out.println("[Scheduler] Cancelled "
                                + expiredOrders.size() + " expired orders at "
                                + LocalDateTime.now());
        }

        private String buildReservationKey(UUID ticketTypeId, UUID userId) {
                return "reservation:" + ticketTypeId + ":" + userId;
        }

        private String buildQrCode(String ticketCode) {
                return "/check-in/" + ticketCode;
        }
}