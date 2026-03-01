package com.eventmanagement.backend.controller.organizer;

import com.eventmanagement.backend.dto.request.CreateStaffScheduleRequest;
import com.eventmanagement.backend.dto.response.organizer.ScheduleResponse;
import com.eventmanagement.backend.dto.response.organizer.StaffScheduleResponse;
import com.eventmanagement.backend.service.StaffScheduleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class StaffScheduleController {

    private final StaffScheduleService staffScheduleService;

    @GetMapping("/{id}/staff-schedules")
    public ResponseEntity<List<StaffScheduleResponse>> getSchedules(@PathVariable UUID id) {
        return ResponseEntity.ok(staffScheduleService.getSchedulesByEvent(id));
    }

    @PostMapping("/{eventId}/staff-schedules")
//    @PreAuthorize("@eventSecurity.isOrganizerOfEvent(authentication, #eventId)")
    public ResponseEntity<ScheduleResponse> createSchedule(
            @PathVariable UUID eventId,
            @RequestBody @Valid CreateStaffScheduleRequest request
    ) {
        return ResponseEntity.ok(
                staffScheduleService.createSchedule(eventId, request)
        );
    }
}
