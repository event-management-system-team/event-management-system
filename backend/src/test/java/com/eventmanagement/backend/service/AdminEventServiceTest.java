package com.eventmanagement.backend.service;

import com.eventmanagement.backend.constants.EventStatus;
import com.eventmanagement.backend.exception.BadRequestException;
import com.eventmanagement.backend.exception.NotFoundException;
import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.repository.EventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminEventServiceTest {
    @Mock
    private EventRepository eventRepository;

    @InjectMocks
    private AdminEventService eventService;

    private UUID eventId;
    private Event event;

    @BeforeEach
    void setUp() {
        eventId = UUID.randomUUID();
        event = new Event();
        event.setEventId(eventId);
        event.setStatus(EventStatus.PENDING);
    }

    // APPROVE SUCCESS
    @Test
    void approveEvent_Pending_Success() {

        when(eventRepository.findById(eventId))
                .thenReturn(Optional.of(event));

        eventService.approveEvent(eventId);

        assertEquals(EventStatus.APPROVED, event.getStatus());
        assertNull(event.getRejectionReason());
        verify(eventRepository).save(event);
    }

    // APPROVE - NOT FOUND
    @Test
    void approveEvent_NotFound_ThrowException() {

        when(eventRepository.findById(eventId))
                .thenReturn(Optional.empty());

        assertThrows(NotFoundException.class,
                () -> eventService.approveEvent(eventId));
    }

    // APPROVE - STATUS NOT PENDING
    @Test
    void approveEvent_NotPending_ThrowBadRequest() {

        event.setStatus(EventStatus.APPROVED);

        when(eventRepository.findById(eventId))
                .thenReturn(Optional.of(event));

        assertThrows(BadRequestException.class,
                () -> eventService.approveEvent(eventId));
    }

    // REJECT SUCCESS
    @Test
    void rejectEvent_Pending_Success() {

        when(eventRepository.findById(eventId))
                .thenReturn(Optional.of(event));

        eventService.rejectEvent(eventId, "Invalid content");

        assertEquals(EventStatus.REJECTED, event.getStatus());
        assertEquals("Invalid content", event.getRejectionReason());
        verify(eventRepository).save(event);
    }

    // REJECT - STATUS NOT PENDING
    @Test
    void rejectEvent_NotPending_ThrowBadRequest() {

        event.setStatus(EventStatus.APPROVED);

        when(eventRepository.findById(eventId))
                .thenReturn(Optional.of(event));

        assertThrows(BadRequestException.class,
                () -> eventService.rejectEvent(eventId, "Reason"));
    }
}
