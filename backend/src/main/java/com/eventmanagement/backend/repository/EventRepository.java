package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.constants.EventStatus;
import com.eventmanagement.backend.model.Event;

import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {
        List<Event> findTop6ByStatusInOrderByRegisteredCountDesc(List<EventStatus> statuses);

        @Query("SELECT e FROM Event e " +
                        "WHERE e.status IN :statuses " +
                        "AND e.totalCapacity > 0 " +
                        "AND (e.registeredCount * 1.0 / e.totalCapacity) >= 0.8 " +
                        "ORDER BY (e.totalCapacity - e.registeredCount) ASC")
        List<Event> findHotEventsSellingFast(@Param("statuses") List<EventStatus> statuses, Pageable pageable);

        @Query("SELECT e FROM Event e " +
                        "WHERE e.status IN :statuses " +
                        "AND (:keyword IS NULL OR LOWER(e.eventName) LIKE LOWER(CONCAT('%', cast(:keyword as string), '%'))) "
                        +
                        "AND (:location IS NULL OR LOWER(e.location) LIKE LOWER(CONCAT('%', cast(:location as string), '%'))) "
                        +
                        "AND (:categorySlug IS NULL OR e.category.categorySlug IN :categorySlug ) " +
                        "AND (CAST(:startOfDay AS timestamp) IS NULL OR CAST(:endOfDay AS timestamp) IS NULL OR " +
                        "(e.startDate <= :endOfDay AND e.endDate >= :startOfDay)) " +
                        "AND (:price IS NULL OR EXISTS (SELECT t FROM e.ticketTypes t WHERE t.price <= :price))" +
                        "AND (:isFree IS NULL OR e.isFree = :isFree) " +
                        "ORDER BY e.createdAt DESC")
        Page<Event> searchEvents(@Param("statuses") List<EventStatus> statuses,
                        @Param("keyword") String keyword,
                        @Param("location") String location,
                        @Param("categorySlug") List<String> categorySlug,
                        @Param("startOfDay") LocalDateTime startOfDay,
                        @Param("endOfDay") LocalDateTime endOfDay,
                        @Param("price") BigDecimal price,
                        @Param("isFree") Boolean isFree,
                        Pageable pageable);

        @EntityGraph(attributePaths = { "agendas", "ticketTypes" })
        Event findEventByEventSlug(String eventSlug);

        long countByOrganizer_UserId(UUID organizerId);

        long countByOrganizer_UserIdAndStatus(UUID organizerId, EventStatus status);

        Page<Event> findAll(Pageable pageable);

        Page<Event> findByOrganizer_UserId(UUID userId, Pageable pageable);

        // function to get status upcoming: approved + startDate > now
        @Query("SELECT COUNT(e) FROM Event e WHERE e.organizer.userId = :organizerId AND e.status = :status AND e.startDate > CURRENT_TIMESTAMP")
        long countByOrganizer_UserIdAndStatusAndStartDateAfterNow(
                        @Param("organizerId") UUID organizerId,
                        @Param("status") EventStatus status);

        @EntityGraph(attributePaths = "ticketTypes")
        @Query("SELECT e FROM Event e WHERE e.eventId IN :eventIds")
        List<Event> findWithTicketsByEventIdIn(@Param("eventIds") List<UUID> eventIds);

        // APPROVED -> ONGOING
        @Modifying
        @Transactional
        @Query("UPDATE Event e SET e.status = 'ONGOING' WHERE e.status = 'APPROVED' AND e.startDate <= CURRENT_TIMESTAMP")
        int updateStatusToOngoing();

        // ONGOING -> COMPLETED
        @Modifying
        @Transactional
        @Query("UPDATE Event e SET e.status = 'COMPLETED' WHERE e.status = 'ONGOING' AND e.endDate <= CURRENT_TIMESTAMP")
        int updateStatusToCompleted();

        @EntityGraph(attributePaths = { "ticketTypes", "agendas", "category" })
        @Query("SELECT e FROM Event e WHERE e.eventId = :eventId")
        Event findWithDetailsById(@Param("eventId") UUID eventId);

        @Modifying
        @Query(value = "DELETE FROM event_agendas WHERE event_id = :eventId", nativeQuery = true)
        void hardDeleteAgendasByEventId(@Param("eventId") UUID eventId);

        @Modifying
        @Query(value = "DELETE FROM ticket_types WHERE event_id = :eventId", nativeQuery = true)
        void hardDeleteTicketsByEventId(@Param("eventId") UUID eventId);

        @Modifying
        @Query(value = "DELETE FROM events WHERE event_id = :eventId", nativeQuery = true)
        void hardDeleteById(@Param("eventId") UUID eventId);
}
