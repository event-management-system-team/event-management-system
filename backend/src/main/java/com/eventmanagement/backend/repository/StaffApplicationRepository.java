package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.model.StaffApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.UUID;

public interface StaffApplicationRepository extends JpaRepository<StaffApplication, UUID> {

    @Query("""
    SELECT CASE WHEN COUNT(sa) > 0 THEN true ELSE false END
    FROM StaffApplication sa
    JOIN sa.recruitment r
    WHERE sa.user.userId = :userId
      AND r.event.eventId = :eventId
      AND sa.status = 'APPROVED'
""")
    boolean existsApprovedByUserAndEvent(UUID userId, UUID eventId);
}
