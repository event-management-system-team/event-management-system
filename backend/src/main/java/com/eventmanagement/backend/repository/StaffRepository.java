package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.dto.response.organizer.StaffResponse;
import com.eventmanagement.backend.model.EventStaff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface StaffRepository extends JpaRepository<EventStaff, UUID> {
//    List<StaffResponse> findEventStaffByEventEventId(UUID eventId);

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
    AND es.staffRole = :role
""")
    List<StaffResponse> findStaffByEventIdAndOptionalRole(
            @Param("eventId") UUID eventId,
            @Param("role") String role
    );
}
