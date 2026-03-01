package com.eventmanagement.backend.dto.response.organizer;

import java.time.LocalDateTime;
import java.util.UUID;

public interface StaffScheduleResponse {
    UUID getScheduleId();
    String getScheduleName();
    String getDescription();
    LocalDateTime getStartTime();
    LocalDateTime getEndTime();
    String getLocation();
    Integer getRequiredStaff();
}
