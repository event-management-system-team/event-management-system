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
public class UpdateRecruitmentRequest {

    @NotBlank(message = "Select an event")
    @Size(max = 255)
    private String positionName;

    private String description;

    @Min(value = 1, message = "Vacancy must be greater than 0")
    private Integer vacancy;

    private List<String> requirements;

    private List<String> benefits;

    @Future(message = "Deadline must be in the future")
    private LocalDateTime deadline;

    private UUID formId;

    private RecruitmentStatus status;
}
