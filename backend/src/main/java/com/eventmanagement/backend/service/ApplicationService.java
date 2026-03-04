package com.eventmanagement.backend.service;


import com.eventmanagement.backend.dto.response.attendee.StaffApplicationResponse;
import com.eventmanagement.backend.model.StaffApplication;
import com.eventmanagement.backend.repository.StaffApplicationRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final StaffApplicationRepository applicationRepository;
    private final ObjectMapper objectMapper;

    public List<StaffApplicationResponse> getMyApplications(UUID userId) {
        List<StaffApplication> applications = applicationRepository.findAllByUser_UserIdOrderByAppliedAtDesc(userId);
        return mapToResponse(applications);

    }

    private List<StaffApplicationResponse> mapToResponse(List<StaffApplication> applications) {

        return applications.stream().map(app ->
                        StaffApplicationResponse.builder()
                                .applicationId(app.getApplicationId())
                                .recruitmentId(app.getRecruitment().getRecruitmentId())
                                .positionName(app.getRecruitment().getPositionName())
                                .eventName(app.getRecruitment().getEvent().getEventName())
                                .status(app.getApplicationStatus().name())
                                .location(app.getRecruitment().getEvent().getLocation())
                                .bannerUrl(app.getRecruitment().getEvent().getBannerUrl())
                                .appliedAt(app.getAppliedAt())
                                .reviewedAt(app.getReviewedAt())
                                .eventId(app.getRecruitment().getEvent().getEventId())
                                .eventSlug(app.getRecruitment().getEvent().getEventSlug())
                                .build())
                .collect(Collectors.toList());
    }
}
