package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TicketRepository extends JpaRepository<Ticket, UUID> {
    List<Ticket> findByOrderOrderId(UUID orderId);

    boolean existsByQrCode(String qrCode);

    List<Ticket> findByUserId(UUID userId);

    Optional<Ticket> findByTicketCode(String ticketCode);

    int countByOrderOrderId(UUID orderId);
}
