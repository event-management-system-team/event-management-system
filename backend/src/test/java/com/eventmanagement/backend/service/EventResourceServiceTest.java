package com.eventmanagement.backend.service;

import com.eventmanagement.backend.constants.EventStatus;
import com.eventmanagement.backend.constants.ResourceType;
import com.eventmanagement.backend.dto.request.CreateResourceRequest;
import com.eventmanagement.backend.dto.response.organizer.AssignmentResponse;
import com.eventmanagement.backend.dto.response.organizer.ResourceResponse;
import com.eventmanagement.backend.exception.BadRequestException;
import com.eventmanagement.backend.exception.ForbiddenException;
import com.eventmanagement.backend.exception.NotFoundException;
import com.eventmanagement.backend.model.*;
import com.eventmanagement.backend.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class EventResourceServiceTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private EventResourceRepository eventResourceRepository;

    @InjectMocks
    private EventResourceService eventResourceService;

    private UUID eventId;
    private CreateResourceRequest request;
    private Event event;

//    @BeforeEach
//    void setUp() {
//        eventId = UUID.randomUUID();
//
//        event = Event.builder()
//                .eventId(eventId)
//                .build();
//
//        request = CreateResourceRequest.builder()
//                .resourceName("Stage Plan")
//                .description("Stage layout file")
//                .fileUrl("https://example.com/file.pdf")
//                .fileType("pdf")
//                .fileSize(1024)
//                .resourceType(ResourceType.DOCUMENT)
//                .build();
//    }

    // EVENT NOT FOUND
//    @Test
//    void createResource_EventNotFound_ThrowException() {
//
//        when(eventRepository.findById(eventId))
//                .thenReturn(Optional.empty());
//
//        assertThrows(NotFoundException.class,
//                () -> eventResourceService.createResource(eventId, request));
//    }

    // CREATE SUCCESS
//    @Test
//    void createResource_Success() {
//
//        when(eventRepository.findById(eventId))
//                .thenReturn(Optional.of(event));
//
//        when(eventResourceRepository.save(any()))
//                .thenAnswer(invocation -> {
//                    EventResource r = invocation.getArgument(0);
//                    r.setResourceId(UUID.randomUUID());
//                    r.setCreatedAt(LocalDateTime.now());
//                    return r;
//                });
//
//        ResourceResponse response =
//                eventResourceService.createResource(eventId, request);
//
//        assertNotNull(response);
//        assertEquals("Stage Plan", response.getResourceName());
//        assertEquals("pdf", response.getFileType());
//        assertEquals("DOCUMENT", response.getResourceType());
//
//        verify(eventResourceRepository).save(any());
//    }
}
