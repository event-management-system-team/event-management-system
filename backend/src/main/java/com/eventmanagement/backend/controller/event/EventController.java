package com.eventmanagement.backend.controller.event;

import com.eventmanagement.backend.dto.response.attendee.EventResponse;
import com.eventmanagement.backend.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
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

    @GetMapping("/search")
    public ResponseEntity<Page<EventResponse>> searchEventsByLocation(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<EventResponse> events = eventService.searchEventsByLocation(keyword, location, page, size);
        return ResponseEntity.ok(events);
    }


}

