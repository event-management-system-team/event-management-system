package com.eventmanagement.backend.controller.admin;

import com.eventmanagement.backend.dto.response.admin.EventResponse;
import com.eventmanagement.backend.repository.EventRepository;
import com.eventmanagement.backend.service.AdminEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/events")
@RequiredArgsConstructor
public class AdminEventController {
    private final AdminEventService eventService;
    private final EventRepository eventRepository;

    @GetMapping
    public ResponseEntity<Page<EventResponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(eventService.getAllEvents(page, size));
    }
}
