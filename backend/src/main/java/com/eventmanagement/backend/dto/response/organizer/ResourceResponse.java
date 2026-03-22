package com.eventmanagement.backend.dto.response.organizer;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class ResourceResponse {
    private UUID resourceId;
    private String resourceName;
    private String description;
    private String fileUrl;
    private String fileType;
    private Integer fileSize;
    private String resourceType;
    private LocalDateTime createdAt;
}
