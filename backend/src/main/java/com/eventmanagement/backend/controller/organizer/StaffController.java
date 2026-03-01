package com.eventmanagement.backend.controller.organizer;

import com.eventmanagement.backend.dto.response.organizer.StaffResponse;
import com.eventmanagement.backend.service.StaffService;
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
public class StaffController {

    private final StaffService staffService;

    @GetMapping("/{id}/staff")
    public ResponseEntity<List<StaffResponse>> getEventStaffs(@PathVariable UUID id) {
        List<StaffResponse> staff = staffService.getApprovedStaffByEventId(id);
        return ResponseEntity.ok(staff);
    }
}
