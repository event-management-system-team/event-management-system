package com.eventmanagement.backend.controller.event_category;


import com.eventmanagement.backend.dto.response.attendee.EventCategoryResponse;
import com.eventmanagement.backend.service.EventCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EventCategoryController {

    private final EventCategoryService eventCategoryService;

    @GetMapping
    public ResponseEntity<List<EventCategoryResponse>> getAllCategories() {
        List<EventCategoryResponse> categoryResponses = eventCategoryService.getAllCategories();
        return ResponseEntity.ok(categoryResponses);
    }
}
