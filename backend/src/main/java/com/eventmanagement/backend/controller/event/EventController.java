package com.eventmanagement.backend.controller.event;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eventmanagement.backend.dto.response.attendee.EventResponse;
import com.eventmanagement.backend.service.EventService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EventController {

    private final EventService eventService;

    @GetMapping("/featured")
    public ResponseEntity<List<EventResponse>> getTopNewEvents() {
        List<EventResponse> eventResponses = eventService.getTopNewEvents();
        return ResponseEntity.ok(eventResponses);
    }

    @GetMapping("/hot")
    public ResponseEntity<List<EventResponse>> getTopHotEvents() {
        List<EventResponse> eventResponses = eventService.getHotEvents();
        return ResponseEntity.ok(eventResponses);
    }


}

