package com.eventmanagement.backend.service;

import com.eventmanagement.backend.constants.EventStatus;
import com.eventmanagement.backend.dto.response.admin.DashboardSummaryResponse;
import com.eventmanagement.backend.dto.response.admin.TopPendingEventsResponse;
import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.repository.EventAnalyticsRepository;
import com.eventmanagement.backend.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {
    private final EventAnalyticsRepository eventAnalyticsRepository;
    private final EventRepository eventRepository;

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

    public List<TopPendingEventsResponse> getTopPendingEvents() {

        List<Event> events =
                eventRepository.findTop5ByStatusOrderByCreatedAtDesc(EventStatus.PENDING);

        return events.stream()
                .map(this::mapToResponse)
                .toList();
    }

    private TopPendingEventsResponse mapToResponse(Event event) {

        return TopPendingEventsResponse.builder()
                .eventSlug(event.getEventSlug())
                .eventName(event.getEventName())
                .startDate(event.getStartDate())
                .endDate(event.getEndDate())
                .organizer(
                        TopPendingEventsResponse.OrganizerDto.builder()
                                .fullName(event.getOrganizer().getFullName())
                                .build()
                )
                .createdAt(event.getCreatedAt())
                .build();
    }
}
