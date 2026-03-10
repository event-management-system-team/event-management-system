package com.eventmanagement.backend.controller.organizer;

import com.eventmanagement.backend.dto.request.CreateEventRequest;
import com.eventmanagement.backend.dto.response.organizer.AttendeeResponse;
import com.eventmanagement.backend.dto.response.organizer.CreateEventResponse;
import com.eventmanagement.backend.dto.response.organizer.OrganizerEventResponse;
import com.eventmanagement.backend.dto.response.organizer.OrganizerEventStatsResponse;
import com.eventmanagement.backend.exception.UnauthorizedException;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.service.OrganizerEventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/organizer/events")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrganizerEventController {

    private final OrganizerEventService organizerEventService;

    //endpoint for create event
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CreateEventResponse> createEvent(
            @RequestPart("event") @Valid CreateEventRequest request,
            @RequestPart(value = "coverFile", required = false) MultipartFile coverFile) {

        User organizer = getAuthenticatedUser();

        CreateEventResponse response = organizerEventService.createEvent(organizer, request, coverFile);
        HttpStatus status = "DRAFT".equals(response.getStatus()) ? HttpStatus.OK : HttpStatus.CREATED;
        return ResponseEntity.status(status).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<OrganizerEventResponse>> getMyEvents(
            @RequestParam UUID organizerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<OrganizerEventResponse> events = organizerEventService.getMyEvents(organizerId, page, size);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/stats")
    public ResponseEntity<OrganizerEventStatsResponse> getMyEventStats(
            @RequestParam UUID organizerId) {

        OrganizerEventStatsResponse stats = organizerEventService.getMyEventStats(organizerId);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<OrganizerEventResponse> getEventDetail(
            @PathVariable UUID eventId) {
        
        OrganizerEventResponse event = organizerEventService.getEventDetail(eventId);
        return ResponseEntity.ok(event);
    }

    @GetMapping("/{eventId}/attendees")
    public ResponseEntity<Page<AttendeeResponse>> getEventAttendees(
            @PathVariable UUID eventId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<AttendeeResponse> attendees = organizerEventService.getEventAttendees(eventId, page, size);
        return ResponseEntity.ok(attendees);
    }

    // get authenticated user
    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof User)) {
            throw new UnauthorizedException("Authentication required");
        }
        return (User) authentication.getPrincipal();
    }
}
