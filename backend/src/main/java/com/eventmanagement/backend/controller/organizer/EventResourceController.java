package com.eventmanagement.backend.controller.organizer;

import com.eventmanagement.backend.dto.request.CreateResourceRequest;
import com.eventmanagement.backend.dto.response.organizer.ResourceResponse;
import com.eventmanagement.backend.service.EventResourceService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventResourceController {

    private final EventResourceService eventResourceService;

    @PostMapping(value = "/{eventId}/resources", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResourceResponse> createResource(
            @PathVariable UUID eventId,
            @RequestPart("data") String data,
            @RequestPart("file") MultipartFile file
    ) throws IOException {

        ObjectMapper mapper = new ObjectMapper();
        CreateResourceRequest request = mapper.readValue(data, CreateResourceRequest.class);

        return ResponseEntity.ok(
                eventResourceService.createResource(eventId, request, file)
        );
    }

    @GetMapping("/{eventId}/resources")
    public ResponseEntity<List<ResourceResponse>> getResources(@PathVariable UUID eventId) {
        return ResponseEntity.ok(
                eventResourceService.getResources(eventId)
        );
    }
}
