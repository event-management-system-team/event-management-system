package com.eventmanagement.backend.controller.organizer;

import com.eventmanagement.backend.dto.request.CreateStaffScheduleRequest;
import com.eventmanagement.backend.dto.response.organizer.StaffScheduleResponse;
import com.eventmanagement.backend.service.StaffScheduleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class StaffScheduleController {

    private final StaffScheduleService staffScheduleService;

    @PostMapping("/{eventId}/schedules")
//    @PreAuthorize("@eventSecurity.isOrganizerOfEvent(authentication, #eventId)")
    public ResponseEntity<StaffScheduleResponse> createSchedule(
            @PathVariable UUID eventId,
            @Valid @RequestBody CreateStaffScheduleRequest req
    ) {
        return ResponseEntity.ok(
                staffScheduleService.createScheduleAndAssignByRoles(eventId, req)
        );
    }

}
