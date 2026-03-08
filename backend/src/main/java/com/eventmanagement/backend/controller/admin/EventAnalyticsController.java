package com.eventmanagement.backend.controller.admin;

import com.eventmanagement.backend.dto.response.admin.EventAnalyticsResponse;
import com.eventmanagement.backend.service.EventAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class EventAnalyticsController {
    private final EventAnalyticsService eventAnalyticsService;

    @GetMapping("/events")
    public ResponseEntity<List<EventAnalyticsResponse>> getEventAnalytics() {
        return ResponseEntity.ok(eventAnalyticsService.getAnalyticsDashboard());
    }
 }
