package com.eventmanagement.backend.service;

import com.eventmanagement.backend.constants.EventStatus;
import com.eventmanagement.backend.dto.request.CreateEventRequest;
import com.eventmanagement.backend.dto.response.organizer.CreateEventResponse;
import com.eventmanagement.backend.dto.response.organizer.OrganizerEventResponse;
import com.eventmanagement.backend.dto.response.organizer.OrganizerEventStatsResponse;
import com.eventmanagement.backend.exception.BadRequestException;
import com.eventmanagement.backend.exception.NotFoundException;
import com.eventmanagement.backend.exception.UnauthorizedException;
import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.model.EventAgenda;
import com.eventmanagement.backend.model.EventCategory;
import com.eventmanagement.backend.model.TicketType;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.repository.EventCategoryRepository;
import com.eventmanagement.backend.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.text.Normalizer;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrganizerEventService {

    private final EventRepository eventRepository;
    private final EventCategoryRepository eventCategoryRepository;
    private final CloudinaryService cloudinaryService;

    // create event for organizer that support cover image
    @Transactional
    public CreateEventResponse createEvent(User organizer, CreateEventRequest request, MultipartFile coverFile) {
        EventCategory category = eventCategoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new NotFoundException("Category not found: " + request.getCategoryId()));

        LocalDateTime startDateTime = parseDateTime(request.getStartDate(), request.getStartTime());
        LocalDateTime endDateTime = parseDateTime(request.getEndDate(), request.getEndTime());

        if (endDateTime.isBefore(startDateTime)) {
            throw new BadRequestException("End date/time must be after start date/time");
        }

        //start date > now
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

        int totalCapacity;
        if (request.isFree()) {
            totalCapacity = request.getTotalCapacity() != null ? request.getTotalCapacity() : 0;
        } else {
            totalCapacity = request.getTickets() != null
                    ? request.getTickets().stream()
                            .mapToInt(t -> t.getQuantity() != null ? t.getQuantity() : 0)
                            .sum()
                    : 0;
        }

        Map<String, Object> locationCoordinates = null;
        if (request.getLocationCoordinates() != null && !request.getLocationCoordinates().isEmpty()) {
            locationCoordinates = new HashMap<>(request.getLocationCoordinates());
        }

        Event event = Event.builder()
                .organizer(organizer)
                .category(category)
                .eventName(request.getEventName())
                .eventSlug(slug)
                .description(request.getDescription())
                .location(request.getLocation())
                .locationCoordinates(locationCoordinates)
                .startDate(startDateTime)
                .endDate(endDateTime)
                .bannerUrl(bannerUrl)
                .isFree(request.isFree())
                .totalCapacity(totalCapacity)
                .status(status)
                .build();

        Set<TicketType> ticketTypes = new LinkedHashSet<>();
        if (request.isFree()) {
            TicketType freeTicket = TicketType.builder()
                    .event(event)
                    .ticketName("Free Admission")
                    .quantity(totalCapacity)
                    .price(BigDecimal.ZERO)
                    .isActive(true)
                    .build();
            ticketTypes.add(freeTicket);
        } else if (request.getTickets() != null) {
            for (CreateEventRequest.TicketRequest ticketReq : request.getTickets()) {
                BigDecimal price = ticketReq.getPrice() != null ? ticketReq.getPrice() : BigDecimal.ZERO;
                TicketType ticketType = TicketType.builder()
                        .event(event)
                        .ticketName(ticketReq.getName())
                        .quantity(ticketReq.getQuantity() != null ? ticketReq.getQuantity() : 0)
                        .price(price)
                        .isActive(true)
                        .build();
                ticketTypes.add(ticketType);
            }
        }
        event.setTicketTypes(ticketTypes);

        Set<EventAgenda> agendas = new LinkedHashSet<>();
        if (request.getAgenda() != null && !request.getAgenda().isEmpty()) {
            int order = 0;
            for (CreateEventRequest.AgendaRequest agendaReq : request.getAgenda()) {
                LocalDateTime agendaStart = parseDateTime(request.getStartDate(), agendaReq.getStartTime());
                LocalDateTime agendaEnd = parseDateTime(request.getStartDate(), agendaReq.getEndTime());

                EventAgenda agenda = EventAgenda.builder()
                        .event(event)
                        .title(agendaReq.getTitle())
                        .description(agendaReq.getDescription())
                        .startTime(agendaStart)
                        .endTime(agendaEnd)
                        .location(agendaReq.getLocation())
                        .orderIndex(order++)
                        .build();
                agendas.add(agenda);
            }
        }
        event.setAgendas(agendas);

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

        List<CreateEventResponse.AgendaResponse> agendaResponses = new ArrayList<>();
        if (event.getAgendas() != null) {
            for (EventAgenda ea : event.getAgendas()) {
                agendaResponses.add(CreateEventResponse.AgendaResponse.builder()
                        .agendaId(ea.getAgendaId())
                        .title(ea.getTitle())
                        .startTime(ea.getStartTime() != null ? ea.getStartTime().toLocalTime().toString() : null)
                        .endTime(ea.getEndTime() != null ? ea.getEndTime().toLocalTime().toString() : null)
                        .description(ea.getDescription())
                        .location(ea.getLocation())
                        .orderIndex(ea.getOrderIndex())
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
                .categoryId(event.getCategory() != null ? event.getCategory().getCategoryId() : null)
                .categoryName(event.getCategory() != null ? event.getCategory().getCategoryName() : null)
                .tickets(ticketResponses)
                .agendas(agendaResponses)
                .build();
    }

    /**
     * Xóa event vĩnh viễn (hard delete, bypass @SQLDelete).
     * Chỉ cho phép khi status là DRAFT hoặc PENDING.
     */
    @Transactional
    public void deleteEvent(UUID eventId, User organizer) {
        Event event = eventRepository.findWithDetailsById(eventId);
        if (event == null) {
            throw new NotFoundException("Event not found: " + eventId);
        }
        if (!event.getOrganizer().getUserId().equals(organizer.getUserId())) {
            throw new UnauthorizedException("You are not the organizer of this event");
        }
        if (event.getStatus() != EventStatus.DRAFT && event.getStatus() != EventStatus.PENDING) {
            throw new BadRequestException("Only DRAFT or PENDING events can be deleted");
        }
        eventRepository.hardDeleteAgendasByEventId(eventId);
        eventRepository.hardDeleteTicketsByEventId(eventId);
        eventRepository.hardDeleteById(eventId);
        log.info("Event hard-deleted: id={}, name={}", eventId, event.getEventName());
    }

    /**
     * Lấy chi tiết event theo ID (dành cho organizer edit)
     */
    public CreateEventResponse getEventById(UUID eventId, User organizer) {
        Event event = eventRepository.findWithDetailsById(eventId);
        if (event == null) {
            throw new NotFoundException("Event not found: " + eventId);
        }
        if (!event.getOrganizer().getUserId().equals(organizer.getUserId())) {
            throw new UnauthorizedException("You are not the organizer of this event");
        }
        return mapToCreateEventResponse(event);
    }

    /**
     * Cập nhật event (chỉ cho phép khi status là DRAFT hoặc PENDING)
     */
    @Transactional
    public CreateEventResponse updateEvent(UUID eventId, User organizer, CreateEventRequest request, MultipartFile coverFile) {
        Event event = eventRepository.findWithDetailsById(eventId);
        if (event == null) {
            throw new NotFoundException("Event not found: " + eventId);
        }
        if (!event.getOrganizer().getUserId().equals(organizer.getUserId())) {
            throw new UnauthorizedException("You are not the organizer of this event");
        }
        if (event.getStatus() != EventStatus.DRAFT && event.getStatus() != EventStatus.PENDING) {
            throw new BadRequestException("Only DRAFT or PENDING events can be edited");
        }

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

        if (coverFile != null && !coverFile.isEmpty()) {
            try {
                String bannerUrl = cloudinaryService.uploadEventBanner(coverFile);
                event.setBannerUrl(bannerUrl);
            } catch (IOException e) {
                throw new BadRequestException("Failed to upload cover image: " + e.getMessage());
            }
        }

        EventStatus status = request.isDraft() ? EventStatus.DRAFT : EventStatus.PENDING;

        int totalCapacity;
        if (request.isFree()) {
            totalCapacity = request.getTotalCapacity() != null ? request.getTotalCapacity() : 0;
        } else {
            totalCapacity = request.getTickets() != null
                    ? request.getTickets().stream()
                            .mapToInt(t -> t.getQuantity() != null ? t.getQuantity() : 0)
                            .sum()
                    : 0;
        }

        Map<String, Object> locationCoordinates = null;
        if (request.getLocationCoordinates() != null && !request.getLocationCoordinates().isEmpty()) {
            locationCoordinates = new HashMap<>(request.getLocationCoordinates());
        }

        event.setCategory(category);
        event.setEventName(request.getEventName());
        event.setDescription(request.getDescription());
        event.setLocation(request.getLocation());
        event.setLocationCoordinates(locationCoordinates);
        event.setStartDate(startDateTime);
        event.setEndDate(endDateTime);
        event.setIsFree(request.isFree());
        event.setTotalCapacity(totalCapacity);
        event.setStatus(status);

        event.getTicketTypes().clear();
        if (request.isFree()) {
            TicketType freeTicket = TicketType.builder()
                    .event(event)
                    .ticketName("Free Admission")
                    .quantity(totalCapacity)
                    .price(BigDecimal.ZERO)
                    .isActive(true)
                    .build();
            event.getTicketTypes().add(freeTicket);
        } else if (request.getTickets() != null) {
            for (CreateEventRequest.TicketRequest ticketReq : request.getTickets()) {
                BigDecimal price = ticketReq.getPrice() != null ? ticketReq.getPrice() : BigDecimal.ZERO;
                TicketType ticketType = TicketType.builder()
                        .event(event)
                        .ticketName(ticketReq.getName())
                        .quantity(ticketReq.getQuantity() != null ? ticketReq.getQuantity() : 0)
                        .price(price)
                        .isActive(true)
                        .build();
                event.getTicketTypes().add(ticketType);
            }
        }

        event.getAgendas().clear();
        if (request.getAgenda() != null && !request.getAgenda().isEmpty()) {
            int order = 0;
            for (CreateEventRequest.AgendaRequest agendaReq : request.getAgenda()) {
                LocalDateTime agendaStart = parseDateTime(request.getStartDate(), agendaReq.getStartTime());
                LocalDateTime agendaEnd = parseDateTime(request.getStartDate(), agendaReq.getEndTime());

                EventAgenda agenda = EventAgenda.builder()
                        .event(event)
                        .title(agendaReq.getTitle())
                        .description(agendaReq.getDescription())
                        .startTime(agendaStart)
                        .endTime(agendaEnd)
                        .location(agendaReq.getLocation())
                        .orderIndex(order++)
                        .build();
                event.getAgendas().add(agenda);
            }
        }

        Event saved = eventRepository.save(event);
        log.info("Event updated: id={}, name={}, status={}", saved.getEventId(), saved.getEventName(), saved.getStatus());
        return mapToCreateEventResponse(saved);
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
