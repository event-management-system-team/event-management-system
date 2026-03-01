package com.eventmanagement.backend.controller.organizer;

import com.eventmanagement.backend.dto.response.organizer.StaffAssignmentResponse;
import com.eventmanagement.backend.service.StaffAssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
