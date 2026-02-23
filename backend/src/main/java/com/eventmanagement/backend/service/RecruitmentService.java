package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.response.attendee.RecruitmentResponse;
import com.eventmanagement.backend.model.Recruitment;
import com.eventmanagement.backend.repository.RecruitmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class RecruitmentService {
    private final RecruitmentRepository recruitmentRepository;

    public List<RecruitmentResponse> getRecentRecruitments() {
        Pageable pageable = PageRequest.of(0, 4);

        List<Recruitment> recruitments = recruitmentRepository.findRecentRecruitments(pageable);

        return recruitments.stream().map(recruitment -> mapToResponse(recruitment))
                .collect(Collectors.toList());
    }

    private RecruitmentResponse mapToResponse(Recruitment recruitment) {
        return RecruitmentResponse.builder()
                .recruitmentId(recruitment.getRecruitmentId())
                .eventId(recruitment.getEvent().getEventId())
                .eventName(recruitment.getEvent().getEventName())
                .eventBannerUrl(recruitment.getEvent().getBannerUrl())
                .positionName(recruitment.getPositionName())
                .description(recruitment.getDescription())
                .requirements(recruitment.getRequirements())
                .vacancy(recruitment.getVacancy())
                .approvedCount(recruitment.getApprovedCount())
                .availableSlots(recruitment.getVacancy() - recruitment.getApprovedCount())
                .deadline(recruitment.getDeadline())
                .status(recruitment.getStatus().name())
                .createdAt(recruitment.getCreatedAt())
                .build();
    }
}
