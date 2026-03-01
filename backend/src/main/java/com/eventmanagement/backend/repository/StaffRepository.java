package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.dto.response.organizer.StaffResponse;
import com.eventmanagement.backend.model.StaffApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface StaffRepository extends JpaRepository<StaffApplication, UUID> {
    @Query(value = """
        SELECT DISTINCT
            u.user_id       AS userId,
            u.email         AS email,
            u.full_name     AS fullName,
            u.phone         AS phone,
            u.avatar_url    AS avatarUrl,
            r.position_name AS positionName,
            sa.applied_at   AS appliedAt
        FROM users u
        JOIN staff_applications sa 
          ON sa.user_id = u.user_id
        JOIN recruitments r 
          ON r.recruitment_id = sa.recruitment_id
        WHERE r.event_id = :eventId
          AND sa.status = 'APPROVED'
          AND u.status = 'ACTIVE'
        """, nativeQuery = true)
    List<StaffResponse> findApprovedStaffByEventId(@Param("eventId") UUID eventId);
}
