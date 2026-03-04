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
import com.eventmanagement.backend.repository.ApplicationRepository;
import com.eventmanagement.backend.repository.EventStaffRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ApplicationServiceOrganizer {

    @Autowired
    private final ApplicationRepository applicationRepository;
    @Autowired
    private  EventStaffRepository eventStaffRepository;


    @Transactional(readOnly = true)
    public List<ApplicationResponseDTO> getApplicationsByRecruitment(UUID recruitmentId) {
        List<StaffApplication> applications = applicationRepository.findByRecruitment_RecruitmentId(recruitmentId);
        
return applications.stream().map(app -> {
    // 1. Lấy dữ liệu từ cột JSON applicationData (Map)
    String coverLetter = null;
    String resume = null;
    
    if (app.getApplicationData() != null) {
        // Lưu ý: Đảm bảo key "coverLetter" và "resume" khớp với key lúc bạn lưu JSON vào DB
        coverLetter = (String) app.getApplicationData().get("coverLetter");
        resume = (String) app.getApplicationData().get("resume");
    }

    // 2. Build DTO
    return ApplicationResponseDTO.builder()
            .id(app.getApplicationId())
            .name(app.getUser().getFullName())
            .email(app.getUser().getEmail())
            .phone(app.getUser().getPhone())
            .avatar(app.getUser().getAvatarUrl())
            .position(app.getRecruitment().getPositionName()) // Giữ nguyên giả định Recruitment vẫn có hàm này
            .resume(resume) // Lấy từ Map ở trên
            .coverLetter(coverLetter) // Lấy từ Map ở trên
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
        StaffApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn ứng tuyển với ID: " + applicationId));
        
        application.setApplicationStatus(newStatus);
        application.setReviewedAt(LocalDateTime.now()); // Cập nhật thời gian review
        
        applicationRepository.save(application);
        
        // TODO: (Mở rộng) Gửi email thông báo cho ứng viên tại đây nếu được duyệt/từ chối
    }

    @Transactional
    public StaffApplication updateApplicationStatuss(UUID applicationId, ApplicationStatus newStatus) {
        
        // 1. Tìm lá đơn
        StaffApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn ứng tuyển này!"));

        // 2. Cập nhật trạng thái
        application.setApplicationStatus(newStatus);
        
        // 3. XỬ LÝ KHI ĐƯỢC DUYỆT (APPROVED)
        if (newStatus == ApplicationStatus.APPROVED) {
            Recruitment recruitment = application.getRecruitment();
            Event event = recruitment.getEvent();
            User applicant = application.getUser();

            // Kiểm tra xem ứng viên đã có trong danh sách staff của event này chưa
            boolean isAlreadyStaff = eventStaffRepository.existsByEvent_EventIdAndUser_UserId(
                    event.getEventId(), applicant.getUserId()
            );

            if (!isAlreadyStaff) {
                // Tạo mới nhân sự sự kiện
                EventStaff newStaff = new EventStaff();
                newStaff.setEvent(event);
                newStaff.setUser(applicant);
                
                // Lấy Position Name từ Recruitment để làm chức vụ (Staff Role)
                newStaff.setStaffRole(recruitment.getPositionName());
                newStaff.setAssignedAt(LocalDateTime.now());
                
                // Lưu vào bảng event_staffs
                eventStaffRepository.save(newStaff);
            }
        }

        // 4. Lưu cập nhật của lá đơn
        return applicationRepository.save(application);
    }
    
}
