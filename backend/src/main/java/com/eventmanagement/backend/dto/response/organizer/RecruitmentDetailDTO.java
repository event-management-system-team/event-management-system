package com.eventmanagement.backend.dto.response.organizer;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RecruitmentDetailDTO {
    private UUID recruitmentId;
    private String eventName;
    private String positionName;
    private String description;
    private String benefits; 
    private Integer vacancy;
    private String requirements; 
    private LocalDateTime deadline;
    private String status;
}