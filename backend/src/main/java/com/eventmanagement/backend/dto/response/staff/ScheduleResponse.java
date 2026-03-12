package com.eventmanagement.backend.dto.response.staff;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
public class ScheduleResponse {
    private UUID assignmentId;
    private String scheduleName;
    private String location;
    private String status;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
