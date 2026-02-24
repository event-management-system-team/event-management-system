package com.eventmanagement.backend.controller.event;

import com.eventmanagement.backend.dto.response.attendee.EventResponse;
import com.eventmanagement.backend.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
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
    public ResponseEntity<Page<EventResponse>> searchEvents(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String category,
            @RequestParam(required = false)
            @DateTimeFormat(pattern = "dd/MM/yyyy") LocalDate date,
            @RequestParam(required = false) BigDecimal price,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<EventResponse> events = eventService.searchEvents(keyword, location, category, date, price, page, size);
        return ResponseEntity.ok(events);
    }


}

