package com.eventmanagement.backend.controller.admin;

import com.eventmanagement.backend.dto.request.RejectEventRequest;
import com.eventmanagement.backend.dto.response.admin.EventResponse;
import com.eventmanagement.backend.dto.response.attendee.EventCategoryResponse;
import com.eventmanagement.backend.service.AdminEventService;
import com.eventmanagement.backend.service.EventCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class AdminEventController {
    private final AdminEventService eventService;
    private final EventCategoryService eventCategoryService;

    @GetMapping
    public ResponseEntity<Page<EventResponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(eventService.getAllEvents(page, size));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EventResponse>> getAll() {
        List<EventResponse> events = eventService.getAllEventsPlain();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/categories")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EventCategoryResponse>> getAllCategories() {
        List<EventCategoryResponse> categoryResponses = eventCategoryService.getAllCategories();
        return ResponseEntity.ok(categoryResponses);
    }

    @GetMapping("/detail/{slug}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventResponse> getDetail(@PathVariable String slug) {
        return ResponseEntity.ok(eventService.getEventBySlug(slug));
    }

    @PatchMapping("/{slug}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> approveEvent(@PathVariable String slug) {
        eventService.approveEvent(slug);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{slug}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> rejectEvent(@PathVariable String slug, @RequestBody @Valid RejectEventRequest request) {
        eventService.rejectEvent(slug, request.getReason());
        return ResponseEntity.noContent().build();
    }
}
