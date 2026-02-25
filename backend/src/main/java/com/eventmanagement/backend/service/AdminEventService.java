package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.response.admin.EventResponse;
import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminEventService {
    private final EventRepository eventRepository;

    public Page<EventResponse> getAllEvents(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Event> eventPage = eventRepository.findAll(pageable);

        return eventPage.map(this::mapToResponse);
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

        return EventResponse.builder()
                .eventId(event.getEventId())
                .eventName(event.getEventName())
                .eventSlug(event.getEventSlug())
                .description(event.getDescription())
                .location(event.getLocation())
                .startDate(event.getStartDate())
                .endDate(event.getEndDate())
                .bannerUrl(event.getBannerUrl())
                .status(event.getStatus().name())
                .isFree(event.getIsFree())
                .totalCapacity(event.getTotalCapacity())
                .registeredCount(event.getRegisteredCount())
                .createdAt(event.getCreatedAt())
                .updatedAt(event.getUpdatedAt())
                .category(categoryDto)
                .organizer(organizerDto)
                .build();
    }
}
