package com.eventmanagement.backend.service;

import com.eventmanagement.backend.constants.EventStatus;
import com.eventmanagement.backend.dto.response.attendee.EventResponse;
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

        LocalDateTime dateTime = null;
        if (date != null) {
            // Biến ngày "25/04/2026" thành "25/04/2026 23:59:59" để tìm các sự kiện đang diễn ra trong ngày đó
            dateTime = date.atTime(23, 59, 59);
        }

        Page<Event> events = eventRepository.searchEvents(EventStatus.APPROVED, kw, loc, cat, dateTime, price, isFree, pageable);
        return events.map(event -> mapToResponse(event));
    }


    private EventResponse mapToResponse(Event event) {

        EventResponse.CategoryDto categoryDto = null;
        if (event.getCategory() != null) {
            categoryDto = EventResponse.CategoryDto.builder()
                    .categoryId(event.getCategory().getCategoryId())
                    .categoryName(event.getCategory().getCategoryName())
                    .categorySlug(event.getCategory().getCategorySlug())
                    .iconUrl(event.getCategory().getIconUrl())
                    .colorCode(event.getCategory().getColorCode())
                    .build();
        }

        EventResponse.OrganizerDto organizerDto = null;
        if (event.getOrganizer() != null) {
            organizerDto = EventResponse.OrganizerDto.builder()
                    .userId(event.getOrganizer().getUserId())
                    .fullName(event.getOrganizer().getFullName())
                    .avatarUrl(event.getOrganizer().getAvatarUrl())
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
                .category(categoryDto)
                .organizer(organizerDto)
                .minPrice(minPrice)
                .build();
    }
}
