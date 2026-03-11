package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.model.TicketType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface TicketTypeRepository extends JpaRepository<TicketType, UUID> {
        List<TicketType> findByEvent_EventIdAndIsActiveTrue(UUID eventId);

        @Modifying
        @Query("UPDATE TicketType t " +
                        "SET t.reservedCount = t.reservedCount + :amount " +
                        "WHERE t.ticketTypeId = :id " +
                        "AND (t.quantity - t.soldCount - t.reservedCount) >= :amount")
        int reserveTickets(
                        @Param("id") UUID id,
                        @Param("amount") int amount);

        @Modifying
        @Query("UPDATE TicketType t " +
                        "SET t.reservedCount = t.reservedCount - :amount " +
                        "WHERE t.ticketTypeId = :id " +
                        "AND t.reservedCount >= :amount")
        int releaseReservedTickets(
                        @Param("id") UUID id,
                        @Param("amount") int amount);

        @Modifying
        @Query("UPDATE TicketType t " +
                        "SET t.reservedCount = t.reservedCount - :amount, " +
                        "    t.soldCount = t.soldCount + :amount " +
                        "WHERE t.ticketTypeId = :id " +
                        "AND t.reservedCount >= :amount")
        int confirmTickets(
                        @Param("id") UUID id,
                        @Param("amount") int amount);

        List<TicketType> findByEvent_EventSlugAndIsActiveTrue(String eventSlug);
}
