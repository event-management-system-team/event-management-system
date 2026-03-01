package com.eventmanagement.backend.dto.response.organizer;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class ScheduleResponse {
    private UUID scheduleId;
    private String scheduleName;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String location;
    private Integer requiredStaff;
}
