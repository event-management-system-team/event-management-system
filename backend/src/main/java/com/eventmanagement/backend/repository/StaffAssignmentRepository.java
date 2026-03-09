package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.dto.response.organizer.AssignmentByRoleResponse;
import com.eventmanagement.backend.dto.response.organizer.AssignmentListProjection;
import com.eventmanagement.backend.model.StaffAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

public interface  StaffAssignmentRepository extends JpaRepository<StaffAssignment, UUID> {
    @Query(value = """
        SELECT 
            sa.assignment_id AS assignmentId,
            ss.schedule_id AS scheduleId,
            ss.schedule_name AS scheduleName,
            es.staff_role AS staffRole,
            ss.start_time AS startTime,
            ss.end_time AS endTime,
            ss.location AS location,
            sa.status AS status,
            sa.assigned_at AS assignedAt
        FROM staff_assignments sa
        JOIN staff_schedules ss 
            ON sa.schedule_id = ss.schedule_id
        JOIN event_staffs es 
            ON sa.event_staff_id = es.event_staff_id
        WHERE ss.event_id = :eventId
        ORDER BY ss.start_time ASC
        """,
            nativeQuery = true)
    List<AssignmentListProjection> findAssignmentsByEvent(UUID eventId);

    @Query("""
    SELECT new com.eventmanagement.backend.dto.response.organizer.AssignmentByRoleResponse(
        s.scheduleId,
        s.scheduleName,
        es.staffRole,
        COUNT(sa.assignmentId),
        s.startTime,
        s.endTime,
        s.location
    )
    FROM StaffAssignment sa
    JOIN sa.schedule s
    JOIN sa.eventStaff es
    WHERE s.event.eventId = :eventId
    GROUP BY 
        s.scheduleId,
        s.scheduleName,
        es.staffRole,
        s.startTime,
        s.endTime,
        s.location
    ORDER BY s.startTime
""")
    List<AssignmentByRoleResponse> findAssignmentsByRole(UUID eventId);

    @Query("SELECT a FROM StaffAssignment a JOIN FETCH a.schedule " +
            "WHERE a.eventStaff.eventStaffId = :eventStaffId " +
            "ORDER BY a.schedule.startTime ASC")
    List<StaffAssignment> findAssignmentsByStaffId(@Param("eventStaffId") UUID eventStaffId);
}