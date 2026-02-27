package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.constants.EventStatus;
import com.eventmanagement.backend.model.Event;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {
    List<Event> findTop6ByStatusOrderByRegisteredCountDesc(EventStatus status);

    @Query("SELECT e FROM Event e " +
            "WHERE e.status = :status " +
            "AND e.totalCapacity > 0 " +
            "AND (e.registeredCount * 1.0 / e.totalCapacity) >= 0.8 " +
            "ORDER BY (e.totalCapacity - e.registeredCount) ASC")
    List<Event> findHotEventsSellingFast(@Param("status") EventStatus status, Pageable pageable);

    @Query("SELECT e FROM Event e " +
            "WHERE e.status = :status " +
            "AND (:keyword IS NULL OR LOWER(e.eventName) LIKE LOWER(CONCAT('%', cast(:keyword as string), '%'))) " +
            "AND (:location IS NULL OR LOWER(e.location) LIKE LOWER(CONCAT('%', cast(:location as string), '%'))) " +
            "AND (:categorySlug IS NULL OR e.category.categorySlug IN :categorySlug ) " +
            "AND (CAST(:startOfDay AS timestamp) IS NULL OR CAST(:endOfDay AS timestamp) IS NULL OR " +
            "(e.startDate <= :endOfDay AND e.endDate >= :startOfDay)) " +
            "AND (:price IS NULL OR EXISTS (SELECT t FROM e.ticketTypes t WHERE t.price <= :price))" +
            "AND (:isFree IS NULL OR e.isFree = :isFree) ")
    Page<Event> searchEvents(@Param("status") EventStatus status,
                             @Param("keyword") String keyword,
                             @Param("location") String location,
                             @Param("categorySlug") List<String> categorySlug,
                             @Param("startOfDay") LocalDateTime startOfDay,
                             @Param("endOfDay") LocalDateTime endOfDay,
                             @Param("price") BigDecimal price,
                             @Param("isFree") Boolean isFree,
                             Pageable pageable);

    @EntityGraph(attributePaths = {"agendas", "ticketTypes"})
    Event findEventByEventSlug(String eventSlug);

    long countByOrganizer_UserId(UUID organizerId);
}
