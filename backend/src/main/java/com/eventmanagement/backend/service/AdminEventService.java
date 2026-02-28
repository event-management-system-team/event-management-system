package com.eventmanagement.backend.service;

import com.eventmanagement.backend.constants.EventStatus;
import com.eventmanagement.backend.dto.response.admin.EventResponse;
import com.eventmanagement.backend.exception.BadRequestException;
import com.eventmanagement.backend.exception.NotFoundException;
import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminEventService {
    private final EventRepository eventRepository;

    public Page<EventResponse> getAllEvents(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Event> eventPage = eventRepository.findAll(pageable);

        return eventPage.map(this::mapToResponse);
    }

    public List<EventResponse> getAllEventsPlain() {
        return eventRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public EventResponse getEventById(UUID id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event does not exist"));
        EventResponse response = mapToResponse(event);

        return response;
    }

    @Transactional
    public void approveEvent(UUID id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Event not found"));

        if (event.getStatus() != EventStatus.PENDING) {
            throw new BadRequestException("Only PENDING event can be approved");
        }

        event.setStatus(EventStatus.APPROVED);
        event.setRejectionReason(null);
        event.setUpdatedAt(LocalDateTime.now());

        eventRepository.save(event);
    }

    @Transactional
    public void rejectEvent(UUID id, String reason) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Event not found"));

        if (event.getStatus() != EventStatus.PENDING) {
            throw new BadRequestException("Only PENDING event can be rejected");
        }

        event.setStatus(EventStatus.REJECTED);
        event.setRejectionReason(reason);
        event.setUpdatedAt(LocalDateTime.now());

        eventRepository.save(event);
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
