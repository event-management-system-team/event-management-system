package com.eventmanagement.backend.service.organizer;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

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
        UUID eventId = UUID.randomUUID();
        UUID recruitmentId = UUID.randomUUID();
        
        Event mockEvent = new Event();
        mockEvent.setEventId(eventId);
        mockEvent.setEventName("Sự kiện FPT 2026");

        Recruitment mockRecruitment = new Recruitment();
        mockRecruitment.setRecruitmentId(recruitmentId);
        mockRecruitment.setEvent(mockEvent);
        mockRecruitment.setPositionName("Tình nguyện viên");
        mockRecruitment.setStatus(RecruitmentStatus.OPEN); 
        mockRecruitment.setVacancy(5); 

        when(recruitmentRepository.findByEvent_EventId(eventId)).thenReturn(List.of(mockRecruitment));

        when(staffApplicationRepository.countByRecruitment_RecruitmentIdAndApplicationStatus(
                eq(recruitmentId), eq(ApplicationStatus.PENDING))).thenReturn(3);

        when(staffApplicationRepository.countByRecruitment_RecruitmentId(recruitmentId)).thenReturn(10);
        
        when(staffApplicationRepository.countByRecruitment_RecruitmentIdAndApplicationStatus(
                eq(recruitmentId), eq(ApplicationStatus.APPROVED))).thenReturn(2);

        RecruitmentDashBoardDTO result = recruitmentServiceOrganizer.getDashBoardData(eventId);

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