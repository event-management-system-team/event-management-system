package com.eventmanagement.backend.dto.response.organizer;

import java.time.LocalDateTime;
import java.util.UUID;

public interface AssignmentFlatProjection {
    UUID getStaffId();
    UUID getAssignmentId();
    UUID getScheduleId();

    String getScheduleName();
    LocalDateTime getStartTime();
    LocalDateTime getEndTime();
    String getLocation();
    String getStatus();

    UUID getUserId();
    String getFullName();
    String getEmail();
    String getAvatarUrl();
}
