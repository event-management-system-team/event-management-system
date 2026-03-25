package com.eventmanagement.backend.service.organizer;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import com.eventmanagement.backend.constants.RecruitmentStatus;
import com.eventmanagement.backend.repository.RecruitmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eventmanagement.backend.constants.ApplicationStatus;
import com.eventmanagement.backend.dto.response.organizer.ApplicationResponseDTO;
import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.model.EventStaff;
import com.eventmanagement.backend.model.Recruitment;
import com.eventmanagement.backend.model.StaffApplication;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.repository.EventStaffRepository;
import com.eventmanagement.backend.repository.StaffApplicationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ApplicationServiceOrganizer {

    @Autowired
    private final StaffApplicationRepository staffapplicationRepository;
    @Autowired
    private final EventStaffRepository eventStaffRepository;
    private final RecruitmentRepository recruitmentRepository;


    @Transactional(readOnly = true)
    public List<ApplicationResponseDTO> getApplicationsByRecruitment(UUID recruitmentId) {
        List<StaffApplication> applications = staffapplicationRepository.findByRecruitment_RecruitmentId(recruitmentId);

        return applications.stream().map(app -> {
            String cvUrl = null;
            Map<String, Object> customAnswers = null;
            if (app.getApplicationData() != null) {
                cvUrl = (String) app.getApplicationData().get("cvUrl");
                // Lấy tất cả field trừ cvUrl làm custom answers
                customAnswers = app.getApplicationData().entrySet().stream()
                        .filter(e -> !"cvUrl".equals(e.getKey()))
                        .collect(java.util.stream.Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
                if (customAnswers.isEmpty()) customAnswers = null;
            }

            java.util.List<java.util.Map<String, Object>> formSchema =
                    app.getRecruitment().getCustomForm() != null
                    ? app.getRecruitment().getCustomForm().getFormSchema()
                    : null;

            return ApplicationResponseDTO.builder()
                    .id(app.getApplicationId())
                    .name(app.getUser().getFullName())
                    .email(app.getUser().getEmail())
                    .phone(app.getUser().getPhone())
                    .avatar(app.getUser().getAvatarUrl())
                    .position(app.getRecruitment().getPositionName())
                    .cvUrl(cvUrl)
                    .customAnswers(customAnswers)
                    .formSchema(formSchema)
                    .status(app.getApplicationStatus() != null ? app.getApplicationStatus().name() : null)
                    .appliedAt(app.getAppliedAt())
                    .reviewedAt(app.getReviewedAt())
                    .createdAt(app.getCreatedAt())
                    .updatedAt(app.getUpdatedAt())
                    .build();
        }).collect(Collectors.toList());

    }

    @Transactional(readOnly = true)
    public List<ApplicationResponseDTO> getApplicationsByEvent(UUID eventId) {
        List<StaffApplication> applications = staffapplicationRepository.findByRecruitment_Event_EventId(eventId);

        return applications.stream().map(app -> {
            String cvUrl = null;
            Map<String, Object> customAnswers = null;
            if (app.getApplicationData() != null) {
                cvUrl = (String) app.getApplicationData().get("cvUrl");
                customAnswers = app.getApplicationData().entrySet().stream()
                        .filter(e -> !"cvUrl".equals(e.getKey()))
                        .collect(java.util.stream.Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
                if (customAnswers.isEmpty()) customAnswers = null;
            }

            java.util.List<java.util.Map<String, Object>> formSchema =
                    app.getRecruitment().getCustomForm() != null
                    ? app.getRecruitment().getCustomForm().getFormSchema()
                    : null;

            return ApplicationResponseDTO.builder()
                    .id(app.getApplicationId())
                    .name(app.getUser().getFullName())
                    .email(app.getUser().getEmail())
                    .phone(app.getUser().getPhone())
                    .avatar(app.getUser().getAvatarUrl())
                    .position(app.getRecruitment().getPositionName())
                    .cvUrl(cvUrl)
                    .customAnswers(customAnswers)
                    .formSchema(formSchema)
                    .status(app.getApplicationStatus() != null ? app.getApplicationStatus().name() : null)
                    .appliedAt(app.getAppliedAt())
                    .reviewedAt(app.getReviewedAt())
                    .createdAt(app.getCreatedAt())
                    .updatedAt(app.getUpdatedAt())
                    .build();
        }).collect(Collectors.toList());
    }



    @Transactional
    public void updateApplicationStatus(UUID applicationId, ApplicationStatus newStatus) {
        StaffApplication application = staffapplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn ứng tuyển với ID: " + applicationId));
        application.setApplicationStatus(newStatus);
        application.setReviewedAt(LocalDateTime.now());
        staffapplicationRepository.save(application);

    }

    @Transactional
    public StaffApplication updateApplicationStatuses(UUID applicationId, ApplicationStatus newStatus) {
        StaffApplication application = staffapplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn ứng tuyển này!"));

        ApplicationStatus oldStatus = application.getApplicationStatus();

        application.setApplicationStatus(newStatus);
        if (newStatus == ApplicationStatus.APPROVED && oldStatus != ApplicationStatus.APPROVED) {
            Recruitment recruitment = application.getRecruitment();
            Event event = recruitment.getEvent();
            User applicant = application.getUser();

            boolean isAlreadyStaff = eventStaffRepository.existsByEvent_EventIdAndUser_UserId(
                    event.getEventId(), applicant.getUserId()
            );

            if (!isAlreadyStaff) {
                EventStaff newStaff = new EventStaff();
                newStaff.setEvent(event);
                newStaff.setUser(applicant);
                newStaff.setStaffRole(recruitment.getPositionName());
                newStaff.setAssignedAt(LocalDateTime.now());
                eventStaffRepository.save(newStaff);
            }

            recruitment.setApprovedCount(recruitment.getApprovedCount() + 1);

            if (recruitment.getApprovedCount() >= recruitment.getVacancy()) {
                recruitment.setStatus(RecruitmentStatus.CLOSED);
            }

            recruitmentRepository.save(recruitment);
        }
        return staffapplicationRepository.save(application);
    }

    @Transactional(readOnly = true)
    public ApplicationResponseDTO getApplicationDetail(UUID applicationId) {
        StaffApplication app = staffapplicationRepository.findByApplicationId(applicationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn ứng tuyển này"));

        String cvUrl = null;
        Map<String, Object> customAnswers = null;

        if (app.getApplicationData() != null) {
            cvUrl = (String) app.getApplicationData().get("cvUrl");
            customAnswers = app.getApplicationData().entrySet().stream()
                    .filter(e -> !"cvUrl".equals(e.getKey()))
                    .collect(java.util.stream.Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
            if (customAnswers.isEmpty()) customAnswers = null;
        }
        java.util.List<java.util.Map<String, Object>> formSchema =
                app.getRecruitment().getCustomForm() != null
                ? app.getRecruitment().getCustomForm().getFormSchema()
                : null;

        return ApplicationResponseDTO.builder()
                .id(app.getApplicationId())
                .name(app.getUser().getFullName())
                .email(app.getUser().getEmail())
                .phone(app.getUser().getPhone())
                .avatar(app.getUser().getAvatarUrl())
                .position(app.getRecruitment().getPositionName())
                .cvUrl(cvUrl)
                .customAnswers(customAnswers)
                .formSchema(formSchema)
                .status(app.getApplicationStatus() != null ? app.getApplicationStatus().name() : null)
                .appliedAt(app.getAppliedAt())
                .build();
    }
}
