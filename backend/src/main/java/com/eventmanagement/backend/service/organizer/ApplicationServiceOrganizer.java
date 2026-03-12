package com.eventmanagement.backend.service.organizer;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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
    private  EventStaffRepository eventStaffRepository;


    @Transactional(readOnly = true)
    public List<ApplicationResponseDTO> getApplicationsByRecruitment(UUID recruitmentId) {
        List<StaffApplication> applications = staffapplicationRepository.findByRecruitment_RecruitmentId(recruitmentId);
        
return applications.stream().map(app -> {
    String coverLetter = null;
    String resume = null;
    if (app.getApplicationData() != null) {
        coverLetter = (String) app.getApplicationData().get("coverLetter");
        resume = (String) app.getApplicationData().get("resume");
    }

    return ApplicationResponseDTO.builder()
            .id(app.getApplicationId())
            .name(app.getUser().getFullName())
            .email(app.getUser().getEmail())
            .phone(app.getUser().getPhone())
            .avatar(app.getUser().getAvatarUrl())
            .position(app.getRecruitment().getPositionName()) 
            .resume(resume) 
            .coverLetter(coverLetter) 
            .status(app.getApplicationStatus() != null ? app.getApplicationStatus().name() : null) // Đã sửa thành getApplicationStatus()
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
    public StaffApplication updateApplicationStatuss(UUID applicationId, ApplicationStatus newStatus) {      
        StaffApplication application = staffapplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn ứng tuyển này!"));
        application.setApplicationStatus(newStatus);
          if (newStatus == ApplicationStatus.APPROVED) {
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
        }
        return staffapplicationRepository.save(application);
    }

    @Transactional(readOnly = true)
    public ApplicationResponseDTO getApplicationDetail(UUID applicationId) {
        StaffApplication app = staffapplicationRepository.findByApplicationId(applicationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn ứng tuyển này"));
                
        String coverLetter = null;
        String resume = null;
        
        if (app.getApplicationData() != null) {
            coverLetter = (String) app.getApplicationData().get("coverLetter");
            resume = (String) app.getApplicationData().get("resume");
        }

        return ApplicationResponseDTO.builder()
                .id(app.getApplicationId())
                .name(app.getUser().getFullName())
                .email(app.getUser().getEmail())
                .phone(app.getUser().getPhone())
                .avatar(app.getUser().getAvatarUrl())
                .position(app.getRecruitment().getPositionName())
                .resume(resume)
                .coverLetter(coverLetter)
                .status(app.getApplicationStatus() != null ? app.getApplicationStatus().name() : null)
                .appliedAt(app.getAppliedAt())
                .build();
    }
    
}
