package com.eventmanagement.backend.dto.response.staff;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
public class ScheduleResponse {
    private UUID assignmentId;
    private String scheduleName;
    private String timeRange;
    private String location;
    private String status;
}
