package com.eventmanagement.backend.service.organizer;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.eventmanagement.backend.constants.ApplicationStatus;
import com.eventmanagement.backend.dto.response.organizer.ApplicationResponseDTO;
import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.model.Recruitment;
import com.eventmanagement.backend.model.StaffApplication;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.repository.EventStaffRepository;
import com.eventmanagement.backend.repository.StaffApplicationRepository;

@ExtendWith(MockitoExtension.class)
public class ApplicationServiceOrganizerTest {

    @Mock
    private StaffApplicationRepository staffapplicationRepository;


    @Mock
    private EventStaffRepository eventStaffRepository;

    @InjectMocks
    private ApplicationServiceOrganizer applicationServiceOrganizer;

    private UUID recruitmentId;
    private StaffApplication mockApplication;
    private User mockUser;
    private Recruitment mockRecruitment;

    @BeforeEach
    void setUp() {
        org.springframework.test.util.ReflectionTestUtils.setField(
            applicationServiceOrganizer, 
            "eventStaffRepository", 
            eventStaffRepository
        );
        recruitmentId = UUID.randomUUID();

        mockUser = new User();
        mockUser.setFullName("Le Thi C");
        mockUser.setEmail("lethic@gmail.com");
        mockUser.setPhone("0987654321");

        mockRecruitment = new Recruitment();
        mockRecruitment.setPositionName("Quản lý sự kiện");

        mockApplication = new StaffApplication();
        mockApplication.setApplicationId(UUID.randomUUID());
        mockApplication.setUser(mockUser);
        mockApplication.setRecruitment(mockRecruitment);
        mockApplication.setApplicationStatus(ApplicationStatus.PENDING);
    }

    @Test
    void testGetApplications_WithFullData_Success() {
        Map<String, Object> applicationData = new HashMap<>();
        applicationData.put("resume", "https://link-to-cv.com/cv.pdf");
        applicationData.put("coverLetter", "Tôi rất mong muốn được làm công việc này.");
        mockApplication.setApplicationData(applicationData);

        when(staffapplicationRepository.findByRecruitment_RecruitmentId(recruitmentId))
                .thenReturn(List.of(mockApplication));

        List<ApplicationResponseDTO> result = applicationServiceOrganizer.getApplicationsByRecruitment(recruitmentId);
        assertNotNull(result);
        assertEquals(1, result.size());
        ApplicationResponseDTO dto = result.get(0);
        
        assertEquals("Le Thi C", dto.getName());
        assertEquals("Quản lý sự kiện", dto.getPosition());
        assertEquals("PENDING", dto.getStatus());

        assertEquals("https://link-to-cv.com/cv.pdf", dto.getResume());
        assertEquals("Tôi rất mong muốn được làm công việc này.", dto.getCoverLetter());
    }

    @Test
    void testGetApplications_WithNullData_Success() {
        mockApplication.setApplicationData(null);
        when(staffapplicationRepository.findByRecruitment_RecruitmentId(recruitmentId))
                .thenReturn(List.of(mockApplication));

        List<ApplicationResponseDTO> result = applicationServiceOrganizer.getApplicationsByRecruitment(recruitmentId);
        assertNotNull(result);
        assertEquals(1, result.size());
        assertNull(result.get(0).getResume());
        assertNull(result.get(0).getCoverLetter());
    }


    @Test
    void testGetApplicationDetail_Success() {
        UUID appId = UUID.randomUUID();
        mockApplication.setApplicationId(appId);
        
        Map<String, Object> appData = new HashMap<>();
        appData.put("resume", "my-cv.pdf");
        mockApplication.setApplicationData(appData);

        when(staffapplicationRepository.findByApplicationId(appId)).thenReturn(java.util.Optional.of(mockApplication));

        ApplicationResponseDTO result = applicationServiceOrganizer.getApplicationDetail(appId);

        assertNotNull(result);
        assertEquals("Le Thi C", result.getName());
        assertEquals("my-cv.pdf", result.getResume());
    }


    // Kịch bản 1: Cập nhật thành APPROVED và tạo nhân viên mới (EventStaff)
    @Test
    void testUpdateApplicationStatus_Approved_CreateNewStaff() {
        UUID appId = UUID.randomUUID();
        mockApplication.setApplicationId(appId);
        mockApplication.setApplicationStatus(ApplicationStatus.PENDING);
        UUID eventId = UUID.randomUUID();
        Event event = new Event();
        event.setEventId(eventId);
        mockRecruitment.setEvent(event);
        
        UUID userId = UUID.randomUUID();
        mockUser.setUserId(userId);
        when(staffapplicationRepository.findById(appId)).thenReturn(java.util.Optional.of(mockApplication));
        when(eventStaffRepository.existsByEvent_EventIdAndUser_UserId(eventId, userId)).thenReturn(false);
        when(staffapplicationRepository.save(any(StaffApplication.class))).thenAnswer(i -> i.getArguments()[0]);
        StaffApplication result = applicationServiceOrganizer.updateApplicationStatuss(appId, ApplicationStatus.APPROVED);
        assertNotNull(result);
        assertEquals(ApplicationStatus.APPROVED, result.getApplicationStatus());
        verify(eventStaffRepository, org.mockito.Mockito.times(1)).save(any(com.eventmanagement.backend.model.EventStaff.class));
        verify(staffapplicationRepository, org.mockito.Mockito.times(1)).save(mockApplication);
    }

    // Kịch bản 2: Cập nhật thành REJECTED (Không tạo nhân viên)
    @Test
    void testUpdateApplicationStatus_Rejected() {
        UUID appId = UUID.randomUUID();
        mockApplication.setApplicationId(appId);
        mockApplication.setApplicationStatus(ApplicationStatus.PENDING);

        when(staffapplicationRepository.findById(appId)).thenReturn(java.util.Optional.of(mockApplication));
        when(staffapplicationRepository.save(any(StaffApplication.class))).thenAnswer(i -> i.getArguments()[0]);

        StaffApplication result = applicationServiceOrganizer.updateApplicationStatuss(appId, ApplicationStatus.REJECTED);

        assertEquals(ApplicationStatus.REJECTED, result.getApplicationStatus());
        
        verify(eventStaffRepository, org.mockito.Mockito.never()).save(any());
        verify(staffapplicationRepository, org.mockito.Mockito.times(1)).save(mockApplication);
    }
}