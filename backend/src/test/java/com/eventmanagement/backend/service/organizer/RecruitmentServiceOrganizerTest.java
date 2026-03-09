package com.eventmanagement.backend.service.organizer;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import com.eventmanagement.backend.constants.ApplicationStatus;
import com.eventmanagement.backend.constants.RecruitmentStatus;
import com.eventmanagement.backend.dto.response.organizer.RecruitmentDashBoardDTO;
import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.model.Recruitment;
import com.eventmanagement.backend.repository.RecruitmentRepository;
import com.eventmanagement.backend.repository.StaffApplicationRepository;

@ExtendWith(MockitoExtension.class)
public class RecruitmentServiceOrganizerTest {

    @Mock
    private RecruitmentRepository recruitmentRepository;

    @Mock
    private StaffApplicationRepository staffApplicationRepository;

    @InjectMocks
    private RecruitmentServiceOrganizer recruitmentServiceOrganizer;

    @Test
    void testGetDashBoardData_Success() {
        UUID recruitmentId = UUID.randomUUID();
        
        Event mockEvent = new Event();
        mockEvent.setEventName("Sự kiện FPT 2026");

        Recruitment mockRecruitment = new Recruitment();
        mockRecruitment.setRecruitmentId(recruitmentId);
        mockRecruitment.setEvent(mockEvent);
        mockRecruitment.setPositionName("Tình nguyện viên");
        mockRecruitment.setStatus(RecruitmentStatus.OPEN); 
        mockRecruitment.setApprovedCount(2); 
        mockRecruitment.setVacancy(5); 

        PageImpl<Recruitment> mockPage = new PageImpl<>(List.of(mockRecruitment));
        when(recruitmentRepository.findAll(any(PageRequest.class))).thenReturn(mockPage);

        when(staffApplicationRepository.countByRecruitment_RecruitmentIdAndApplicationStatus(
                eq(recruitmentId), eq(ApplicationStatus.PENDING))).thenReturn(3);

        when(staffApplicationRepository.countByRecruitment_RecruitmentId(recruitmentId)).thenReturn(10);
        RecruitmentDashBoardDTO result = recruitmentServiceOrganizer.getDashBoardData();

        assertNotNull(result);
        RecruitmentDashBoardDTO.StatsDTO stats = result.getStats();

        assertNotNull(stats);
        assertEquals(1, stats.getActiveRoles()); 
        assertEquals(10, stats.getTotalApplications()); 
        assertEquals(3, stats.getPendingReviews()); 
        assertEquals(2, stats.getHiredStaff()); 

        List<RecruitmentDashBoardDTO.RecruitmentItemDTO> items = result.getRecentRecruitments();
        assertEquals(1, items.size());
        
        RecruitmentDashBoardDTO.RecruitmentItemDTO item = items.get(0);
        assertEquals(recruitmentId, item.getRecruitmentId());
        assertEquals("Sự kiện FPT 2026 - Tình nguyện viên", item.getTitle()); 
        assertEquals(3, item.getNewCount());
        assertEquals(2, item.getCurrentCount());
        assertEquals(5, item.getTotal());
        assertTrue(item.isNew()); 
    }
}