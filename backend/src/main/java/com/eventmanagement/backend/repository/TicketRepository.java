package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, UUID> {

    @Query("SELECT DISTINCT t FROM Ticket t LEFT JOIN FETCH t.checkIn c WHERE t.event.eventSlug = :eventSlug " +
            "AND (:keyword IS NULL OR " +
            "LOWER(t.ticketCode) LIKE LOWER(CONCAT('%', cast(:keyword as string), '%')) OR " +
            "LOWER(t.user.fullName) LIKE LOWER(CONCAT('%', cast(:keyword as string), '%')) OR " +
            "LOWER(t.user.email) LIKE LOWER(CONCAT('%', cast(:keyword as string), '%')))")
    List<Ticket> searchTicketsByKeyword(@Param("eventSlug") String eventSlug, @Param("keyword") String keyword);

    Optional<Ticket> findByTicketCode(String ticketCode);

}
