//package com.eventmanagement.backend.service;
//
//import com.eventmanagement.backend.dto.response.organizer.AssignmentResponse;
//import com.eventmanagement.backend.exception.ForbiddenException;
//import com.eventmanagement.backend.exception.NotFoundException;
//import com.eventmanagement.backend.model.Event;
//import com.eventmanagement.backend.model.StaffAssignment;
//import com.eventmanagement.backend.model.StaffSchedule;
//import com.eventmanagement.backend.model.User;
//import com.eventmanagement.backend.repository.*;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//
//import java.util.Optional;
//import java.util.UUID;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.ArgumentMatchers.eq;
//import static org.mockito.Mockito.verify;
//import static org.mockito.Mockito.when;
//
//@ExtendWith(MockitoExtension.class)
//class StaffAssignmentServiceTest {
//    @Mock
//    private StaffAssignmentRepository staffAssignmentRepository;
//
//    @Mock
//    private StaffScheduleRepository staffScheduleRepository;
//
//    @Mock
//    private StaffApplicationRepository staffApplicationRepository;
//
//    @Mock
//    private UserRepository userRepository;
//
//    @InjectMocks
//    private StaffAssignmentService staffAssignmentService;
//
//    private UUID scheduleId;
//    private UUID staffId;
//    private StaffSchedule schedule;
//
//    @BeforeEach
//    void setUp() {
//        scheduleId = UUID.randomUUID();
//        staffId = UUID.randomUUID();
//
//        Event event = Event.builder()
//                .eventId(UUID.randomUUID())
//                .build();
//
//        schedule = StaffSchedule.builder()
//                .scheduleId(scheduleId)
//                .event(event)
//                .requiredStaff(2)
//                .build();
//    }
//
//    // SCHEDULE NOT FOUND
//    @Test
//    void assignStaff_ScheduleNotFound_ThrowNotFound() {
//
//        when(staffScheduleRepository.findById(scheduleId))
//                .thenReturn(Optional.empty());
//
//        assertThrows(NotFoundException.class,
//                () -> staffAssignmentService.assignStaffToSchedule(scheduleId, staffId));
//    }
//
//    // USER NOT STAFF OF EVENT
//    @Test
//    void assignStaff_UserNotStaffOfEvent_ThrowForbidden() {
//
//        when(staffScheduleRepository.findById(scheduleId))
//                .thenReturn(Optional.of(schedule));
//
//        when(staffApplicationRepository.existsApprovedByUserAndEvent(
//                staffId, schedule.getEvent().getEventId()))
//                .thenReturn(false);
//
//        assertThrows(ForbiddenException.class,
//                () -> staffAssignmentService.assignStaffToSchedule(scheduleId, staffId));
//    }
//
//    // STAFF ALREADY ASSIGNED
//    @Test
//    void assignStaff_AlreadyAssigned_ThrowException() {
//
//        when(staffScheduleRepository.findById(scheduleId))
//                .thenReturn(Optional.of(schedule));
//
//        when(staffApplicationRepository.existsApprovedByUserAndEvent(
//                any(), any()))
//                .thenReturn(true);
//
//        when(staffAssignmentRepository
//                .existsBySchedule_ScheduleIdAndStaff_UserId(scheduleId, staffId))
//                .thenReturn(true);
//
//        assertThrows(IllegalStateException.class,
//                () -> staffAssignmentService.assignStaffToSchedule(scheduleId, staffId));
//    }
//
//    // SCHEDULE IS FULL
//    @Test
//    void assignStaff_ScheduleFull_ThrowException() {
//
//        when(staffScheduleRepository.findById(scheduleId))
//                .thenReturn(Optional.of(schedule));
//
//        when(staffApplicationRepository.existsApprovedByUserAndEvent(
//                any(), any()))
//                .thenReturn(true);
//
//        when(staffAssignmentRepository
//                .existsBySchedule_ScheduleIdAndStaff_UserId(any(), any()))
//                .thenReturn(false);
//
//        when(staffAssignmentRepository
//                .countBySchedule_ScheduleIdAndStatusIn(eq(scheduleId), any()))
//                .thenReturn(2L); // requiredStaff = 2
//
//        assertThrows(IllegalStateException.class,
//                () -> staffAssignmentService.assignStaffToSchedule(scheduleId, staffId));
//    }
//
//    // ASSIGN SUCCESS
//    @Test
//    void assignStaff_Success() {
//
//        when(staffScheduleRepository.findById(scheduleId))
//                .thenReturn(Optional.of(schedule));
//
//        when(staffApplicationRepository.existsApprovedByUserAndEvent(
//                any(), any()))
//                .thenReturn(true);
//
//        when(staffAssignmentRepository
//                .existsBySchedule_ScheduleIdAndStaff_UserId(any(), any()))
//                .thenReturn(false);
//
//        when(staffAssignmentRepository
//                .countBySchedule_ScheduleIdAndStatusIn(eq(scheduleId), any()))
//                .thenReturn(1L); // less than required
//
//        User staff = User.builder().userId(staffId).build();
//        when(userRepository.getReferenceById(staffId))
//                .thenReturn(staff);
//
//        when(staffAssignmentRepository.save(any()))
//                .thenAnswer(invocation -> {
//                    StaffAssignment a = invocation.getArgument(0);
//                    a.setAssignmentId(UUID.randomUUID());
//                    return a;
//                });
//
//        AssignmentResponse response =
//                staffAssignmentService.assignStaffToSchedule(scheduleId, staffId);
//
//        assertNotNull(response);
//        assertEquals(scheduleId, response.getScheduleId());
//        assertEquals(staffId, response.getStaffId());
//        assertEquals("ASSIGNED", response.getStatus());
//
//        verify(staffAssignmentRepository).save(any());
//    }
//}
