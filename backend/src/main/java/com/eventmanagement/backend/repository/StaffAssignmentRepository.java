package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.constants.AssignmentStatus;
import com.eventmanagement.backend.dto.response.organizer.AssignmentFlatProjection;
import com.eventmanagement.backend.model.StaffAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface  StaffAssignmentRepository extends JpaRepository<StaffAssignment, UUID> {

    @Query(value = """
    SELECT
        sa.staff_id      AS staffId,
        sa.assignment_id AS assignmentId,
        ss.schedule_id   AS scheduleId,
        ss.schedule_name AS scheduleName,
        ss.start_time    AS startTime,
        ss.end_time      AS endTime,
        ss.location      AS location,
        sa.status        AS status,
        u.user_id        AS userId,
        u.full_name      AS fullName,
        u.email          AS email,
        u.avatar_url     AS avatarUrl
    FROM staff_assignments sa
    JOIN staff_schedules ss ON ss.schedule_id = sa.schedule_id
    JOIN users u ON u.user_id = sa.staff_id
    WHERE ss.event_id = :eventId
    ORDER BY sa.staff_id, ss.start_time
""", nativeQuery = true)
    List<AssignmentFlatProjection> findAllAssignmentsByEvent(@Param("eventId") UUID eventId);

    boolean existsBySchedule_ScheduleIdAndStaff_UserId(UUID scheduleId, UUID staffId);

    long countBySchedule_ScheduleIdAndStatusIn(
            UUID scheduleId,
            List<AssignmentStatus> statuses
    );
}
