package com.eventmanagement.backend.service;

import com.eventmanagement.backend.constants.EventStatus;
import com.eventmanagement.backend.dto.response.organizer.OrganizerEventResponse;
import com.eventmanagement.backend.dto.response.organizer.OrganizerEventStatsResponse;
import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.model.TicketType;
import com.eventmanagement.backend.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrganizerEventService {

    private final EventRepository eventRepository;

    /**
     * Lấy danh sách event của organizer có phân trang, sắp xếp theo ngày tạo mới nhất
     */
    public Page<OrganizerEventResponse> getMyEvents(UUID organizerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Event> eventPage = eventRepository.findByOrganizer_UserId(organizerId, pageable);

        if (eventPage.isEmpty()) {
            return eventPage.map(this::mapToOrganizerResponse);
        }

        List<UUID> eventIds = eventPage.getContent().stream()
                .map(Event::getEventId)
                .toList();
        Map<UUID, Event> eventsWithTickets = eventRepository.findWithTicketsByEventIdIn(eventIds)
                .stream()
                .collect(Collectors.toMap(Event::getEventId, Function.identity()));

        return eventPage.map(e -> mapToOrganizerResponse(
                eventsWithTickets.getOrDefault(e.getEventId(), e)));
    }

    /**
     * Lấy thống kê event của organizer (total, active, upcoming, completed)
     *
     */
    public OrganizerEventStatsResponse getMyEventStats(UUID organizerId) {

        long total = eventRepository.countByOrganizer_UserId(organizerId);
        long active = eventRepository.countByOrganizer_UserIdAndStatus(organizerId, EventStatus.APPROVED)
                + eventRepository.countByOrganizer_UserIdAndStatus(organizerId, EventStatus.ONGOING);
        long upcoming = eventRepository.countByOrganizer_UserIdAndStatusAndStartDateAfterNow(organizerId, EventStatus.APPROVED);
        long completed = eventRepository.countByOrganizer_UserIdAndStatus(organizerId, EventStatus.COMPLETED);

        return OrganizerEventStatsResponse.builder()
                .totalEvents(total)
                .activeCount(active)
                .upcomingCount(upcoming)
                .completedCount(completed)
                .build();
    }

    /**
     * Map Event entity sang OrganizerEventResponse DTO
     * Tính tổng sold và tổng quantity từ tất cả ticket types
     */
    private OrganizerEventResponse mapToOrganizerResponse(Event event) {
        int totalSold = 0;
        int totalTickets = 0;

        if (event.getTicketTypes() != null) {
            for (TicketType ticket : event.getTicketTypes()) {
                if (Boolean.TRUE.equals(ticket.getIsActive())) {
                    totalSold += ticket.getSoldCount() != null ? ticket.getSoldCount() : 0;
                    totalTickets += ticket.getQuantity() != null ? ticket.getQuantity() : 0;
                }
            }
        }

        return OrganizerEventResponse.builder()
                .eventId(event.getEventId())
                .eventName(event.getEventName())
                .eventSlug(event.getEventSlug())
                .location(event.getLocation())
                .bannerUrl(event.getBannerUrl())
                .startDate(event.getStartDate())
                .endDate(event.getEndDate())
                .status(event.getStatus() != null ? event.getStatus().name() : null)
                .totalCapacity(event.getTotalCapacity())
                .registeredCount(event.getRegisteredCount())
                .totalSold(totalSold)
                .totalTickets(totalTickets)
                .categoryName(event.getCategory() != null ? event.getCategory().getCategoryName() : null)
                .build();
    }
}
