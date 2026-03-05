//package com.eventmanagement.backend.controller.organizer;
//
//import com.eventmanagement.backend.dto.request.AssignStaffRequest;
//import com.eventmanagement.backend.dto.response.organizer.AssignmentResponse;
//import com.eventmanagement.backend.exception.ForbiddenException;
//import com.eventmanagement.backend.exception.NotFoundException;
//import com.eventmanagement.backend.service.StaffAssignmentService;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//import org.springframework.http.MediaType;
//import org.springframework.test.web.servlet.MockMvc;
//
//import java.time.LocalDateTime;
//import java.util.UUID;
//
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.Mockito.verify;
//import static org.mockito.Mockito.when;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//
//@ExtendWith(MockitoExtension.class)
//class StaffAssignmentControllerTest {
//    private MockMvc mockMvc;
//
//    @Mock
//    private StaffAssignmentService staffAssignmentService;
//
//    private ObjectMapper objectMapper = new ObjectMapper();
//    private UUID scheduleId;
//    private UUID staffId;
//
//    @BeforeEach
//    void setUp() {
//        scheduleId = UUID.randomUUID();
//        staffId = UUID.randomUUID();
//    }
//
//    // ASSIGN SUCCESS
//    @Test
//    void assignStaff_Success_ReturnOk() throws Exception {
//
//        AssignmentResponse response = AssignmentResponse.builder()
//                .assignmentId(UUID.randomUUID())
//                .scheduleId(scheduleId)
//                .staffId(staffId)
//                .status("ASSIGNED")
//                .assignedAt(LocalDateTime.now())
//                .build();
//
//        when(staffAssignmentService.assignStaffToSchedule(scheduleId, staffId))
//                .thenReturn(response);
//
//        AssignStaffRequest request = new AssignStaffRequest();
//        request.setStaffId(staffId);
//
//        mockMvc.perform(post("/api/events/staff-schedules/{id}/assign", scheduleId)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.staffId").value(staffId.toString()))
//                .andExpect(jsonPath("$.scheduleId").value(scheduleId.toString()))
//                .andExpect(jsonPath("$.status").value("ASSIGNED"));
//
//        verify(staffAssignmentService)
//                .assignStaffToSchedule(scheduleId, staffId);
//    }
//
//    // SCHEDULE NOT FOUND - 404
//    @Test
//    void assignStaff_ScheduleNotFound_Return404() throws Exception {
//
//        when(staffAssignmentService.assignStaffToSchedule(any(), any()))
//                .thenThrow(new NotFoundException("Schedule not found"));
//
//        AssignStaffRequest request = new AssignStaffRequest();
//        request.setStaffId(staffId);
//
//        mockMvc.perform(post("/api/events/staff-schedules/{id}/assign", scheduleId)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isNotFound());
//    }
//
//    // FORBIDDEN - 403
//    @Test
//    void assignStaff_NotStaffOfEvent_Return403() throws Exception {
//
//        when(staffAssignmentService.assignStaffToSchedule(any(), any()))
//                .thenThrow(new ForbiddenException("Not allowed"));
//
//        AssignStaffRequest request = new AssignStaffRequest();
//        request.setStaffId(staffId);
//
//        mockMvc.perform(post("/api/events/staff-schedules/{id}/assign", scheduleId)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isForbidden());
//    }
//
//    // ALREADY ASSIGNED/FULL - 400
//    @Test
//    void assignStaff_AlreadyAssigned_Return400() throws Exception {
//
//        when(staffAssignmentService.assignStaffToSchedule(any(), any()))
//                .thenThrow(new IllegalStateException("Already assigned"));
//
//        AssignStaffRequest request = new AssignStaffRequest();
//        request.setStaffId(staffId);
//
//        mockMvc.perform(post("/api/events/staff-schedules/{id}/assign", scheduleId)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isBadRequest());
//    }
//}
