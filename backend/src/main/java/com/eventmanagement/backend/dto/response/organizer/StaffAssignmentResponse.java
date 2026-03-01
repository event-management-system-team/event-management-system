package com.eventmanagement.backend.dto.response.organizer;

import com.eventmanagement.backend.model.StaffAssignment;
import com.eventmanagement.backend.model.StaffSchedule;
import com.eventmanagement.backend.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class StaffAssignmentResponse {
    private UUID staffId;
    private UUID assignmentId;
    private UUID scheduleId;

    private String scheduleName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String location;
    private String status;

    private UserDTO staff;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserDTO {
        private UUID userId;
        private String fullName;
        private String email;
        private String avatarUrl;
    }
}