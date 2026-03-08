package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.response.admin.EventAnalyticsResponse;
import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.model.EventAnalytics;
import com.eventmanagement.backend.repository.EventAnalyticsRepository;
import com.eventmanagement.backend.repository.StaffRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EventAnalyticsService {
//    private final EventAnalyticsRepository eventAnalyticsRepository;
//    private final StaffRepository staffRepository;
//
//    public EventAnalytics buildAnalytics(Event event) {
//
//        int registrations = event.getRegisteredCount();
//        int checkins = event.getCheckedInCount();
//
//        double attendanceRate = registrations == 0
//                ? 0
//                : (double) checkins / registrations;
//
//        double registrationRate = event.getTotalCapacity() == null
//                ? 0
//                : (double) registrations / event.getTotalCapacity();
//
//        Map<String, Object> performance = Map.of(
//                "is_free", event.getIsFree(),
//                "capacity", event.getTotalCapacity(),
//                "attendance_rate", attendanceRate,
//                "registration_rate", registrationRate,
//                "event_status", event.getStatus(),
//                "start_date", event.getStartDate(),
//                "end_date", event.getEndDate()
//        );
//
//        Map<String, Object> demographic = Map.of(
//                "category_id", event.getCategory().getCategoryId(),
//                "staff_count", staffRepository.countByEvent_EventId(event.getEventId()),
//                "organizer_id", event.getOrganizer().getUserId()
//        );
//
//        EventAnalytics analytics = new EventAnalytics();
//        analytics.setEvent(event);
//        analytics.setTotalRegistrations(registrations);
//        analytics.setTotalCheckins(checkins);
//        analytics.setPerformanceMetrics(performance);
//        analytics.setDemographicData(demographic);
//
//        return analytics;
//    }

    private final EventAnalyticsRepository eventAnalyticsRepository;
    private final ObjectMapper objectMapper;

    public List<EventAnalyticsResponse> getAnalyticsDashboard() {

        List<EventAnalytics> analyticsList =
                eventAnalyticsRepository.getAnalyticsDashboard();

        return analyticsList.stream().map(this::mapToResponse).toList();
    }

    private EventAnalyticsResponse mapToResponse(EventAnalytics analytics) {

        Map<String, Object> performance =
                analytics.getPerformanceMetrics();

        Map<String, Object> demographic =
                analytics.getDemographicData();

        EventAnalyticsResponse res = new EventAnalyticsResponse();

        res.setEventId(analytics.getEvent().getEventId());

        Object eventName = performance.get("event_name");
        if (eventName != null) {
            res.setEventName(eventName.toString());
        }

        Object categoryId = demographic.get("category_id");

        if (categoryId != null) {
            res.setCategoryId(UUID.fromString(categoryId.toString()));
        }

        String startDate = (String) performance.get("start_date");
        String endDate = (String) performance.get("end_date");

        if (startDate != null) {
            res.setStartDate(LocalDateTime.parse(startDate));
        }

        if (endDate != null) {
            res.setEndDate(LocalDateTime.parse(endDate));
        }

        res.setTicketsSold(analytics.getTotalTicketsSold());
        res.setRevenue(analytics.getTotalRevenue());

        Object attendanceRate = performance.get("attendance_rate");

        if (attendanceRate != null) {
            res.setAttendanceRate(Double.valueOf(attendanceRate.toString()));
        }

        Object status = performance.get("event_status");

        if (status != null) {
            res.setStatus(status.toString());
        }

        return res;
    }
}
