package com.eventmanagement.backend.dto.response.attendee;

import com.eventmanagement.backend.constants.RecruitmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecruitmentResponse {
    private UUID eventId;
    private String eventSlug;
    private String eventName;
    private String eventBannerUrl;
    private String location;
    private String description;
    private LocalDateTime deadline;
    private LocalDateTime createdAt;

    private RecruitmentStatus status;
    private List<PositionDto> positions;
    private OrganizerResponse organizer;

    @Data
    @Builder
    public static class PositionDto {
        private UUID recruitmentId;
        private String positionName;
        private int vacancy;
        private int availableSlots;
        private String requirements;
    }
}