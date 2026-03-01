package com.eventmanagement.backend.service;

import com.eventmanagement.backend.constants.FormType;
import com.eventmanagement.backend.dto.response.attendee.ApplicationFormResponse;
import com.eventmanagement.backend.dto.response.attendee.PositionResponse;
import com.eventmanagement.backend.model.CustomForm;
import com.eventmanagement.backend.model.Recruitment;
import com.eventmanagement.backend.repository.CustomFormRepository;
import com.eventmanagement.backend.repository.RecruitmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationFormService {

    private final CustomFormRepository customFormRepository;
    private final RecruitmentRepository recruitmentRepository;

    @Transactional(readOnly = true)
    public ApplicationFormResponse getFormForAttendee(String eventSlug) {

        CustomForm customForm = customFormRepository
                .findByEvent_EventSlugAndFormTypeAndIsActiveTrue(eventSlug, FormType.RECRUITMENT)
                .orElseThrow(() -> new RuntimeException("The recruitment form is not currently available!"));

        List<Recruitment> recruitments = recruitmentRepository.findByEvent_EventSlug(eventSlug);

        if (recruitments.isEmpty()) {
            throw new RuntimeException("There are currently no openings for this event!");
        }

        return mapToResponse(customForm, recruitments);
    }

    private ApplicationFormResponse mapToResponse(CustomForm customForm, List<Recruitment> recruitments) {

        List<PositionResponse> positionResponses = recruitments.stream()
                .map(r -> PositionResponse.builder()
                        .recruitmentId(r.getRecruitmentId())
                        .positionName(r.getPositionName())
                        .vacancy(r.getVacancy())
                        .availableSlots(Math.max(0, r.getVacancy() - r.getApprovedCount()))
                        .requirements(r.getRequirements())
                        .build())
                .toList();

        LocalDateTime deadline = recruitments.get(0).getDeadline();
        String location = recruitments.get(0).getEvent().getLocation();

        return ApplicationFormResponse.builder()
                .eventName(customForm.getEvent().getEventName())
                .eventSlug(customForm.getEvent().getEventSlug())
                .deadline(deadline)
                .formSchema(customForm.getFormSchema())
                .location(location)
                .recruitments(positionResponses)
                .build();
    }
}