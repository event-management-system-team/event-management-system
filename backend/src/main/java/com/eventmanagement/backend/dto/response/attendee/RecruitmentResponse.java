package com.eventmanagement.backend.dto.response.attendee;

import com.eventmanagement.backend.constants.RecruitmentStatus;
import com.eventmanagement.backend.model.BenefitRecruitment;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
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
    private List<BenefitRecruitmentDto> benefits;

    @Data
    @Builder
    public static class PositionDto {
        private UUID recruitmentId;
        private String positionName;
        private int vacancy;
        private int availableSlots;
        private String requirements;
    }

    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    @Getter
    @Setter
    public static class BenefitRecruitmentDto {
        private String icon;
        private String title;
        private String description;
    }
}