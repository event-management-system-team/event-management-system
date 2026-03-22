package com.eventmanagement.backend.service;


import com.eventmanagement.backend.constants.ApplicationStatus;
import com.eventmanagement.backend.dto.response.attendee.StaffApplicationResponse;
import com.eventmanagement.backend.model.Recruitment;
import com.eventmanagement.backend.model.StaffApplication;
import com.eventmanagement.backend.repository.StaffApplicationRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.persistence.Column;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import lombok.RequiredArgsConstructor;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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
