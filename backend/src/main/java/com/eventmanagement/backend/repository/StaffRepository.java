package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.dto.response.organizer.StaffResponse;
import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.model.EventStaff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

public interface StaffRepository extends JpaRepository<EventStaff, UUID> {
    @Query("""
    SELECT new com.eventmanagement.backend.dto.response.organizer.StaffResponse(
        es.eventStaffId,
        u.email,
        u.fullName,
        u.phone,
        u.avatarUrl,
        es.staffRole
    )
    FROM EventStaff es
    JOIN es.user u
    WHERE es.event.eventId = :eventId
""")
    List<StaffResponse> findStaffByEventId(@Param("eventId") UUID eventId);

    @Query("""
    SELECT new com.eventmanagement.backend.dto.response.organizer.StaffResponse(
        es.eventStaffId,
        u.email,
        u.fullName,
        u.phone,
        u.avatarUrl,
        es.staffRole
    )
    FROM EventStaff es
    JOIN es.user u
    WHERE es.event.eventId = :eventId
    AND LOWER(es.staffRole) = LOWER(:role)
""")
    List<StaffResponse> findStaffByEventIdAndOptionalRole(
            @Param("eventId") UUID eventId,
            @Param("role") String role
    );

    @Query("""
    SELECT es
    FROM EventStaff es
    WHERE es.event.eventId = :eventId
    AND UPPER(es.staffRole) IN :roles
""")
    List<EventStaff> findByEventIdAndRoles(
            @Param("eventId") UUID eventId,
            @Param("roles") List<String> roles
    );

    @Query("""
        SELECT DISTINCT es.staffRole
        FROM EventStaff es
        WHERE es.event.eventId = :eventId
    """)
    List<String> findRolesByEventId(@Param("eventId") UUID eventId);

    boolean existsByEventEventIdAndEventStaffId(UUID eventEventId, UUID eventStaffId);

    List<EventStaff> findByEventEventIdAndEventStaffIdIn(UUID eventEventId, Collection<UUID> eventStaffIds);

    UUID event(Event event);
}
