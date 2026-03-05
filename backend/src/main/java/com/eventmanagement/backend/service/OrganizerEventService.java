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
    private final EventCategoryRepository eventCategoryRepository;
    private final CloudinaryService cloudinaryService;

    // create event for organizer with cover image
    @Transactional
    public CreateEventResponse createEvent(User organizer, CreateEventRequest request, MultipartFile coverFile) {
        EventCategory category = eventCategoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new NotFoundException("Category not found: " + request.getCategoryId()));

        LocalDateTime startDateTime = parseDateTime(request.getStartDate(), request.getStartTime());
        LocalDateTime endDateTime = parseDateTime(request.getEndDate(), request.getEndTime());

        if (endDateTime.isBefore(startDateTime)) {
            throw new BadRequestException("End date/time must be after start date/time");
        }

        if (!request.isDraft() && startDateTime.isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Start date/time must be in the future");
        }

        String bannerUrl = null;
        if (coverFile != null && !coverFile.isEmpty()) {
            try {
                bannerUrl = cloudinaryService.uploadEventBanner(coverFile);
            } catch (IOException e) {
                throw new BadRequestException("Failed to upload cover image: " + e.getMessage());
            }
        }

        String slug = generateSlug(request.getEventName());

        EventStatus status = request.isDraft() ? EventStatus.DRAFT : EventStatus.PENDING;

        int totalCapacity = 0;
        if (request.getTickets() != null) {
            totalCapacity = request.getTickets().stream()
                    .mapToInt(t -> t.getQuantity() != null ? t.getQuantity() : 0)
                    .sum();
        }

        Event event = Event.builder()
                .organizer(organizer)
                .category(category)
                .eventName(request.getEventName())
                .eventSlug(slug)
                .description(request.getDescription())
                .location(request.getLocation())
                .startDate(startDateTime)
                .endDate(endDateTime)
                .bannerUrl(bannerUrl)
                .isFree(request.isFree())
                .totalCapacity(totalCapacity)
                .status(status)
                .build();

        if (request.getTickets() != null) {
            Set<TicketType> ticketTypes = new LinkedHashSet<>();
            for (CreateEventRequest.TicketRequest ticketReq : request.getTickets()) {
                BigDecimal price = request.isFree() ? BigDecimal.ZERO
                        : (ticketReq.getPrice() != null ? ticketReq.getPrice() : BigDecimal.ZERO);

                TicketType ticketType = TicketType.builder()
                        .event(event)
                        .ticketName(ticketReq.getName())
                        .quantity(ticketReq.getQuantity() != null ? ticketReq.getQuantity() : 0)
                        .price(price)
                        .isActive(true)
                        .build();
                ticketTypes.add(ticketType);
            }
            event.setTicketTypes(ticketTypes);
        }

        Event saved = eventRepository.save(event);

        log.info("Event created: id={}, name={}, status={}", saved.getEventId(), saved.getEventName(),
                saved.getStatus());

        return mapToCreateEventResponse(saved);
    }

    // parse date time from string
    private LocalDateTime parseDateTime(String dateStr, String timeStr) {
        LocalDate date = LocalDate.parse(dateStr, DateTimeFormatter.ISO_LOCAL_DATE);
        LocalTime time = LocalTime.parse(timeStr, DateTimeFormatter.ISO_LOCAL_TIME);
        return LocalDateTime.of(date, time);
    }

    // generate slug for event
    private String generateSlug(String name) {
        String normalized = Normalizer.normalize(name, Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
        String slug = normalized.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("[\\s]+", "-")
                .replaceAll("-{2,}", "-")
                .replaceAll("^-|-$", "");

        String suffix = UUID.randomUUID().toString().substring(0, 8);
        return slug + "-" + suffix;
    }

    // map event to create event response
    private CreateEventResponse mapToCreateEventResponse(Event event) {
        List<CreateEventResponse.TicketResponse> ticketResponses = new ArrayList<>();
        if (event.getTicketTypes() != null) {
            for (TicketType tt : event.getTicketTypes()) {
                ticketResponses.add(CreateEventResponse.TicketResponse.builder()
                        .ticketTypeId(tt.getTicketTypeId())
                        .ticketName(tt.getTicketName())
                        .quantity(tt.getQuantity())
                        .price(tt.getPrice())
                        .build());
            }
        }

        return CreateEventResponse.builder()
                .eventId(event.getEventId())
                .eventName(event.getEventName())
                .eventSlug(event.getEventSlug())
                .description(event.getDescription())
                .location(event.getLocation())
                .bannerUrl(event.getBannerUrl())
                .startDate(event.getStartDate())
                .endDate(event.getEndDate())
                .status(event.getStatus().name())
                .isFree(event.getIsFree())
                .totalCapacity(event.getTotalCapacity())
                .categoryName(event.getCategory() != null ? event.getCategory().getCategoryName() : null)
                .tickets(ticketResponses)
                .build();
    }

    /**
     * Lấy danh sách event của organizer có phân trang, sắp xếp theo ngày tạo mới
     * nhất
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
        long upcoming = eventRepository.countByOrganizer_UserIdAndStatusAndStartDateAfterNow(organizerId,
                EventStatus.APPROVED);
        // tổng số event đã được phê duyệt
        long allApproved = eventRepository.countByOrganizer_UserIdAndStatus(organizerId, EventStatus.APPROVED);
        // tổng số event đang diễn ra
        long ongoing = eventRepository.countByOrganizer_UserIdAndStatus(organizerId, EventStatus.ONGOING);
        // logic tính tổng số event đang diễn ra: tổng số event đã được phê duyệt trừ đi
        // tổng số event đang diễn ra
        long active = (allApproved - upcoming) + ongoing;
        // tổng số event đã hoàn thành
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
