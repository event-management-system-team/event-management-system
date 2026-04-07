package com.eventmanagement.backend.dto.response.organizer;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RecruitmentDetailDTO {
    private UUID recruitmentId;
    private UUID eventId;
    private String eventName;
    private String positionName;
    private String description;
    private List<String> benefits;
    private Integer vacancy;
    private String requirements;
    private LocalDateTime deadline;
    private LocalDateTime eventStartDate;
    private String status;
    private java.util.UUID formId;
}