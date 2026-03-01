package com.eventmanagement.backend.service;

import com.eventmanagement.backend.constants.EventStatus;
import com.eventmanagement.backend.constants.RecruitmentStatus;
import com.eventmanagement.backend.dto.response.attendee.OrganizerResponse;
import com.eventmanagement.backend.dto.response.attendee.RecruitmentResponse;
import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.model.Recruitment;
import com.eventmanagement.backend.repository.RecruitmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class RecruitmentService {
    private final RecruitmentRepository recruitmentRepository;

    public List<RecruitmentResponse> getRecentRecruitments() {

        Pageable topFour = PageRequest.of(0, 4);
        List<String> topEvent = recruitmentRepository.findRecentEventWithOpenRecruitments(topFour);

        if (topEvent.isEmpty()) {
            return List.of();
        }

        List<Recruitment> recruitments = recruitmentRepository.findRecruitmentsByEventSlugs(topEvent);

        Map<Event, List<Recruitment>> groupedByEvent = recruitments.stream()
                .collect(Collectors.groupingBy((recruitment) -> recruitment.getEvent()));

        return groupRecruitmentByEvent(recruitments);
    }

    public Page<RecruitmentResponse> searchRecruitments(String keyword, String location,
                                                        LocalDate deadline,
                                                        int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        String kw = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;
        String loc = (location != null && !location.trim().isEmpty()) ? location.trim() : null;

        LocalDateTime dl = null;
        if (deadline != null) {
            dl = deadline.atTime(LocalTime.MAX);
        }


        Page<String> eventSlugs = recruitmentRepository.searchEventSlug(EventStatus.APPROVED, kw, loc, dl, pageable);

        if (eventSlugs.isEmpty()) {
            return Page.empty(pageable);
        }
        List<Recruitment> recruitments = recruitmentRepository.searchRecruitments(RecruitmentStatus.OPEN, eventSlugs.getContent());

        List<RecruitmentResponse> groupByEvent = groupRecruitmentByEvent(recruitments);

        return new PageImpl<>(groupByEvent, pageable, eventSlugs.getTotalElements());
    }

    private List<RecruitmentResponse> groupRecruitmentByEvent(List<Recruitment> recruitments) {
        Map<Event, List<Recruitment>> groupedByEvent = recruitments.stream()
                .collect(Collectors.groupingBy(Recruitment::getEvent));

        List<RecruitmentResponse> responseList = groupedByEvent.entrySet().stream()
                .map(entry -> mapToResponse(entry.getKey(), entry.getValue()))
                .sorted(Comparator.comparing(RecruitmentResponse::getCreatedAt).reversed())
                .collect(Collectors.toList());
        return responseList;
    }

    private RecruitmentResponse mapToResponse(Event event, List<Recruitment> positions) {

        Recruitment recruitment = positions.get(0);
        List<RecruitmentResponse.PositionDto> positionDTO = positions.stream()
                .map((position) -> RecruitmentResponse.PositionDto.builder()
                        .recruitmentId(position.getRecruitmentId())
                        .positionName(position.getPositionName())
                        .vacancy(position.getVacancy())
                        .availableSlots(position.getVacancy() - position.getApprovedCount())
                        .requirements(position.getRequirements())
                        .build()
                ).toList();

        OrganizerResponse organizerResponses = null;
        if (event.getOrganizer() != null) {
            organizerResponses = OrganizerResponse.builder()
                    .userId(event.getOrganizer().getUserId())
                    .fullName(event.getOrganizer().getFullName())
                    .avatarUrl(event.getOrganizer().getAvatarUrl())
                    .email(event.getOrganizer().getEmail())
                    .build();
        }


        return RecruitmentResponse.builder()
                .eventId(event.getEventId())
                .eventSlug(event.getEventSlug())
                .eventName(event.getEventName())
                .eventBannerUrl(event.getBannerUrl())
                .location(event.getLocation())
                .description(recruitment.getDescription())
                .deadline(recruitment.getDeadline())
                .createdAt(recruitment.getCreatedAt())
                .status(recruitment.getStatus())
                .positions(positionDTO)
                .organizer(organizerResponses)
                .build();
    }
}
