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

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PositionDTO {
        @NotBlank(message = "Position name is required")
        @Size(max = 255, message = "Position name exceeds maximum length")
        private String positionName;

        @NotNull(message = "Vacancy is required")
        @Min(value = 1, message = "At least 1 vacancy required")
        private Integer vacancy;

        private String description;

        private List<String> requirements;

        private List<String> benefits;
    }

    @NotEmpty(message = "At least one position is required")
    private List<PositionDTO> positions;

    // benefits are now inside PositionDTO (per-position)

    @Future(message = "Deadline must be in the future")
    private LocalDateTime deadline;

    private UUID formId;

    private RecruitmentStatus status;
}
