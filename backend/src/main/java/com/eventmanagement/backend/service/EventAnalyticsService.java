package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.response.admin.AnalyticsSummaryResponse;
import com.eventmanagement.backend.dto.response.admin.EventAnalyticsResponse;
import com.eventmanagement.backend.repository.EventAnalyticsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EventAnalyticsService {
    private final EventAnalyticsRepository eventAnalyticsRepository;

    public List<EventAnalyticsResponse> getAnalyticsDashboard() {

        List<Object[]> rows = eventAnalyticsRepository.getAnalyticsDashboard();

        return rows.stream().map(row -> {

            EventAnalyticsResponse res = new EventAnalyticsResponse();

            UUID eventId = (UUID) row[0];
            String eventName = (String) row[1];
            UUID categoryId = (UUID) row[2];
            String categoryName = (String) row[3];
            Timestamp startDate = (Timestamp) row[4];
            Timestamp endDate = (Timestamp) row[5];
            Integer totalCapacity = (Integer) row[6];
            String status = (String) row[7];
            Integer ticketsSold = (Integer) row[8];
            BigDecimal revenue = (BigDecimal) row[9];
            Integer checkins = (Integer) row[10];
            Integer registrations = (Integer) row[11];

            res.setEventId(eventId);
            res.setEventName(eventName);
            res.setCategoryId(categoryId);
            res.setCategoryName(categoryName);

            if (startDate != null)
                res.setStartDate(startDate.toLocalDateTime());

            if (endDate != null)
                res.setEndDate(endDate.toLocalDateTime());

            res.setTotalCapacity(totalCapacity);
            res.setStatus(status);
            res.setTicketsSold(ticketsSold);
            res.setRevenue(revenue);

            if (registrations != null && registrations != 0) {
                res.setAttendanceRate((double) checkins / registrations);
            }

            return res;

        }).toList();
    }

    public AnalyticsSummaryResponse getSummary() {

        Object[] row = (Object[]) eventAnalyticsRepository.getAnalyticsSummary();

        AnalyticsSummaryResponse res = new AnalyticsSummaryResponse();

        res.setTotalTicketsSold(((Number) row[0]).longValue());
        res.setTotalRevenue((BigDecimal) row[1]);
        res.setAverageAttendanceRate(((Number) row[2]).doubleValue());
        res.setTotalEvents(((Number) row[3]).intValue());
        res.setActiveEvents(((Number) row[4]).intValue());

        return res;
    }
}
