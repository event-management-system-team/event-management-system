package com.eventmanagement.backend.controller.admin;

import com.eventmanagement.backend.dto.response.admin.DashboardSummaryResponse;
import com.eventmanagement.backend.dto.response.admin.TopPendingEventsResponse;
import com.eventmanagement.backend.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AdminDashboardController {
    private final AdminDashboardService adminDashboardService;

    @GetMapping("/dashboard-summary")
    public ResponseEntity<DashboardSummaryResponse> getAdminDashboardSummary() {
        return ResponseEntity.ok(adminDashboardService.getDashboardSummary());
    }

    @GetMapping("/pending-events")
    public ResponseEntity<List<TopPendingEventsResponse>> getTopPendingEvents() {
        return ResponseEntity.ok(adminDashboardService.getTopPendingEvents());
    }
}
