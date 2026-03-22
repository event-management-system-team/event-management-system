package com.eventmanagement.backend.dto.response.organizer;

import java.time.LocalDateTime;
import java.util.UUID;

public interface AssignmentListProjection {
    UUID getAssignmentId();
    UUID getScheduleId();
    String getScheduleName();
    String getStaffRole();
    LocalDateTime getStartTime();
    LocalDateTime getEndTime();
    String getLocation();
    String getStatus();
    LocalDateTime getAssignedAt();
}
