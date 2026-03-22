package com.eventmanagement.backend.dto.response.attendee;

import com.eventmanagement.backend.constants.RecruitmentStatus;
import lombok.*;

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
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String description;
    private LocalDateTime deadline;
    private LocalDateTime createdAt;
    private RecruitmentStatus status;
    private List<PositionResponse> positions;
    private OrganizerResponse organizer;
    private List<BenefitRecruitmentDto> benefits;
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