package com.eventmanagement.backend.service;

import com.eventmanagement.backend.constants.FormType;
import com.eventmanagement.backend.dto.response.attendee.ApplicationFormResponse;
import com.eventmanagement.backend.dto.response.attendee.PositionResponse;
import com.eventmanagement.backend.model.CustomForm;
import com.eventmanagement.backend.model.Recruitment;
import com.eventmanagement.backend.model.StaffApplication;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.repository.CustomFormRepository;
import com.eventmanagement.backend.repository.RecruitmentRepository;
import com.eventmanagement.backend.repository.StaffApplicationRepository;
import com.eventmanagement.backend.repository.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApplicationFormService {

    private final CustomFormRepository customFormRepository;
    private final RecruitmentRepository recruitmentRepository;
    private final StaffApplicationRepository applicationRepository;
    private final CloudinaryService cloudinaryService;
    private final ObjectMapper objectMapper;
    private final UserRepository userRepository;

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

    @Transactional
    public void submitApplication(UUID recruitmentId,
                                  UUID userId,
                                  String answersJson,
                                  MultipartFile cvFile) throws Exception {

        if (applicationRepository.existsByRecruitment_RecruitmentIdAndUser_UserId(recruitmentId, userId)) {
            throw new IllegalStateException("You have already applied for this position!");
        }

        log.info("Loading CV to Cloudinary: {}", userId);
        String cvUrl = cloudinaryService.uploadCV(cvFile);

        Map<String, Object> applicationDataMap = objectMapper.readValue(
                answersJson,
                new TypeReference<Map<String, Object>>() {
                }
        );

        applicationDataMap.put("cvUrl", cvUrl);

        Recruitment recruitment = recruitmentRepository.findById(recruitmentId)
                .orElseThrow(() -> new IllegalArgumentException("Job position not found!"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User information not found!"));

        StaffApplication application = StaffApplication.builder()
                .recruitment(recruitment)
                .user(user)
                .applicationData(applicationDataMap)
                .build();

        applicationRepository.save(application);
        log.info("Apply success. Application ID: {}", application.getApplicationId());
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