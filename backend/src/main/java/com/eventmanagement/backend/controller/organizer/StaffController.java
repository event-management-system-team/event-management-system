package com.eventmanagement.backend.controller.organizer;

import com.eventmanagement.backend.dto.response.UserResponse;
import com.eventmanagement.backend.dto.response.organizer.EventRoleStatsResponse;
import com.eventmanagement.backend.dto.response.organizer.StaffResponse;
import com.eventmanagement.backend.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;

    @GetMapping("/{id}/staff/all")
    public ResponseEntity<List<StaffResponse>> getEventStaffs(
            @PathVariable UUID id,
            @RequestParam(required = false) String role
    ) {
        List<StaffResponse> staff;

        if (role == null || role.isBlank()) {
            staff = staffService.findStaffByEventIdPlain(id);
        } else {
            staff = staffService.findStaffByEventIdAndRole(id, role);
        }

        return ResponseEntity.ok(staff);
    }

    @GetMapping("/{id}/staff")
    public ResponseEntity<Page<StaffResponse>> getEventStaffsPaging(
            @PathVariable UUID id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(staffService.findStaffByEventId(id, page, size));
    }

    @GetMapping("/{id}/role")
    public ResponseEntity<List<String>> getEventRoles(@PathVariable UUID id) {
        return ResponseEntity.ok(staffService.getRolesByEventId(id));
    }

    @GetMapping("/{id}/role-stats")
    public ResponseEntity<List<EventRoleStatsResponse>> getRoleStats(@PathVariable UUID id) {
        return ResponseEntity.ok(staffService.getRoleStatsByEventId(id));
    }
}
