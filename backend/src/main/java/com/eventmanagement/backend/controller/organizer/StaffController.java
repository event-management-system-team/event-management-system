package com.eventmanagement.backend.controller.organizer;

import com.eventmanagement.backend.dto.response.organizer.StaffResponse;
import com.eventmanagement.backend.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;

    @GetMapping("/{id}/staff")
    public ResponseEntity<List<StaffResponse>> getEventStaffs(
            @PathVariable UUID id,
            @RequestParam(required = false) String role
    ) {
        List<StaffResponse> staff;

        if (role == null || role.isBlank()) {
            staff = staffService.findStaffByEventId(id);
        } else {
            staff = staffService.findStaffByEventIdAndRole(id, role);
        }

        return ResponseEntity.ok(staff);
    }

    @GetMapping("/{id}/role")
    public ResponseEntity<List<String>> getEventRoles(@PathVariable UUID id) {
        return ResponseEntity.ok(staffService.getRolesByEventId(id));
    }
}
