package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.dto.response.organizer.StaffScheduleResponse;
import com.eventmanagement.backend.model.StaffSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface StaffScheduleRepository extends JpaRepository<StaffSchedule,UUID> {
    @Query(value = """
        SELECT 
            ss.schedule_id   AS scheduleId,
            ss.schedule_name AS scheduleName,
            ss.description   AS description,
            ss.start_time    AS startTime,
            ss.end_time      AS endTime,
            ss.location      AS location,
            ss.required_staff AS requiredStaff
        FROM staff_schedules ss
        WHERE ss.event_id = :eventId
        ORDER BY ss.start_time ASC
        """, nativeQuery = true)
    List<StaffScheduleResponse> findSchedulesByEventId(@Param("eventId") UUID eventId);
}
