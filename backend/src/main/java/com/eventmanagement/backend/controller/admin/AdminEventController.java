package com.eventmanagement.backend.controller.admin;

import com.eventmanagement.backend.dto.request.RejectEventRequest;
import com.eventmanagement.backend.dto.response.admin.EventResponse;
import com.eventmanagement.backend.dto.response.attendee.EventCategoryResponse;
import com.eventmanagement.backend.repository.EventRepository;
import com.eventmanagement.backend.service.AdminEventService;
import com.eventmanagement.backend.service.EventCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/events")
@RequiredArgsConstructor
public class AdminEventController {
    private final AdminEventService eventService;
    private final EventRepository eventRepository;
    private final EventCategoryService eventCategoryService;

    @GetMapping
    public ResponseEntity<Page<EventResponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(eventService.getAllEvents(page, size));
    }

    @GetMapping("/all")
    public ResponseEntity<List<EventResponse>> getAll() {
        List<EventResponse> events = eventService.getAllEventsPlain();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<EventCategoryResponse>> getAllCategories() {
        List<EventCategoryResponse> categoryResponses = eventCategoryService.getAllCategories();
        return ResponseEntity.ok(categoryResponses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> getDetail(@PathVariable UUID id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<Void> approveEvent(@PathVariable UUID id) {
        eventService.approveEvent(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<Void> rejectEvent(@PathVariable UUID id, @RequestBody @Valid RejectEventRequest request) {
        eventService.rejectEvent(id, request.getReason());
        return ResponseEntity.noContent().build();
    }
}
