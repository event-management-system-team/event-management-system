package com.eventmanagement.backend.controller.organizer;

import com.eventmanagement.backend.dto.response.organizer.AssignmentByRoleResponse;
import com.eventmanagement.backend.dto.response.organizer.AssignmentListProjection;
import com.eventmanagement.backend.service.StaffAssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class StaffAssignmentController {

    private final StaffAssignmentService staffAssignmentService;

    @GetMapping("/{eventId}/assignments")
    public ResponseEntity<List<AssignmentListProjection>> getAssignments(@PathVariable  UUID eventId) {
        return ResponseEntity.ok(staffAssignmentService.getAssignmentsByEvent(eventId));
    }

    @GetMapping("/{eventId}/assignments/by-role")
    public ResponseEntity<List<AssignmentByRoleResponse>> getAssignmentsByRole(
            @PathVariable UUID eventId) {

        return ResponseEntity.ok(staffAssignmentService.getAssignmentsByRole(eventId));
    }
}
