package com.eventmanagement.backend.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.eventmanagement.backend.constants.EventStatus;
import com.eventmanagement.backend.dto.response.attendee.EventResponse;
import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.repository.EventRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;

   public List<EventResponse> getTopNewEvents() {
    List<Event> events = eventRepository.findTop6ByStatusOrderByRegisteredCountDesc(EventStatus.APPROVED);
    return events.stream().map(this::mapToResponse).collect(Collectors.toList());
}

public List<EventResponse> getHotEvents() {
    Pageable topSix = PageRequest.of(0, 6);
 
    List<Event> events = eventRepository.findHotEventsSellingFast(EventStatus.APPROVED, topSix);
    return events.stream().map(this::mapToResponse).collect(Collectors.toList());
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
