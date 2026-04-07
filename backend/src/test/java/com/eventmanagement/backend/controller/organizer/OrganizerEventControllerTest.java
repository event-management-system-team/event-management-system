package com.eventmanagement.backend.controller.organizer;

import com.eventmanagement.backend.dto.response.organizer.AttendeeResponse;
import com.eventmanagement.backend.dto.response.organizer.CreateEventResponse;
import com.eventmanagement.backend.dto.response.organizer.OrganizerEventResponse;
import com.eventmanagement.backend.dto.response.organizer.OrganizerEventStatsResponse;
import com.eventmanagement.backend.model.User;
import com.eventmanagement.backend.service.OrganizerEventService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrganizerEventControllerTest {

    @Mock
    private OrganizerEventService organizerEventService;

    @Mock
    private Authentication authentication;

    @Mock
    private SecurityContext securityContext;

    @InjectMocks
    private OrganizerEventController controller;

    private User organizer;
    private UUID organizerId;

    @BeforeEach
    void setUp() {
        organizerId = UUID.randomUUID();
        organizer = User.builder()
                .userId(organizerId)
                .fullName("Test Organizer")
                .email("organizer@test.com")
                .build();

        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(organizer);
        SecurityContextHolder.setContext(securityContext);
    }

    // CREATE EVENT - RETURNS CREATED (201)
    @Test
    void createEvent_ReturnsCreated() {
        CreateEventResponse response = CreateEventResponse.builder()
                .eventId(UUID.randomUUID())
                .eventName("New Event")
                .status("PENDING")
                .build();

        when(organizerEventService.createEvent(eq(organizer), any(), any()))
                .thenReturn(response);

        ResponseEntity<CreateEventResponse> result = controller.createEvent(null, null);

        assertEquals(HttpStatus.CREATED, result.getStatusCode());
        assertEquals("New Event", result.getBody().getEventName());
    }

    // CREATE EVENT - DRAFT RETURNS OK (200)
    @Test
    void createEvent_Draft_ReturnsOk() {
        CreateEventResponse response = CreateEventResponse.builder()
                .eventId(UUID.randomUUID())
                .eventName("Draft Event")
                .status("DRAFT")
                .build();

        when(organizerEventService.createEvent(eq(organizer), any(), any()))
                .thenReturn(response);

        ResponseEntity<CreateEventResponse> result = controller.createEvent(null, null);

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals("DRAFT", result.getBody().getStatus());
    }

    // GET MY EVENTS - RETURNS OK
    @Test
    void getMyEvents_ReturnsOk() {
        OrganizerEventResponse eventResponse = OrganizerEventResponse.builder()
                .eventId(UUID.randomUUID())
                .eventName("My Event")
                .status("APPROVED")
                .build();

        Page<OrganizerEventResponse> page = new PageImpl<>(List.of(eventResponse));
        when(organizerEventService.getMyEvents(organizerId, 0, 10, null))
                .thenReturn(page);

        ResponseEntity<Page<OrganizerEventResponse>> result = controller.getMyEvents(0, 10, null);

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(1, result.getBody().getContent().size());
        assertEquals("My Event", result.getBody().getContent().get(0).getEventName());
    }

    // GET MY EVENT STATS - RETURNS OK
    @Test
    void getMyEventStats_ReturnsOk() {
        OrganizerEventStatsResponse stats = OrganizerEventStatsResponse.builder()
                .totalEvents(10)
                .activeCount(3)
                .completedCount(2)
                .build();

        when(organizerEventService.getMyEventStats(organizerId))
                .thenReturn(stats);

        ResponseEntity<OrganizerEventStatsResponse> result = controller.getMyEventStats();

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(10, result.getBody().getTotalEvents());
        assertEquals(3, result.getBody().getActiveCount());
    }

    // GET EVENT DETAIL - RETURNS OK
    @Test
    void getEventDetail_ReturnsOk() {
        UUID eventId = UUID.randomUUID();
        OrganizerEventResponse eventResponse = OrganizerEventResponse.builder()
                .eventId(eventId)
                .eventName("Detail Event")
                .status("APPROVED")
                .totalSold(50)
                .totalTickets(100)
                .totalRevenue(BigDecimal.valueOf(5000))
                .build();

        when(organizerEventService.getEventDetail(eventId))
                .thenReturn(eventResponse);

        ResponseEntity<OrganizerEventResponse> result = controller.getEventDetail(eventId);

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals("Detail Event", result.getBody().getEventName());
        assertEquals(50, result.getBody().getTotalSold());
    }

    // GET ATTENDEES - RETURNS OK
    @Test
    void getEventAttendees_ReturnsOk() {
        UUID eventId = UUID.randomUUID();
        AttendeeResponse attendee = AttendeeResponse.builder()
                .id(UUID.randomUUID())
                .fullName("John Doe")
                .email("john@test.com")
                .ticketType("VIP")
                .status("registered")
                .registrationDate(LocalDateTime.now())
                .build();

        Page<AttendeeResponse> page = new PageImpl<>(List.of(attendee));
        when(organizerEventService.getEventAttendees(eventId, 0, 10, null, null))
                .thenReturn(page);

        ResponseEntity<Page<AttendeeResponse>> result = controller.getEventAttendees(eventId, 0, 10, null, null);

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(1, result.getBody().getContent().size());
        assertEquals("John Doe", result.getBody().getContent().get(0).getFullName());
    }

    // DELETE EVENT - RETURNS NO CONTENT (204)
    @Test
    void deleteEvent_ReturnsNoContent() {
        UUID eventId = UUID.randomUUID();

        doNothing().when(organizerEventService).deleteEvent(eventId, organizer);

        ResponseEntity<Void> result = controller.deleteEvent(eventId);

        assertEquals(HttpStatus.NO_CONTENT, result.getStatusCode());
        verify(organizerEventService).deleteEvent(eventId, organizer);
    }
}
