package com.eventmanagement.backend.controller.organizer;

import com.eventmanagement.backend.dto.request.AssignStaffRequest;
import com.eventmanagement.backend.dto.response.organizer.AssignmentResponse;
import com.eventmanagement.backend.dto.response.organizer.StaffAssignmentResponse;
import com.eventmanagement.backend.service.StaffAssignmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class StaffAssignmentController {

    private final StaffAssignmentService staffAssignmentService;

    @GetMapping("/{eventId}/assignments")
    public ResponseEntity<Map<UUID, Map<LocalDate, List<StaffAssignmentResponse>>>>
    getAssignmentsGrouped(@PathVariable UUID eventId) {

        return ResponseEntity.ok(
                staffAssignmentService.getAssignmentsGroupedByStaffAndDate(eventId)
        );
    }

    @PostMapping("/staff-schedules/{scheduleId}/assign")
//    @PreAuthorize("@eventSecurity.isOrganizerOfEvent(authentication, #eventId)")
    public ResponseEntity<AssignmentResponse> assignStaff(
            @PathVariable UUID scheduleId,
            @RequestBody @Valid AssignStaffRequest request
    ) {
        return ResponseEntity.ok(
                staffAssignmentService.assignStaffToSchedule(scheduleId, request.getStaffId())
        );
    }
}
