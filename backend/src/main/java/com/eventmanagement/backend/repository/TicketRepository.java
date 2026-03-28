package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.constants.TicketStatus;
import com.eventmanagement.backend.model.Ticket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, UUID> {

    List<Ticket> findByOrderOrderId(UUID orderId);

    boolean existsByQrCodeUrl(String qrCode);

    List<Ticket> findByUserUserId(UUID userId);

    Optional<Ticket> findByTicketCode(String ticketCode);

    int countByOrderOrderId(UUID orderId);

    @Query("SELECT DISTINCT t FROM Ticket t LEFT JOIN FETCH t.checkIn c WHERE t.event.eventSlug = :eventSlug " +
            "AND (:keyword IS NULL OR " +
            "LOWER(t.ticketCode) LIKE LOWER(CONCAT('%', cast(:keyword as string), '%')) OR " +
            "LOWER(t.user.fullName) LIKE LOWER(CONCAT('%', cast(:keyword as string), '%')) OR " +
            "LOWER(t.user.email) LIKE LOWER(CONCAT('%', cast(:keyword as string), '%')))")
    List<Ticket> searchTicketsByKeyword(@Param("eventSlug") String eventSlug, @Param("keyword") String keyword);

    long countByTicketType_TicketTypeIdAndStatus(UUID ticketTypeTicketTypeId, TicketStatus status);

    /**
     * Lấy danh sách ticket đã confirmed/paid/checked_in cho event (dùng cho Attendee List)
     */
    @Query("SELECT t FROM Ticket t " +
            "JOIN FETCH t.user u " +
            "LEFT JOIN FETCH t.ticketType tt " +
            "LEFT JOIN FETCH t.checkIn ci " +
            "WHERE t.event.eventId = :eventId " +
            "AND t.status IN :statuses " +
            "AND (:ticketTypeName IS NULL OR tt.ticketName = :ticketTypeName) " +
            "ORDER BY t.createdAt DESC")
    Page<Ticket> findAttendeeTicketsByEventId(
            @Param("eventId") UUID eventId,
            @Param("statuses") List<TicketStatus> statuses,
            @Param("ticketTypeName") String ticketTypeName,
            Pageable pageable);
}