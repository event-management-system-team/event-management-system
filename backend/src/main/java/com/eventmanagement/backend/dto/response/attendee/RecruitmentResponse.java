package com.eventmanagement.backend.dto.response.attendee;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecruitmentResponse {
    private UUID recruitmentId;
    private UUID eventId;
    private String eventName;
    private String positionName;
    private String description;
    private String requirements;
    private int vacancy;
    private int approvedCount;
    private int availableSlots;
    private LocalDateTime deadline;
    private String status;
    private LocalDateTime createdAt;
    private String eventBannerUrl;
}
