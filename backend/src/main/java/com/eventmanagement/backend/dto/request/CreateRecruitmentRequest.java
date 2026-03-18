package com.eventmanagement.backend.dto.request;

import com.eventmanagement.backend.constants.RecruitmentStatus;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateRecruitmentRequest {

    @NotNull(message = "Select an event")
    private UUID eventId;

    @NotBlank(message = "Select a position")
    @Size(max = 255, message = "Position name exceeds maximum length")
    private String positionName;

    private String description;

    @NotNull(message = "Select a department")
    @Min(value = 1, message = "Department ID must be greater than 0")
    private Integer vacancy;

    private List<String> requirements;

    private List<String> benefits;

    @Future(message = "Deadline must be in the future")
    private LocalDateTime deadline;

    private UUID formId;

    @NotNull(message = "Select a status")
    private RecruitmentStatus status;
}
