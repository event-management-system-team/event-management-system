package com.eventmanagement.backend.dto.response.organizer;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class AssignmentResponse {
    private UUID assignmentId;
    private UUID staffId;
    private UUID scheduleId;
    private String status;
    private LocalDateTime assignedAt;
}
