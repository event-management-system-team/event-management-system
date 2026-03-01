package com.eventmanagement.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateStaffScheduleRequest {
    @NotBlank(message = "Schedule name is required")
    @Size(max = 100, message = "Schedule name exceeds maximum length")
    private String scheduleName;

    @Size(max = 255, message = "Description exceeds maximum length")
    private String description;

    @NotNull(message = "Start time is required")
    @FutureOrPresent(message = "Start time must be today or in the future")
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    private LocalDateTime endTime;

    @NotBlank(message = "Location is required")
    @Size(max = 255, message = "Location exceeds maximum length")
    private String location;

    @NotNull(message = "Required staff is required")
    @Min(value = 1, message = "Required staff must be at least 1")
    @Max(value = 1000, message = "Required staff exceeds allowed limit")
    private Integer requiredStaff;

    @AssertTrue(message = "End date must be after start date")
    public boolean isEndDateValid() {
        if (startTime == null || endTime == null) return true;
        return endTime.isAfter(startTime) || endTime.isEqual(startTime);
    }
}
