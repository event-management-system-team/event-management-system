package com.eventmanagement.backend.service;

import com.eventmanagement.backend.constants.EventStatus;
import com.eventmanagement.backend.dto.response.attendee.*;
import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;

    public List<EventResponse> getTopNewEvents() {
        List<Event> events = eventRepository.findTop6ByStatusOrderByRegisteredCountDesc(EventStatus.APPROVED);

        return events.stream().map((event) -> mapToResponse(event)).collect(Collectors.toList());
    }

    public List<EventResponse> getHotEvents() {

        Pageable topSix = PageRequest.of(0, 6);
        List<Event> events = eventRepository.findHotEventsSellingFast(EventStatus.APPROVED, topSix);
        return events.stream().map((event) -> mapToResponse(event)).collect(Collectors.toList());
    }

    public Page<EventResponse> searchEvents(String keyword, String location,
                                            List<String> categories, LocalDate date,
                                            BigDecimal price, Boolean isFree,
                                            int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        String kw = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;
        String loc = (location != null && !location.trim().isEmpty()) ? location.trim() : null;
        List<String> cat = (categories != null && !categories.isEmpty()) ? categories : null;

        LocalDateTime startOfDay = null;
        LocalDateTime endOfDay = null;

        if (date != null) {
            startOfDay = date.atStartOfDay(); // Tương đương 00:00:00
            endOfDay = date.atTime(23, 59, 59); // Tương đương 23:59:59
        }

        Page<Event> events = eventRepository.searchEvents(EventStatus.APPROVED, kw, loc, cat, startOfDay, endOfDay, price, isFree,
                pageable);
        return events.map(event -> mapToResponse(event));
    }

    public EventResponse getEventBySlug(String eventSlug) {
        Event event = eventRepository.findEventByEventSlug(eventSlug);
        return mapToResponse(event);
    }

    private EventResponse mapToResponse(Event event) {

        EventCategoryResponse eventCategoryResponse = null;
        if (event.getCategory() != null) {
            eventCategoryResponse = EventCategoryResponse.builder()
                    .categoryId(event.getCategory().getCategoryId())
                    .categoryName(event.getCategory().getCategoryName())
                    .categorySlug(event.getCategory().getCategorySlug())
                    .iconUrl(event.getCategory().getIconUrl())
                    .colorCode(event.getCategory().getColorCode())
                    .build();
        }

        OrganizerResponse organizerResponse = null;
        if (event.getOrganizer() != null) {
            organizerResponse = OrganizerResponse.builder()
                    .userId(event.getOrganizer().getUserId())
                    .fullName(event.getOrganizer().getFullName())
                    .avatarUrl(event.getOrganizer().getAvatarUrl())
                    .email(event.getOrganizer().getEmail())
                    .build();
        }

        BigDecimal minPrice = null;
        if (event.getTicketTypes() != null) {
            minPrice = event.getTicketTypes().stream()
                    .filter((ticket) -> ticket.getIsActive())
                    .map((ticket) -> ticket.getPrice())
                    .min((price1, price2) -> price1.compareTo(price2))
                    .orElse(null);
        }

        List<TicketTypeResponse> ticketTypeResponses = new ArrayList<>();
        if (event.getTicketTypes() != null && !event.getTicketTypes().isEmpty()) {
            ticketTypeResponses = event.getTicketTypes().stream()
                    .map(ticket -> TicketTypeResponse.builder()
                            .ticketTypeId(ticket.getTicketTypeId())
                            .ticketName(ticket.getTicketName())
                            .price(ticket.getPrice())
                            .isActive(ticket.getIsActive())
                            .description(ticket.getDescription())
                            .quantity(ticket.getQuantity())
                            .reservedCount(ticket.getReservedCount())
                            .soldCount(ticket.getSoldCount())
                            .saleStart(ticket.getSaleStart())
                            .saleEnd(ticket.getSaleEnd())
                            .build())
                    .collect(Collectors.toList());
        }

        List<EventAgendaResponse> eventAgendaResponse = new ArrayList<>();
        if (!event.getAgendas().isEmpty()) {
            eventAgendaResponse = event.getAgendas().stream()
                    .map((agenda) -> EventAgendaResponse.builder()
                            .agendaId((agenda.getAgendaId()))
                            .title(agenda.getTitle())
                            .description(agenda.getDescription())
                            .startTime(agenda.getStartTime())
                            .endTime(agenda.getEndTime())
                            .location(agenda.getLocation())
                            .orderIndex(agenda.getOrderIndex())
                            .build())
                    .collect(Collectors.toList());
        }


        return EventResponse.builder()
                .eventId(event.getEventId())
                .eventName(event.getEventName())
                .eventSlug(event.getEventSlug())
                .description(event.getDescription())
                .location(event.getLocation())
                .locationCoordinates(event.getLocationCoordinates())
                .startDate(event.getStartDate())
                .endDate(event.getEndDate())
                .bannerUrl(event.getBannerUrl())
                .imageGallery(event.getImageGallery())
                .status(event.getStatus() != null ? event.getStatus().name() : null)
                .isFree(event.getIsFree())
                .totalCapacity(event.getTotalCapacity())
                .registeredCount(event.getRegisteredCount())
                .checkedInCount(event.getCheckedInCount())
                .metadata(event.getMetadata())
                .createdAt(event.getCreatedAt())
                .updatedAt(event.getUpdatedAt())
                .category(eventCategoryResponse)
                .organizer(organizerResponse)
                .minPrice(minPrice)
                .agendas(eventAgendaResponse)
                .ticketTypes(ticketTypeResponses)
                .build();
    }
}
