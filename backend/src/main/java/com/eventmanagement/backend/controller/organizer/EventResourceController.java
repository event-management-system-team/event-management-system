package com.eventmanagement.backend.controller.organizer;

import com.eventmanagement.backend.dto.request.CreateResourceRequest;
import com.eventmanagement.backend.dto.response.organizer.ResourceResponse;
import com.eventmanagement.backend.service.EventResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventResourceController {

    private final EventResourceService eventResourceService;

    @PostMapping("/{eventId}/resources")
    public ResponseEntity<ResourceResponse> createResource(
            @PathVariable UUID eventId,
            @Valid @RequestBody CreateResourceRequest request
    ) {
        return ResponseEntity.ok(
                eventResourceService.createResource(eventId, request)
        );
    }

//    @GetMapping
//    public ResponseEntity<List<ResourceResponse>> getResources(@PathVariable UUID eventId) {
//        return ResponseEntity.ok();
//    }
}
