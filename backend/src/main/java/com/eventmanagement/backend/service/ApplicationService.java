package com.eventmanagement.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eventmanagement.backend.dto.response.organizer.ApplicationResponseDTO;
import com.eventmanagement.backend.model.StaffApplication;
import com.eventmanagement.backend.model.StaffApplication.ApplicationStatus;
import com.eventmanagement.backend.repository.ApplicationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    @Transactional(readOnly = true)
    public List<ApplicationResponseDTO> getApplicationsByRecruitment(UUID recruitmentId) {
        List<StaffApplication> applications = applicationRepository.findByRecruitmentId(recruitmentId);
        
        return applications.stream().map(app -> ApplicationResponseDTO.builder()
                .id(app.getId())
                .name(app.getUser().getFullName())
                .email(app.getUser().getEmail()) 
                .phone(app.getUser().getPhone())
                .avatar(app.getUser().getAvatarUrl())
                .position(app.getRecruitment().getPositionName())
                .resume(app.getResume())
                .coverLetter(app.getCoverLetter()) 
                .status(app.getStatus().name())
                .appliedAt(app.getAppliedAt())
                .reviewedAt(app.getReviewedAt())
                .createdAt(app.getCreatedAt())
                .updatedAt(app.getUpdatedAt())
                .build()
        ).collect(Collectors.toList());
 
    }
    

    @Transactional
    public void updateApplicationStatus(UUID applicationId, ApplicationStatus newStatus) {
        StaffApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn ứng tuyển với ID: " + applicationId));
        
        application.setStatus(newStatus);
        application.setReviewedAt(LocalDateTime.now()); // Cập nhật thời gian review
        
        applicationRepository.save(application);
        
        // TODO: (Mở rộng) Gửi email thông báo cho ứng viên tại đây nếu được duyệt/từ chối
    }
}
