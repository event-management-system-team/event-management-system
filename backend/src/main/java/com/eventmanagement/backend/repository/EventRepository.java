package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.constants.EventStatus;
import com.eventmanagement.backend.model.Event;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

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

}
