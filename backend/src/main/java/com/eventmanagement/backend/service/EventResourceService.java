package com.eventmanagement.backend.service;

import com.eventmanagement.backend.dto.request.CreateResourceRequest;
import com.eventmanagement.backend.dto.response.organizer.ResourceResponse;
import com.eventmanagement.backend.exception.NotFoundException;
import com.eventmanagement.backend.model.Event;
import com.eventmanagement.backend.model.EventResource;
import com.eventmanagement.backend.repository.EventRepository;
import com.eventmanagement.backend.repository.EventResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EventResourceService {

    private final EventRepository eventRepository;
    private final EventResourceRepository eventResourceRepository;
    private final CloudinaryService cloudinaryService;

    @Transactional
    public ResourceResponse createResource(
            UUID eventId,
            CreateResourceRequest req,
            MultipartFile file
    ) throws IOException {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new NotFoundException("Event not found"));

        String fileUrl = cloudinaryService.uploadResource(file, eventId);

        EventResource resource = EventResource.builder()
                .event(event)
                .resourceName(req.getResourceName())
                .description(req.getDescription())
                .fileUrl(fileUrl)
                .fileType(file.getContentType())
                .fileSize((int) file.getSize())
                .resourceType(req.getResourceType())
                .build();
        eventResourceRepository.save(resource);

        return ResourceResponse.builder()
                .resourceId(resource.getResourceId())
                .resourceName(resource.getResourceName())
                .description(resource.getDescription())
                .fileUrl(resource.getFileUrl())
                .fileType(resource.getFileType())
                .fileSize(resource.getFileSize())
                .resourceType(resource.getResourceType().name())
                .createdAt(resource.getCreatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public List<ResourceResponse> getResources(UUID eventId) {

        if (!eventRepository.existsById(eventId)) {
            throw new NotFoundException("Event not found");
        }

        return eventResourceRepository
                .findByEvent_EventIdOrderByCreatedAtDesc(eventId)
                .stream()
                .map(resource -> ResourceResponse.builder()
                        .resourceId(resource.getResourceId())
                        .resourceName(resource.getResourceName())
                        .description(resource.getDescription())
                        .fileUrl(resource.getFileUrl())
                        .fileType(resource.getFileType())
                        .fileSize(resource.getFileSize())
                        .resourceType(resource.getResourceType().name())
                        .createdAt(resource.getCreatedAt())
                        .build()
                )
                .toList();
    }
}
