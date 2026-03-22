package com.eventmanagement.backend.dto.response.organizer;

import com.eventmanagement.backend.constants.RecruitmentStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecruitmentResponse {

    private UUID recruitmentId;

    private UUID eventId;
    private String eventName;

    private UUID formId;
    private String formName;

    private String positionName;
    private String description;
    private Integer vacancy;
    private Integer approvedCount;

    private List<String> requirements;
    private List<String> benefits;

    private LocalDateTime deadline;
    private RecruitmentStatus status;

    private Integer remainingSlots;
    private boolean isDeadlinePassed;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
