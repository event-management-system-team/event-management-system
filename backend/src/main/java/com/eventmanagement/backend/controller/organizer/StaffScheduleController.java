package com.eventmanagement.backend.controller.organizer;

import com.eventmanagement.backend.dto.response.organizer.StaffScheduleResponse;
import com.eventmanagement.backend.service.StaffScheduleService;
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
public class StaffScheduleController {

    private final StaffScheduleService staffScheduleService;

    @GetMapping("/{id}/staff-schedules")
    public ResponseEntity<List<StaffScheduleResponse>> getSchedules(@PathVariable UUID id) {
        return ResponseEntity.ok(staffScheduleService.getSchedulesByEvent(id));
    }
}
