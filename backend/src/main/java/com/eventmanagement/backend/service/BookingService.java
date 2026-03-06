package com.eventmanagement.backend.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.eventmanagement.backend.constants.TicketStatus;
import com.eventmanagement.backend.dto.request.CreateOrderRequest;
import com.eventmanagement.backend.dto.request.ReservationRequest;
import com.eventmanagement.backend.dto.response.OrderResponse;
import com.eventmanagement.backend.dto.response.ReservationResponse;
import com.eventmanagement.backend.exception.NotFoundException;
import com.eventmanagement.backend.model.Order;
import com.eventmanagement.backend.model.OrderStatus;
import com.eventmanagement.backend.model.Ticket;
import com.eventmanagement.backend.model.TicketType;
import com.eventmanagement.backend.repository.OrderRepository;
import com.eventmanagement.backend.repository.TicketRepository;
import com.eventmanagement.backend.repository.TicketTypeRepository;
import com.eventmanagement.backend.util.GenerateCode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingService {

        private final RedisTemplate<String, Object> redisTemplate;
        private final RedissonClient redissonClient;
        private final TicketTypeRepository ticketTypeRepository;
        private final OrderRepository orderRepository;
        private final TicketRepository ticketRepository;
        private final GenerateCode generateCode;

        @Value("${booking.reservation-ttl-seconds}")
        private long reservationTtl;

        @Transactional
        public ReservationResponse reserveTickets(ReservationRequest request, UUID userId) {

                String lockKey = "lock:booking:" + request.getTicketTypeId();
                RLock lock = redissonClient.getLock(lockKey);

                try {
                        if (!lock.tryLock(3, 5, TimeUnit.SECONDS)) {
                                throw new RuntimeException("System is busy. Please try again later.");
                        }

                        ticketTypeRepository.findById(request.getTicketTypeId())
                                        .orElseThrow(() -> new NotFoundException(
                                                        "Ticket type not found"));

                        int updated = ticketTypeRepository.reserveTickets(
                                        request.getTicketTypeId(),
                                        request.getQuantity());

                        if (updated == 0) {
                                throw new RuntimeException("Not enough tickets available for reservation");
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
                        throw new RuntimeException("Reservation process was interrupted", e);
                } finally {
                        if (lock.isHeldByCurrentThread()) {
                                lock.unlock();
                        }
                }
        }

        @Transactional
        public OrderResponse createOrder(CreateOrderRequest request, UUID userId) {

                String reservationKey = buildReservationKey(
                                request.getTicketTypeId(), userId);
                Object cached = redisTemplate.opsForValue().get(reservationKey);

                if (cached == null) {
                        throw new RuntimeException(
                                        "Expired reservation. Please reserve tickets again.");
                }

                int reservedQty = ((Number) cached).intValue();
                if (reservedQty < request.getQuantity()) {
                        throw new RuntimeException(
                                        "Invalid ticket quantity. Please select tickets again.");
                }

                TicketType ticketType = ticketTypeRepository
                                .findById(request.getTicketTypeId())
                                .orElseThrow(() -> new NotFoundException(
                                                "Ticket type not found"));

                BigDecimal total = ticketType.getPrice()
                                .multiply(BigDecimal.valueOf(request.getQuantity()));

                Order order = Order.builder()
                                .userId(userId)
                                .eventId(ticketType.getEvent().getEventId())
                                .orderCode(generateCode.generateOrderCode())
                                .status(OrderStatus.PENDING)
                                .totalAmount(total)
                                .expiresAt(LocalDateTime.now().plusSeconds(reservationTtl))
                                .build();
                orderRepository.save(order);

                List<Ticket> tickets = new ArrayList<>();
                for (int i = 0; i < request.getQuantity(); i++) {
                        Ticket ticket = Ticket.builder()
                                        .order(order)
                                        .event(ticketType.getEvent())
                                        .user(/* lấy từ userId */)
                                        .ticketType(ticketType)
                                        .ticketCode(generateCode.generateTicketCode())
                                        .status(TicketStatus.PENDING)
                                        .price(ticketType.getPrice())
                                        .build();
                        tickets.add(ticket);
                }
                ticketRepository.saveAll(tickets);

                return OrderResponse.from(order);
        }

        @Transactional
        public void confirmOrder(String orderCode) {

                Order order = orderRepository.findByOrderCode(orderCode)
                                .orElseThrow(() -> new NotFoundException(
                                                "Order không tồn tại: " + orderCode));

                if (order.getStatus() != OrderStatus.PENDING) {
                        throw new RuntimeException(
                                        "Order đã được xử lý trước đó.");
                }

                order.setStatus(OrderStatus.CONFIRMED);
                order.setPaidAt(LocalDateTime.now());
                orderRepository.save(order);

                List<Ticket> tickets = ticketRepository
                                .findByOrderOrderId(order.getOrderId());

                if (tickets.isEmpty()) {
                        throw new RuntimeException(
                                        "Không tìm thấy vé cho order: " + orderCode);
                }

                tickets.forEach(t -> {
                        t.setStatus(TicketStatus.CONFIRMED);
                        t.setQrCode(generateQrCode(t.getTicketCode()));
                });
                ticketRepository.saveAll(tickets);
                // reservedCount-- và soldCount++ (atomic)
                UUID ticketTypeId = tickets.get(0).getTicketType().getTicketTypeId();
                int updated = ticketTypeRepository.confirmTickets(ticketTypeId, tickets.size());

                if (updated == 0) {
                        throw new RuntimeException(
                                        "Lỗi cập nhật số lượng vé. Vui lòng kiểm tra lại.");
                }

                // Xóa reservation key khỏi Redis
                String reservationKey = buildReservationKey(
                                ticketTypeId, order.getUserId());
                redisTemplate.delete(reservationKey);
        }

        @Scheduled(fixedRate = 60_000)
        @Transactional
        public void cancelExpiredOrders() {

                List<Order> expiredOrders = orderRepository
                                .findBy(LocalDateTime.now());

                if (expiredOrders.isEmpty())
                        return;

                expiredOrders.forEach(order -> {
                        order.setStatus(OrderStatus.CANCELLED);
                        order.setCancelledAt(LocalDateTime.now());
                        orderRepository.save(order);
                        List<Ticket> tickets = ticketRepository
                                        .findByOrderOrderId(order.getOrderId());

                        if (!tickets.isEmpty()) {
                                // Hoàn lại reserved_count bằng releaseReservedTickets()
                                UUID ticketTypeId = tickets.get(0)
                                                .getTicketType().getTicketTypeId();
                                ticketTypeRepository.releaseReservedTickets(
                                                ticketTypeId, tickets.size());

                                // Hủy tất cả tickets
                                tickets.forEach(t -> t.setStatus(TicketStatus.CANCELLED));
                                ticketRepository.saveAll(tickets);
                        }
                });

                System.out.println("[Scheduler] Đã hủy "
                                + expiredOrders.size() + " order hết hạn lúc "
                                + LocalDateTime.now());
        }

        private String buildReservationKey(UUID ticketTypeId, UUID userId) {
                return "reservation:" + ticketTypeId + ":" + userId;
        }
}
