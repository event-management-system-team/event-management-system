package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.response.admin.DashboardSummaryResponse;
import com.eventmanagement.backend.repository.EventAnalyticsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {
    private final EventAnalyticsRepository eventAnalyticsRepository;

    public DashboardSummaryResponse getDashboardSummary() {

        Object[] row = (Object[]) eventAnalyticsRepository.getDashboardSummary();

        DashboardSummaryResponse res = new DashboardSummaryResponse();

        res.setTotalEvents(((Number) row[0]).longValue());
        res.setActiveEvents(((Number) row[1]).longValue());
        res.setPendingEvents(((Number) row[2]).longValue());
        res.setOrganizerAccounts(((Number) row[3]).longValue());
        res.setBannedAccounts(((Number) row[4]).longValue());

        return res;
    }
}
