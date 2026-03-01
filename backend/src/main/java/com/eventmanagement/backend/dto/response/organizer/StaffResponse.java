package com.eventmanagement.backend.dto.response.organizer;

import java.time.LocalDateTime;
import java.util.UUID;

public interface StaffResponse {
    UUID getUserId();
    String getEmail();
    String getFullName();
    String getPhone();
    String getAvatarUrl();
    String getPositionName();
    LocalDateTime getAppliedAt();
}
