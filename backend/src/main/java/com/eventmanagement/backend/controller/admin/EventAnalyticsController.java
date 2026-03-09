package com.eventmanagement.backend.controller.admin;

import com.eventmanagement.backend.dto.response.admin.AnalyticsSummaryResponse;
import com.eventmanagement.backend.dto.response.admin.EventAnalyticsResponse;
import com.eventmanagement.backend.dto.response.admin.MonthlyTicketSalesResponse;
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

    @GetMapping("/summary")
    public ResponseEntity<AnalyticsSummaryResponse> getSummary() {
        return ResponseEntity.ok(eventAnalyticsService.getSummary());
    }

    @GetMapping("/monthly-ticket-sales")
    public ResponseEntity<List<MonthlyTicketSalesResponse>> getMonthlyTicketSales() {
        return ResponseEntity.ok(eventAnalyticsService.getMonthlyTicketSales());
    }
 }
